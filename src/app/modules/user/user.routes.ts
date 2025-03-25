import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { multerUpload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
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

export const UserRoutes = router;
