import { Request } from "express";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { generate } from "generate-password";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import emailSender from "../../../helpers/emailSender";
import { TUser } from "./user.interface";

const createUserIntoDB = async (req: Request) => {
  console.log(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists");
  }

  const generatePassword: string = generate({
    length: 10,
    numbers: true,
  });

  const hashedPassword: string = await bcrypt.hash(
    generatePassword,
    Number(config.bcrypt_salt_rounds)
  );

  console.log("Generated password", generatePassword);
  console.log("hashedPassword", hashedPassword);

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  await emailSender(
    userData.email,
    ` 
    <div>
      <p>Dear User,</p>
      <p>Your account has been created. Please login with the password: ${generatePassword}</p>
      <p>Please do not share the password with anyone</p>
    </div>
    `
  );

  return result;
};

const createUserProfileIntoDB = async (req: Request & { user?: TUser }) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { email: req.user.email },
  });

  if (existingProfile) {
    throw new ApiError(httpStatus.CONFLICT, "User Profile already created");
  }

  const userProfileData = {
    email: req.user.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    contactNumber: req.body.contactNumber,
    shiftStart: req.body.shiftStart,
    shiftEnd: req.body.shiftEnd,
    profilePhoto: req.file?.path || "",
  };

  const result = await prisma.profile.create({
    data: userProfileData,
  });

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    include: {
      profile: true,
    },
  });

  return result;
};

const getMeFromDB = async (req: Request & { user?: TUser }) => {
  console.log("getMe function called");
  console.log(req.user?.userId);

  const user = await prisma.user.findUnique({
    where: { id: req.user?.userId },
  });

  const returnedUser = {
    id: user?.id,
    email: user?.email,
    role: user?.role,
    needPasswordChange: user?.needPasswordChange,
    status: user?.status,
  };

  return returnedUser;
};

const requestForLeave = async (req: Request & { user?: TUser }) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const requestData = {
    userId: req.user.userId,
    ...req.body,
  };

  const result = await prisma.leaveRequest.create({
    data: requestData,
  });

  console.log("From service request for a leave", result);
  return result;
};

export const UserService = {
  createUserIntoDB,
  createUserProfileIntoDB,
  getAllUsersFromDB,
  getMeFromDB,
  requestForLeave,
};
