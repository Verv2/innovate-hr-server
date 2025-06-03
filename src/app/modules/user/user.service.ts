import { Request } from "express";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { generate } from "generate-password";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import emailSender from "../../../helpers/emailSender";
import { TUser } from "./user.interface";
import { Prisma, UserStatus } from "@prisma/client";
import { accountCreatedTemplate } from "../../../helpers/emailTemplate";
import { userSearchAbleFields } from "./user.constant";

const sendInvitationToUser = async (req: Request) => {
  console.log(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: req.body.userId,
    },
  });

  if (existingUser && existingUser.status !== UserStatus.IN_PROGRESS) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User already exists with status other than IN_PROGRESS"
    );
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
    status: UserStatus.ACTIVE, // Assume we promote to ACTIVE after updating
  };

  let result;

  if (existingUser) {
    // Update existing user with IN_PROGRESS status
    result = await prisma.user.update({
      where: { id: req.body.userId },
      data: userData,
    });
  } else {
    // Create new user
    result = await prisma.user.create({
      data: userData,
    });
  }

  await emailSender(userData.email, accountCreatedTemplate(generatePassword));

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

const getAllUsersFromDB = async (filters: any) => {
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      employees: {
        select: {
          id: true,
          userId: true,
          firstName: true,
          middleName: true,
          lastName: true,
          additionalDocuments: {
            select: {
              recentPhotograph: true,
            },
          },
        },
      },
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
  sendInvitationToUser,
  createUserProfileIntoDB,
  getAllUsersFromDB,
  getMeFromDB,
  requestForLeave,
};
