import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  AuthController.changePassword
);

export const AuthRoutes = router;
