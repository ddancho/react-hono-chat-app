import { z } from "zod";

export const UserSignUpSchema = z
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

export type UserSignUp = z.infer<typeof UserSignUpSchema>;

export const UserSignInSchema = z.object({
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
});

export type UserSignIn = z.infer<typeof UserSignInSchema>;

export type ServerResponse = {
  status: "success" | "error";
  message?: string;
  user?: User;
  text?: Message;
};

export type User = {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  profilePictureType?: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: number;
  text?: string;
  imageType?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  receiverId: string;
};

const daisyUiThemes = {
  light: "light",
  dark: "dark",
  cupcake: "cupcake",
  bumblebee: "bumblebee",
  emerald: "emerald",
  corporate: "corporate",
  synthwave: "synthwave",
  retro: "retro",
  cyberpunk: "cyberpunk",
  valentine: "valentine",
  halloween: "halloween",
  garden: "garden",
  forest: "forest",
  aqua: "aqua",
  lofi: "lofi",
  pastel: "pastel",
  fantasy: "fantasy",
  wireframe: "wireframe",
  black: "black",
  luxury: "luxury",
  dracula: "dracula",
  cmyk: "cmyk",
  autumn: "autumn",
  business: "business",
  acid: "acid",
  lemonade: "lemonade",
  night: "night",
  coffee: "coffee",
  winter: "winter",
  dim: "dim",
  nord: "nord",
  sunset: "sunset",
  caramellatte: "caramellatte",
  abyss: "abyss",
  silk: "silk",
} as const;

export type DaisyUiThemes = (typeof daisyUiThemes)[keyof typeof daisyUiThemes];

export const themes: string[] = Object.values(daisyUiThemes);
