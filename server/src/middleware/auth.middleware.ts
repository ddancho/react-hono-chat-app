import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { JWT_COOKIE_NAME, JWT_SECRET } from "#config/index.js";
import { verify } from "hono/jwt";
import prisma from "#lib/prisma.js";
import type { User } from "#types/index.js";

export const authProtectRoute = createMiddleware<{
  Variables: { user: User };
}>(async (c, next) => {
  const token = getCookie(c, JWT_COOKIE_NAME);

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const decodedPayload = await verify(token, JWT_SECRET);

    const userId: unknown = decodedPayload.userId;

    if (typeof userId !== "string" || userId === undefined || userId === null) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const user: User | null = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user === null) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    c.set("user", user);
  } catch (error) {
    console.log("Middleware error:", error);

    return c.json({ message: "Unauthorized" }, 401);
  }

  await next();
});
