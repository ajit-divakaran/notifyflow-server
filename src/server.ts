import dotenv from 'dotenv'
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from './lib/supabase';


const app = express();

app.use(cors());
app.use(express.json());



app.get('/',(req:Request,res:Response)=>{
    res.send("Typescript based server is running")
})

app.get("/health-db", async (req, res) => {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);
  if (error) return res.json({ ok: false, error });
  res.json({ ok: true, data });
});



const PORT = process.env.PORT || 80;

app.listen(PORT,()=>{
    console.log(`Server is running successfully on PORT ${PORT}`)
})