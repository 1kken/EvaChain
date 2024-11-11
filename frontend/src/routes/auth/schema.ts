
import {z} from "zod";
export const logInSchema = z.object({
  email: z.string().email(),
  password:z.string().min(6)
})

export const signupSchema = z.object({
  firstName:z.string().min(3),
  lastName:z.string().min(3),
  email: z.string().email(),
  password:z.string().min(6),
  passwordRepeat:z.string().min(6), 
}).refine((data)=> data.password === data.passwordRepeat,{
  message:"Passwords don't match",
  path:["passwordRepeat"]
})

export type LogInSchema = typeof logInSchema;

export type SignupSchema = typeof signupSchema;