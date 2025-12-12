import { Worker, Job } from "bullmq";
// ...
// .update({ view_count: sql`view_count + 1` })
import { connection } from "../lib/redis"; // Your shared Redis connection
import { supabaseAdmin } from "../lib/supabase"; // Your shared Supabase client
import sendEmail from "../services/emailService";

// Name must match the queue name you used in the controller ('email_queue')
const worker = new Worker(
  "email_queue",
  async (job: Job) => {
    const { user_id, type, data, credits_used,brevoApiKey:brevoApiKey='' } = job.data;
    console.log(`[Job ${job.id}] ⏳ Processing email for User: ${user_id}`);

    function getCurrentISTTime() {
      const date = new Date();

      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Change to false for 24-hour format
      } as const;

      const istTime = date.toLocaleString("en-IN", options);
      return istTime;
    }

    const pickedUpAt = Date.now();
    const queuedTime = pickedUpAt - data.created_at;
    console.log(
      data.created_at,
    //   new Date(data.created_at),
    //   new Date(data.created_at).getTime()
    ); // Latency 1: Time in Queue

    try {
      console.log(`Sending email to: ${data.toEmail}`);
      console.log(`Subject: ${data.subject}`);
      console.log(`Content: ${data.htmlContent}`);

      const result = await sendEmail(
        data.toEmail,
        data.subject,
        data.htmlContent,
        data.fromEmail || "",
        brevoApiKey
      );
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Mark when the worker FINISHED
      const finishedAt = Date.now();
      const processingTime = finishedAt - pickedUpAt; // Latency 2: API Call Time
      const totalLatency = finishedAt - data.created_at; // Latency 3: End-to-End

      console.log(`Job waited in queue: ${queuedTime}ms`);
      console.log(`Email sending took: ${processingTime}ms`);
      console.log(`Total System Latency: ${totalLatency}ms`);

      // Simulate network delay (1 second)
      // await new Promise((resolve) => setTimeout(resolve, 1000));


      const responseData = {
        status: 200,
        message: "Notification sent successfully",
        message_id: `${result?.body.messageId}`,
        timestamp: getCurrentISTTime(),
      };

      const provider_response = result
        ? responseData
        : { message: "No response from provider" };

      // --- STEP 2: LOG SUCCESS TO SUPABASE ---
      const { error } = await supabaseAdmin.from("notification_logs").insert({
        user_id: user_id,
        channel: "EMAIL",
        status: "SENT",
        recipient: data.toEmail || "unknown@example.com",
        provider_response: provider_response,
        request_latency_ms: totalLatency,
        created_at: new Date().toISOString()
      });

      if (error) {
        console.error(
          `[Job ${job.id}] ❌ Failed to log to Supabase:`,
          error.message
        );
      } else {
        console.log(`[Job ${job.id}] ✅ Email sent and logged successfully.`);
      }

      return true; // Signal job completion
    } catch (error: any) {
      // --- STEP 3: HANDLE FAILURES ---
      console.error(`[Job ${job.id}] 💥 Job Failed:`, error);

      // Log failure to Supabase
      await supabaseAdmin.from("notification_logs").insert({
        user_id: data.user_id,
        channel: "EMAIL",
        status: "FAILED",
        error_message: error.message,
        recipient: data.toEmail,
      });

      throw error; // BullMQ will retry this job if you configured 'attempts'
    }
    finally{
      console.log("Updating credits", credits_used)
      await supabaseAdmin
      .from('profiles')
      .update({ credits_used : credits_used + 1})
      .eq('id',user_id)
      console.log("Updated credits")
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 emails at the same time
  }
);

console.log("📧 Email Worker is running...");

export default worker;
