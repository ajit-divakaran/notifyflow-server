import { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../../lib/supabase";

export const CheckCreditForUser = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const userId = req.user.id;
        const {data,error} = await supabaseAdmin
        .from('profiles')
        .select('id , credits_used')
        .eq('id',userId);

        if(error || !data){
            return res.status(500).json({error:"Internal server error"})
        }
        console.log("data",data)

        if(data[0].credits_used >= 10){
            return res.status(402).json({error:"Insufficient credits"})
        }
        req.user = data[0];
        next();
    } catch (error) {
        res.status(400).json({error:error})
    }
}