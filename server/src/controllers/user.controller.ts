import { authProtectRoute } from "#middleware/auth.middleware.js";
import { createFactory } from "hono/factory";
import type { User, UserDto } from "#types/index.js";
import prisma from "#lib/prisma.js";

const factory = createFactory();

export const getUsers = factory.createHandlers(authProtectRoute, async (c) => {
  try {
    const user = c.var.user;

    const users: User[] = await prisma.user.findMany({
      where: {
        NOT: {
          email: user.email,
        },
      },
    });

    const uDtos = users.map((user) => {
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
        createdAt: user.createdAt.toString(),
        updatedAt: user.updatedAt.toString(),
      };

      return u;
    });

    return c.json(uDtos, 200);
  } catch (error) {
    console.log("GetUsers error:", error);

    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export const getUser = factory.createHandlers(authProtectRoute, (c) => {
  try {
    const user = c.var.user;

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
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };

    return c.json(u, 200);
  } catch (error) {
    console.log("GetUser error:", error);

    return c.json({ message: "Internal Server Error" }, 500);
  }
});
