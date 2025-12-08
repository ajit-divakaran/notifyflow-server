import { Queue } from 'bullmq';
import { connection } from '../lib/redis'; // You need to create this redis connection file
import { EmailJobData } from '../types';


// Create the queue [cite: 92]
export const emailQueue = new Queue('email_queue', { connection });

export const addJobToQueue = async (jobData: EmailJobData) => {
  return await emailQueue.add('send-email', jobData, {
    attempts: 3, // Retry logic
    backoff: { type: 'exponential', delay: 1000 }
  });
};