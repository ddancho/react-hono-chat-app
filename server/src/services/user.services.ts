import type { User } from "#types/index.js";
import prisma from "#lib/prisma.js";

export async function getReceiverUserSocketId(receiverUserId: string) {
  try {
    const receiverUser = await prisma.userSocket.findUnique({
      where: {
        userId: receiverUserId,
      },
    });

    if (!receiverUser) {
      return null;
    }

    return receiverUser.socketId;
  } catch (error) {
    console.log("getReceiverUserSocketId error:", error);

    return null;
  }
}

export async function getUserIdsConnected() {
  try {
    const userIds = await prisma.userSocket.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        userId: true,
      },
    });

    return userIds.map((id) => id.userId);
  } catch (error) {
    console.log("getUserIdsConnected error:", error);

    return [];
  }
}

export async function deleteUserSocket(userId: string, socketId: string) {
  try {
    const us = await prisma.userSocket.delete({
      where: {
        userId,
        socketId,
      },
      select: {
        id: true,
      },
    });

    return us.id;
  } catch (error) {
    console.log("deleteUserSocket error:", error);

    return null;
  }
}

export async function createUserSocket(userId: string, socketId: string) {
  try {
    const us = await prisma.userSocket.upsert({
      create: {
        userId,
        socketId,
      },
      update: {
        socketId,
      },
      where: {
        userId,
        socketId,
      },
    });

    return us.id;
  } catch (error) {
    console.log("createUserSocket error:", error);

    return null;
  }
}

export async function isUserExist(userId: string) {
  try {
    // find unique user
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("isUserExist error:", error);

    return false;
  }
}
