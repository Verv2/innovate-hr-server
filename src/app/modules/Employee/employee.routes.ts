import express, { NextFunction, Request, Response } from "express";
import { EmployeeController } from "./employee.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";

const router = express.Router();

router.post(
  "/add-employee",
  //   auth(UserRole.ADMIN),
  // validateRequest(UserValidation.createUserValidationSchema),
  multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "nationalId", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  EmployeeController.addEmployee
);

export const EmployeeRoutes = router;
