import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import userValidationSchema from "./user.validation";

const router = express.Router();

// will call controller function
router.post(
  "/create-user",
  validateRequest(userValidationSchema),
  UserControllers.createUser
);
router.get("/get-user", UserControllers.getAllUsers);

export const UserRoutes = router;
