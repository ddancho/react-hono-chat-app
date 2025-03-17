import { authProtectRoute } from "#middleware/auth.middleware.js";
import { createFactory } from "hono/factory";
import { SendMessageSchema, type MessageDto } from "#types/index.js";
import { zValidator } from "@hono/zod-validator";
import { getReceiverUserSocketId } from "#services/user.services.js";
import prisma from "#lib/prisma.js";
import { createNewMessageEvent, ioServer } from "#index.js";

const factory = createFactory();

export const getMessages = factory.createHandlers(
  authProtectRoute,
  async (c) => {
    try {
      const receiverId = c.req.param("id")?.trim();
      if (receiverId === undefined || receiverId === "") {
        return c.json({ message: "getMessages id is undefined" }, 400);
      }

      const user = c.var.user;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: user.id,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: user.id,
            },
          ],
        },
      });

      const mDtos: MessageDto[] = messages.map((message) => {
        const m: MessageDto = {
          id: message.id,
          text: message.text ?? undefined,
          imageType: message.imageType ?? undefined,
          image: message.image
            ? `data:${message.imageType};base64,${Buffer.from(
                message.image
              ).toString("base64")}`
            : undefined,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
          senderId: message.senderId,
          receiverId: message.receiverId,
        };

        return m;
      });

      return c.json(mDtos, 200);
    } catch (error) {
      console.log("GetMessages error:", error);

      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

export const sendMessage = factory.createHandlers(
  authProtectRoute,
  zValidator("form", SendMessageSchema),
  async (c) => {
    try {
      const receiverId = c.req.param("id")?.trim();
      if (receiverId === undefined || receiverId === "") {
        return c.json({ message: "sendMessage id is undefined" }, 400);
      }

      // do receiver user exists
      const receiverUser = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
        },
      });
      if (!receiverUser) {
        return c.json({ message: "Receiver user is unknown" }, 400);
      }

      // optional text of the message
      const validated = c.req.valid("form");

      // OR

      // optional image of the message
      const body = await c.req.parseBody();

      const data = body["image"];
      if (typeof data === "string") {
        return c.json({ message: "Image file is not valid" }, 400);
      }

      // but not empty
      if (
        (validated.text === undefined || validated.text === "") &&
        data === undefined
      ) {
        return c.json({ message: "Message cant be empty" }, 400);
      }

      let buffer: ArrayBuffer | null = null;

      if (data) {
        buffer = await data.arrayBuffer();
      }

      const user = c.var.user;

      const message = await prisma.message.create({
        data: {
          senderId: user.id as string,
          receiverId,
          text: validated.text ?? null,
          imageType: buffer !== null ? data.type : null,
          image: buffer !== null ? new Uint8Array(buffer) : null,
        },
      });

      const m: MessageDto = {
        id: message.id,
        text: message.text ?? undefined,
        imageType: message.imageType ?? undefined,
        image: message.image
          ? `data:${message.imageType};base64,${Buffer.from(
              message.image
            ).toString("base64")}`
          : undefined,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
        senderId: message.senderId,
        receiverId: message.receiverId,
      };

      // send messageDto via socket connection
      const socketId = await getReceiverUserSocketId(receiverId);
      if (socketId) {
        ioServer.to(socketId).emit(createNewMessageEvent, m);
      }

      return c.json(m, 201);
    } catch (error) {
      console.log("SendMessage error:", error);

      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);
