import { z } from "zod";
import { REGEX_EMAIL } from "../constants/validation-patterns";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Email is not valid")
    .refine(
      (value) => REGEX_EMAIL.test(value ?? ""),
      "Invalid email address",
    ),
  password: z
    .string()
    .min(3, { message: "Password is too short" })
    .max(12, { message: "Password is too long" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;