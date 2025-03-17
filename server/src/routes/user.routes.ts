import { getUser, getUsers } from "#controllers/user.controller.js";
import { Hono } from "hono";

const userRoutes = new Hono();

userRoutes.get("/", ...getUsers);
userRoutes.get("/current-user", ...getUser);

export default userRoutes;
