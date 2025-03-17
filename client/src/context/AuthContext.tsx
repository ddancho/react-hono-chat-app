/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from "react";
import { User } from "../types";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

type AuthContextType = {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthPending: boolean;
  setIsAuthPending: React.Dispatch<React.SetStateAction<boolean>>;
  socketClient: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  setSocketClient: React.Dispatch<
    React.SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  >;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProps) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthPending, setIsAuthPending] = useState(true);
  const [socketClient, setSocketClient] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isAuthPending,
        setIsAuthPending,
        socketClient,
        setSocketClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext is null");
  }

  return context;
}
