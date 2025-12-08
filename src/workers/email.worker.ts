import { Worker, Job } from 'bullmq';
import { connection } from '../lib/redis'; // Your shared Redis connection
import { supabaseAdmin } from '../lib/supabase'; // Your shared Supabase client
import sendEmail from '../services/emailService';

// Name must match the queue name you used in the controller ('email_queue')
const worker = new Worker('email_queue', async (job:Job) => {
  console.log(job)
  console.log(`[Job ${job.id}] ⏳ Processing email for User: ${job.data.user_id}`);

  try {
    const { user_id, data } = job.data;

    // --- STEP 1: SIMULATE SENDING EMAIL (The "Work") ---
    // Later, you will replace this with: await sendgrid.send({...})
    console.log(`Sending email to: ${data.toEmail}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Content: ${data.htmlContent}`);

    const result = await sendEmail(data.toEmail, data.subject, data.htmlContent);
    
    // Simulate network delay (1 second)
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // const data = await sendEmail({})

    // --- STEP 2: LOG SUCCESS TO SUPABASE ---
    const { error } = await supabaseAdmin.from('notification_logs').insert({
      user_id: user_id,
      channel: 'EMAIL',
      status: 'SENT',
      recipient: data.to || 'unknown@example.com',
      // If you have a 'provider_response' column, you can save the raw ID here
      provider_response: result? JSON.stringify(result):null
    });

    if (error) {
      console.error(`[Job ${job.id}] ❌ Failed to log to Supabase:`, error.message);
    } else {
      console.log(`[Job ${job.id}] ✅ Email sent and logged successfully.`);
    }

    return true; // Signal job completion

  } catch (error: any) {
    // --- STEP 3: HANDLE FAILURES ---
    console.error(`[Job ${job.id}] 💥 Job Failed:`, error);
    
    // Log failure to Supabase
    await supabaseAdmin.from('notification_logs').insert({
      user_id: job.data.user_id,
      channel: 'EMAIL',
      status: 'FAILED',
      error_message: error.message,
      recipient: job.data.data.to
    });
    
    throw error; // BullMQ will retry this job if you configured 'attempts'
  }
}, { 
  connection, 
  concurrency: 5 // Process 5 emails at the same time
});

console.log('📧 Email Worker is running...');

export default worker;