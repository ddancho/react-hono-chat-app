import { Routes, Route, Navigate } from "react-router-dom";
import { checkCurrentUser } from "./utils/auth";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useAuthContext } from "./context/AuthContext";
import { useChatContext } from "./context/ChatContext";
import { useThemeContext } from "./context/ThemeContext";
import {
  connectToSocketServer,
  disconnectFromSocketServer,
  listenToCreateNewMessageEvent,
  listenToUpdateOnlineUsersEvent,
} from "./lib/socketClient";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ThemesPage from "./pages/Themes";
import ProfilePage from "./pages/Profile";

function App() {
  const {
    authUser,
    setAuthUser,
    isAuthPending,
    setIsAuthPending,
    socketClient,
    setSocketClient,
  } = useAuthContext();
  const { selectedUser, setOnlineUserIds, setMessages } = useChatContext();
  const { currentTheme } = useThemeContext();

  useEffect(() => {
    setIsAuthPending(true);

    checkCurrentUser().then((user) => {
      setAuthUser(user);
      setIsAuthPending(false);
    });
  }, [setAuthUser, setIsAuthPending]);

  useEffect(() => {
    if (authUser && !socketClient) {
      const socket = connectToSocketServer(authUser.id);
      setSocketClient(socket);

      listenToUpdateOnlineUsersEvent(socket, setOnlineUserIds);
    }

    if (!authUser && socketClient) {
      disconnectFromSocketServer(socketClient);
      setSocketClient(null);
    }

    if (authUser && selectedUser && socketClient) {
      listenToCreateNewMessageEvent(socketClient, selectedUser, setMessages);
    }
  }, [
    authUser,
    socketClient,
    setSocketClient,
    setOnlineUserIds,
    selectedUser,
    setMessages,
  ]);

  if (isAuthPending && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <main data-theme={currentTheme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/themes" element={<ThemesPage />} />
      </Routes>
    </main>
  );
}

export default App;
