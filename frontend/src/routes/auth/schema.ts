
import {z} from "zod";
export const logInSchema = z.object({
  email: z.string().email(),
  password:z.string().min(6)
})

export const signupSchema = z.object({
  firstName:z.string().min(6),
  lastName:z.string().min(6),
  email: z.string().email(),
  password:z.string().min(6) 
})

export type LogInSchema = typeof logInSchema;

export type SignupSchema = typeof signupSchema;