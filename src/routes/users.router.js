import { Router } from "express";
import * as UserController from "../controllers/users.controller.js";

const router = Router();

router.get("/", UserController.getAllUsers);

export default router;
