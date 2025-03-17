import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Message, User } from "../types";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const updateOnlineUsersEvent = "updateOnlineUsers";
const createNewMessageEvent = "createNewMessage";

export function unsubFromCreateNewMessageEvent(
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) {
  socket.off(createNewMessageEvent);
}

export function listenToCreateNewMessageEvent(
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  selectedUser: User | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  if (!selectedUser) {
    return;
  }

  socket.on(createNewMessageEvent, (newMessage: Message) => {
    if (newMessage.senderId !== selectedUser.id) {
      return;
    }

    setMessages((prev) => {
      return [...prev, newMessage];
    });
  });
}

export function listenToUpdateOnlineUsersEvent(
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  setOnlineUserIds: React.Dispatch<React.SetStateAction<string[]>>
) {
  socket.on(updateOnlineUsersEvent, (userIds: string[]) => {
    setOnlineUserIds(userIds);
  });
}

export function connectToSocketServer(userId: string) {
  const socket = io(serverUrl, {
    query: { userId },
  });

  socket.connect();

  return socket;
}

export function disconnectFromSocketServer(
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) {
  socket.disconnect();
}
