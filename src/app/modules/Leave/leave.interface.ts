import { LeaveStatus, LeaveType } from "@prisma/client";

export type TLeaveRequest = {
  leaveType: LeaveType;
  leaveDates: string[];
  reason?: string;
};

export type TApproveLeave = {
  requestId: string;
  status: LeaveStatus;
};
