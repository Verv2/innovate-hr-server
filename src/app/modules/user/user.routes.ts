import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { multerUpload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getAllUsers
);

router.get(
  "/me",
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  UserController.getMe
);

router.post(
  "/send-invitation",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateRequest(UserValidation.createUserValidationSchema),
  UserController.sendInvitation
);

router.post(
  "/create-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  UserController.createUserProfile
);

router.post(
  "/request-for-leave",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EMPLOYEE),
  UserController.requestForLeave
);

export const UserRoutes = router;
