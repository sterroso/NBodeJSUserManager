import { Router } from "express";
import * as UserController from "../controllers/users.controller.js";

const router = Router();

router.get("/", UserController.getAllUsers);

router.get("/:userId", UserController.getUserById);

router.post("/", UserController.createUser);

router.put("/:userId", UserController.updateUser);

router.delete("/:userId", UserController.deleteUser);

export default router;
