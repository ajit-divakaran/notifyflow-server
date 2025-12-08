import { Router } from 'express';
// 1. Import Controller
import { triggerNotification } from '../controllers/trigger.controller';
// 2. Import Middlewares and Validators
import { verifyApiKey } from '../middlewares/apiKey.middleware';
import { validateTriggerPayload } from '../validators/trigger.validator';

const router = Router();

// Define the POST endpoint
router.post(
  '/',
  verifyApiKey,           // Check auth headers first
  validateTriggerPayload, // Then validate the body structure
  triggerNotification     // Finally, execute the controller logic
);

export default router;