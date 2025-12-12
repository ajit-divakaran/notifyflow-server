import { Router } from "express";
import { validateBrevoApiKey } from "../../utils/brevoapikey.validator";
import { testTrigger } from "../controllers/trigger.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();
console.log("Inside test trigger route")
// Define the POST endpoint
router.post(
  '/',
    validateBrevoApiKey,
    authenticateUser,
    testTrigger// Finally, execute the controller logic
);

export default router