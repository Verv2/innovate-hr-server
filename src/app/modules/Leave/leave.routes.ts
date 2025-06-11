import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { LeaveController } from "./leave.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER),
  LeaveController.getAllRequestedLeaves
);

router.get(
  "/leaves-on-today",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  LeaveController.getLeavesOnToday
);

router.post(
  "/approve-leave-request",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER),
  LeaveController.approveLeaveRequest
);

router.post(
  "/leave-request",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  LeaveController.requestForLeave
);

export const LeaveRoutes = router;
