import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

async function checkBrevoKey(apiKey: string) {
  try {
    await axios.get('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey }
    });
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return false; // Key invalid
    }
    throw error; // Other network/server errors
  }
}

export const validateBrevoApiKey = async(req:Request,res:Response,next:NextFunction)=>{
  const {brevoApiKey} = req.body;
  try {
    const result = await checkBrevoKey(brevoApiKey);
    if(result!==true){
      return res.status(400).json({error:"Invalid Brevo API Key"})
    }
    console.log("Inside Brevo validation")
    next();
    
  } catch (error) {
    return res.status(500).json({error:"Internal server error"})
  }
};