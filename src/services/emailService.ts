
// import dotenv from 'dotenv'
// dotenv.config();

// import nodemailer from "nodemailer"
// import {google} from  "googleapis"
// // 1. Import the specific type for SMTP
// import SMTPTransport from 'nodemailer/lib/smtp-transport';
// import { SendMailOptions } from "nodemailer";


// const OAuth2 = google.auth.OAuth2;

// const createTransporter = async () => {
//   const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.REFRESH_TOKEN
//   });

//   const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         reject("Failed to create access token :(");
//       }
//       resolve(token);
//     });
//   });

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//     user: 'ajitp15005@gmail.com', // Your REAL Gmail address
//     pass: 'nqwm jqzs tpeo nzva'   // The 16-char APP PASSWORD (Not your real password)
  
//     }
//   } as SMTPTransport.Options);

//   return transporter;
// };

// // The main function we will export
// const sendEmail = async (emailOptions:SendMailOptions):Promise<boolean> => {
//   try {
//     const transporter = await createTransporter();
    
//     // Default options merged with passed options
//     const mailOptions = {
//         from: `My App Name <${process.env.EMAIL_USER}>`,
//         ...emailOptions // This spreads the to, subject, and html passed from outside
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//     return true; // Return true to indicate success
//   } catch (error) {
//     console.log('Error sending email:', error);
//     return false; // Return false to indicate failure
//   }
// };

import * as Brevo from '@getbrevo/brevo';

// dummy data
const CONFIG = {
  BREVO_API_KEY: process.env.BREVO_API_KEY ,
    SENDER_EMAIL: 'ajitp15005@gmail.com', // MUST be verified in Brevo
    SENDER_NAME: 'NotifyFlow'
}
// extract data from the database

const sendEmail = async (toEmail: string, subject: string, htmlContent: string, fromEmail:string, brevoApiKey:string) => {
    console.log("Inside Send email function")
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey,brevoApiKey || CONFIG.BREVO_API_KEY);

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: CONFIG.SENDER_NAME, email: fromEmail || CONFIG.SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: toEmail }];
    

    try {
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
     
        if(result){

               console.log(`📧 Email sent to ${toEmail}`);
        }
        return result;
    } catch (error: any) {
        console.error('❌ Email Failed:', error.response?.body || error.message);
    }
};

export default sendEmail