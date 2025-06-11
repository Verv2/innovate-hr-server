import { Request } from "express";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { TUser } from "../User/user.interface";
import ApiError from "../../errors/ApiErrors";
import { TApproveLeave, TLeaveRequest } from "./leave.interface";

const requestForLeave = async (req: Request & { user?: TUser }) => {
  const body = req.body as TLeaveRequest;
  if (!req.user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User information is missing.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const existingEmployee = await prisma.employees.findUnique({
    where: { userId: existingUser.id },
  });

  if (!existingEmployee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee doesn't exist");
  }

  const parsedDates: Date[] = body.leaveDates.map((date) => new Date(date));

  const requestData = {
    employeeId: existingEmployee.id,
    leaveType: body.leaveType,
    leaveDates: parsedDates,
    reason: body?.reason,
  };

  const result = await prisma.leaveRequest.create({
    data: requestData,
  });

  return result;
};

const approveLeaveRequest = async (payload: TApproveLeave) => {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: payload.requestId },
  });

  if (!leaveRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Leave request not found");
  }

  const leaveDaysCount = leaveRequest.leaveDates.length;

  const employeeLeaves = await prisma.employeeLeaves.findUnique({
    where: {
      employeeId: leaveRequest.employeeId,
    },
  });

  if (!employeeLeaves) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee leave record not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Only update balances if the leave is approved
    if (payload.status === "APPROVED") {
      if (leaveRequest.leaveType === "UNPAID_LEAVE") {
        // Only increment unpaid leave
        await tx.employeeLeaves.update({
          where: { employeeId: employeeLeaves.employeeId },
          data: {
            unpaidLeaveDays: {
              increment: leaveDaysCount,
            },
          },
        });
      } else {
        // Paid leave scenario
        const available = employeeLeaves.availableLeaveDays;
        const paidDays = Math.min(leaveDaysCount, available);
        const unpaidDays = leaveDaysCount - paidDays;

        await tx.employeeLeaves.update({
          where: { employeeId: employeeLeaves.employeeId },
          data: {
            availableLeaveDays: {
              decrement: paidDays,
            },
            unpaidLeaveDays: {
              increment: unpaidDays,
            },
          },
        });
      }
    }

    const leaveResult = await tx.leaveRequest.update({
      where: { id: payload.requestId },
      data: {
        status: payload.status,
      },
    });

    return leaveResult;
  });

  return result;
};

const getLeavesOnTodayFormDB = async () => {
  const today = new Date();
  const utcMidnight = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  const result = await prisma.leaveRequest.findMany({
    where: {
      status: "APPROVED",
      isOngoing: true,
      leaveDates: {
        has: utcMidnight,
      },
    },
    include: {
      employee: true,
    },
  });

  const meta: Record<string, number> = {};

  result.forEach((leave) => {
    const type = leave.leaveType;
    meta[type] = (meta[type] || 0) + 1;
  });

  return { meta, data: result };
};

const updateOnGoingLeaves = async () => {
  const today = new Date();
  const utcMidnight = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  // Find all approved leave requests that are still marked ongoing
  const ongoingLeaves = await prisma.leaveRequest.findMany({
    where: {
      status: "APPROVED",
      isOngoing: true,
    },
  });

  for (const leave of ongoingLeaves) {
    const latestLeaveDate = leave.leaveDates.reduce((latest, current) => {
      return new Date(current) > new Date(latest) ? current : latest;
    });

    const latest = new Date(latestLeaveDate);
    const latestDateOnly = new Date(
      Date.UTC(
        latest.getUTCFullYear(),
        latest.getUTCMonth(),
        latest.getUTCDate()
      )
    );

    if (latestDateOnly < utcMidnight) {
      await prisma.leaveRequest.update({
        where: { id: leave.id },
        data: { isOngoing: false },
      });
    }
  }

  console.log("Checked and updated leave requests");
};

export const LeaveService = {
  requestForLeave,
  approveLeaveRequest,
  getLeavesOnTodayFormDB,
  updateOnGoingLeaves,
};
