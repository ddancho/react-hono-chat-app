import { z } from "zod";

export const UserRegisterSchema = z
  .object({
    username: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .email({ message: "Email is not valid" }),
    password: z
      .string()
      .trim()
      .min(6, "Password is required")
      .max(100, "Password is too long"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

export const UserLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email({ message: "Email is not valid" }),
  password: z.string().trim().min(1, "Password is required"),
});

export const SendMessageSchema = z.object({
  text: z.string().optional(),
});

export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  profilePictureType?: string | null;
  profilePicture?: Uint8Array | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDto = {
  id: string;
  username: string;
  email: string;
  profilePictureType?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageDto = {
  id: number;
  text?: string;
  imageType?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  receiverId: string;
};
