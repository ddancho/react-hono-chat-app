import { getMessages, sendMessage } from "#controllers/message.controller.js";
import { Hono } from "hono";

const messageRoutes = new Hono();

messageRoutes.get("/:id", ...getMessages);
messageRoutes.post("/send/:id", ...sendMessage);

export default messageRoutes;
