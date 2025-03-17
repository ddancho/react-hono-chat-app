import { sign } from "hono/jwt";
import {
  JWT_SECRET,
  JWT_TOKEN_EXP_MS,
  JWT_COOKIE_EXP_SEC,
  JWT_COOKIE_NAME,
  NODE_ENV,
} from "#config/index.js";
import { setCookie } from "hono/cookie";
import type { Context } from "hono";

type Payload = {
  userId: string;
  exp: number;
};

export async function createToken(userId: string) {
  const payload: Payload = {
    userId,
    exp: Date.now() + parseInt(JWT_TOKEN_EXP_MS),
  };

  return await sign(payload, JWT_SECRET, "HS256");
}

export function createCookie(c: Context, value: string) {
  setCookie(c, JWT_COOKIE_NAME, value, {
    httpOnly: true,
    secure: NODE_ENV === "production" ? true : false,
    sameSite: "Strict",
    maxAge: parseInt(JWT_COOKIE_EXP_SEC),
  });
}
