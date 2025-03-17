import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { PORT, CORS_ORIGIN } from "#config/index.js";

import authRoutes from "#routes/auth.routes.js";
import messageRoutes from "#routes/message.routes.js";
import userRoutes from "#routes/user.routes.js";

import {
  createUserSocket,
  deleteUserSocket,
  getUserIdsConnected,
  isUserExist,
} from "#services/user.services.js";

const app = new Hono().basePath("/api");

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: CORS_ORIGIN,
    allowHeaders: ["Origin", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

app.use(logger());

app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/messages", messageRoutes);

const honoServer = serve(
  {
    fetch: app.fetch,
    port: parseInt(PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// update event name
const updateOnlineUsersEvent = "updateOnlineUsers";
export const createNewMessageEvent = "createNewMessage";

export const ioServer = new Server(honoServer as HttpServer, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

ioServer.on("error", (err) => {
  console.log("io error:", err);
});

ioServer.on("connection", async (socket) => {
  console.log("a user connected with socketId:", socket.id);

  const userId = socket.handshake.query.userId;
  if (typeof userId !== "string") {
    socket.disconnect();
    return;
  }

  const isUserOk = await isUserExist(userId.trim());
  if (!isUserOk) {
    socket.disconnect();
    return;
  }

  // upsert usersocket connection
  const conn = await createUserSocket(userId, socket.id);
  if (!conn) {
    socket.disconnect();
    return;
  }

  // broadcast event new user is online
  const userIds = await getUserIdsConnected();
  ioServer.emit(updateOnlineUsersEvent, userIds);

  socket.on("disconnect", async () => {
    console.log("a user disconnect:", socket.id);

    // delete connection
    await deleteUserSocket(userId, socket.id);

    // broadcast event
    const userIds = await getUserIdsConnected();
    ioServer.emit(updateOnlineUsersEvent, userIds);
  });
});
