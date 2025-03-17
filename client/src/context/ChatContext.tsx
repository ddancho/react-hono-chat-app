/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import { Message, User } from "../types";

type ChatContextProviderProps = {
  children: React.ReactNode;
};

type ChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  onlineUserIds: string[];
  setOnlineUserIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatContextProvider({ children }: ChatContextProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        onlineUserIds,
        setOnlineUserIds,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext error");
  }

  return context;
}
