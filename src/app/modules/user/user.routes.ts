import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/create-user", UserController.createAdmin);

export const UserRoutes = router;
