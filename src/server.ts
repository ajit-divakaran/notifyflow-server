import dotenv from 'dotenv'
dotenv.config();

import './types'
import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabaseAdmin } from './lib/supabase';
import apiKeysRoute from './api/routes/apiKeys.route'
import triggerRoute from './api/routes/trigger.route'
// import * as Brevo from '@getbrevo/brevo';
import testTriggerRoute from './api/routes/test-trigger.routes'


const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());




app.use('/api/api-key',apiKeysRoute)
app.use('/api/trigger',triggerRoute)
app.use('/api/test-trigger',testTriggerRoute)

// const CONFIG = {
//   BREVO_API_KEY: process.env.BREVO_API_KEY || 'xkeysib-your-key-here',
//     SENDER_EMAIL: 'ajitp15005@gmail.com', // MUST be verified in Brevo
//     SENDER_NAME: 'NotifyFlow',
// }


// app.get('/email/brevo',(req:Request,res:Response)=>{
//     // res.send("Typescript based server is running")
//   const sendEmail = async (toEmail: string, subject: string, htmlContent: string) => {
//     const apiInstance = new Brevo.TransactionalEmailsApi();
//     apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, CONFIG.BREVO_API_KEY);

//     const sendSmtpEmail = new Brevo.SendSmtpEmail();
//     sendSmtpEmail.subject = subject;
//     sendSmtpEmail.htmlContent = htmlContent;
//     sendSmtpEmail.sender = { name: CONFIG.SENDER_NAME, email: CONFIG.SENDER_EMAIL };
//     sendSmtpEmail.to = [{ email: toEmail }];

//     try {
//         const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log(`📧 Email sent to ${toEmail}`);
//         if(result){

//           return res.status(200).json({message:"Email sent successfully",data:result})
//         }
//     } catch (error: any) {
//         console.error('❌ Email Failed:', error.response?.body || error.message);
//     }
// };
// sendEmail('ajit.divakaranb@gmail.com', 'Hello from SaaS', '<p>It works!</p>')
// }
// )

// app.get('/email/gmail',async(req:Request,res:Response)=>{
//   try {
//     // ... Logic to save user to DB ...
//     console.log("User saved to DB...");
//     const newUser = {email:"ajitp15005@gmail.com",name:"Ajit",}

//     // Now send the email
//     const emailSent = await sendEmail({
//         to: newUser.email,
//         subject: "Welcome to our Platform!",
//         text: `Hi ${newUser.name}, welcome aboard.`,
//         html: `<h1>Hi ${newUser.name}!</h1><p>Welcome aboard.</p>`,
//     });

//     if (emailSent) {
//         console.log("Confirmation email on its way.");
//         return res.status(200).json("Email sent successfully")
//     } else {
//         console.log("Failed to send email.");
//     }
//   } catch (error) {
//     res.status(400).json({error})
//   }
// })

app.get("/health-db", async (req, res) => {
  const { data, error } = await supabaseAdmin.from("profiles").select("*").limit(1);
  if (error) return res.json({ ok: false, error });
  res.json({ ok: true, data });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running successfully on PORT ${PORT}`)
})