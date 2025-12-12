import { Request, Response, NextFunction } from "express";
// Import the queue service (we will define this in Step 3)
import { addJobToQueue } from "../../queues/email.queue";

export const triggerNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id:user_id,credits_used} = req.user;
    const { event, channels, data } = req.body;
  


    data.created_at = Date.now();

    // Logic: The "Fan-Out" - Adding jobs to queues [cite: 92]
    // For the MVP/Hello World, we will focus on the Email channel first.

    if (channels.includes("EMAIL")) {
      await addJobToQueue({
        user_id,
        credits_used,
        event,
        type: "EMAIL",
        data,
      });
    }

    // Response: Return 200 OK with a log ID (mocked for now) [cite: 124]
    res.status(200).json({
      success: true,
      message: "Notification queued successfully",
      id: crypto.randomUUID(), // or generate a temp ID
      status: "queued",
    });
  } catch (error) {
    next(error);
  }
};

export const testTrigger = async(  req: Request,
  res: Response,
  next: NextFunction)=>{
    const {id:user_id} = req.user
    const {channels,event,data, credits_used, brevoApiKey} = req.body
    try {
        data.created_at = Date.now();

       
         if(channels.includes("EMAIL")) {
      await addJobToQueue({
        user_id,
        credits_used,
        event,
        type: "EMAIL",
        brevoApiKey,
        data,
      });
    }

    // Response: Return 200 OK with a log ID (mocked for now) [cite: 124]
    res.status(200).json({
      success: true,
      message: "Notification queued successfully",
      id: crypto.randomUUID(), // or generate a temp ID
      status: "queued",})
    }
    catch(err){
      res.status(400).json("Error")
    }
  }
