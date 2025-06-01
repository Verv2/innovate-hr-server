import express, { NextFunction, Request, Response } from "express";
import { EmployeeController } from "./employee.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";

const router = express.Router();

router.get(
  "/get-temporary-employee",
  auth(UserRole.ADMIN),
  EmployeeController.getTemporaryEmployee
);

router.post(
  "/add-employee",
  auth(UserRole.ADMIN),
  EmployeeController.addEmployee
);

router.post(
  "/add-temporary-employee",
  auth(UserRole.ADMIN),
  // validateRequest(UserValidation.createUserValidationSchema),
  multerUpload.fields([
    { name: "passportOrNationalId", maxCount: 1 },
    { name: "signedContractPaperwork", maxCount: 1 },
    { name: "recentPhotograph", maxCount: 1 },
    { name: "educationalCertificates", maxCount: 2 },
    { name: "professionalCertificates", maxCount: 2 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  EmployeeController.addTemporaryEmployee
);

export const EmployeeRoutes = router;
