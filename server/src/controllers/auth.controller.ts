import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import {
  UserRegisterSchema,
  UserLoginSchema,
  type User,
  type UserDto,
} from "#types/index.js";
import { createCookie, createToken } from "#lib/auth.js";
import { deleteCookie } from "hono/cookie";
import { JWT_COOKIE_NAME } from "#config/index.js";
import { authProtectRoute } from "#middleware/auth.middleware.js";
import prisma from "#lib/prisma.js";
import bcrypt from "bcryptjs";

const factory = createFactory();

export const register = factory.createHandlers(
  zValidator("json", UserRegisterSchema),
  async (c) => {
    const validated = c.req.valid("json");

    try {
      // check if the email is used
      const usedEmail = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
        select: {
          id: true,
        },
      });

      if (usedEmail) {
        return c.json({ message: "Email is already used" }, 400);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validated.password, salt);

      const user = await prisma.user.create({
        data: {
          username: validated.username,
          email: validated.email,
          password: passwordHash,
        },
        select: {
          id: true,
        },
      });

      return c.json({ message: "User is successfully created" }, 201);
    } catch (error) {
      console.log("Register user error:", error);

      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

export const login = factory.createHandlers(
  zValidator("json", UserLoginSchema),
  async (c) => {
    const validated = c.req.valid("json");

    try {
      // find user
      const user: User | null = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
      });

      if (!user) {
        return c.json({ message: "Invalid credentials" }, 400);
      }

      const isValidated = await bcrypt.compare(
        validated.password,
        user.password!
      );
      if (!isValidated) {
        return c.json({ message: "Invalid credentials" }, 400);
      }

      // create JWT token
      const token = await createToken(user.id);

      // create cookie
      createCookie(c, token);

      const u: UserDto = {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePictureType: user.profilePictureType ?? undefined,
        profilePicture: user.profilePicture
          ? `data:${user.profilePictureType};base64,${Buffer.from(
              user.profilePicture
            ).toString("base64")}`
          : undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      return c.json(u, 200);
    } catch (error) {
      console.log("Login user error:", error);

      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

export const logout = factory.createHandlers((c) => {
  try {
    deleteCookie(c, JWT_COOKIE_NAME, { maxAge: 0 });

    return c.json({ message: "User is successfully logged out" }, 200);
  } catch (error) {
    console.log("Logout user error:", error);

    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export const updateProfile = factory.createHandlers(
  authProtectRoute,
  async (c) => {
    const body = await c.req.parseBody();

    const data = body["image"];

    if (typeof data === "string" || data === null || data === undefined) {
      return c.json({ message: "Image file is reqired" }, 400);
    }

    const buffer = await data.arrayBuffer();

    const user = c.var.user;

    try {
      await prisma.user.update({
        where: {
          id: user.id,
          email: user.email,
        },
        data: {
          profilePictureType: data.type,
          profilePicture: new Uint8Array(buffer),
        },
      });

      return c.json(
        { message: "User is successfully updated profile picture" },
        200
      );
    } catch (error) {
      console.log("Upload profile picture error:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);
