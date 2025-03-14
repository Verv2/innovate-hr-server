import { Request } from "express";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { generate } from "generate-password";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import emailSender from "../../../helpers/emailSender";

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

export const UserService = {
  createUserIntoDB,
};
