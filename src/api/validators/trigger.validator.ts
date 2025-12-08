import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // Zod for validation

const triggerSchema = z.object({
  event: z.string(),
  channels: z.array(z.enum(['EMAIL', 'SMS', 'PUSH'])), 
  data: z.object({
    toEmail: z.string().email({ message: "Invalid email address" }),
    subject: z.string().min(1, { message: "Subject is required" }),
    htmlContent: z.string().min(1, { message: "HTML content cannot be empty" }),
  })
});

export const validateTriggerPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    triggerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid payload structure' });
  }
};