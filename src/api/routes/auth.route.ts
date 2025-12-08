import { Request, Response, Router } from "express";
const router = Router()

router.post('/',async(req:Request,res:Response)=>{
console.log("Inside Register")
const data = req.body.name;
res.status(200).json({data})
})

export default router;

