import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email format"),
    avatar: z.string().optional(),
  }),
});

export default userValidationSchema;
