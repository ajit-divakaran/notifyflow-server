import { Router } from "express";
import {createAPIKeyController, deleteUserAPIKeysController, getUserAPIKeysController} from "../controllers/apiKeys.controller"
import { authenticateUser } from "../middlewares/auth.middleware";

const route = Router();

route.post("/create-api-key",authenticateUser,createAPIKeyController)
route.get("/get-user-api-keys",authenticateUser,getUserAPIKeysController)
route.delete("/delete/:id",authenticateUser,deleteUserAPIKeysController)

export default route