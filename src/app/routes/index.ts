import express from "express";

import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { ManagerRoutes } from "../modules/Manager/manager.routes";
import { EmployeeRoutes } from "../modules/Employee/employee.routes";
import { LeaveRoutes } from "../modules/Leave/leave.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/manager",
    route: ManagerRoutes,
  },
  {
    path: "/employee",
    route: EmployeeRoutes,
  },
  {
    path: "/leave",
    route: LeaveRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
