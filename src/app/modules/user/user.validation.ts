import { UserRole } from "@prisma/client";
import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required!",
    }),
    role: z.nativeEnum(UserRole, { required_error: "Role is required!" }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
