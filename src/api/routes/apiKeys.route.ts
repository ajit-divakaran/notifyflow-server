import { Router } from "express";
import {createAPIKeyController} from "../controllers/apiKeys.controller"
import { authenticateUser } from "../middlewares/auth.middleware";

const route = Router();

route.post("/create-api-key",authenticateUser,createAPIKeyController)

export default route