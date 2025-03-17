import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";
import { logoutUser } from "../utils/auth";
import {
  disconnectFromSocketServer,
  unsubFromCreateNewMessageEvent,
} from "../lib/socketClient";
import toast from "react-hot-toast";

function Navbar() {
  const { authUser, setAuthUser, socketClient, setSocketClient } =
    useAuthContext();
  const { setMessages, setUsers, setOnlineUserIds, setSelectedUser } =
    useChatContext();

  const handleLogout = async () => {
    const res = await logoutUser();

    if (res.status === "error") {
      toast.error("Sign out failed. Try again later.");
      return;
    }

    toast.success("You are successfully signed out.");

    // clear states
    setAuthUser(null);
    setUsers([]);
    setOnlineUserIds([]);
    setSelectedUser(null);
    setMessages([]);

    // unsub && disconnect socket
    if (socketClient) {
      unsubFromCreateNewMessageEvent(socketClient);

      disconnectFromSocketServer(socketClient);
      setSocketClient(null);
    }
  };

  return (
    <div className="navbar bg-base-300 fixed w-full top-0 z-1">
      <div className="flex items-center w-full px-4">
        <div className="flex items-center flex-1">
          <Link to="/" className="btn btn-ghost text-2xl">
            Chat App
          </Link>
          {authUser && (
            <span className="flex text-sm">
              SignIn as:
              <h2 className="pl-2 font-medium">{authUser.username}</h2>
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <Link to="/themes" className="btn btn-sm border-cyan-50 gap-2">
            <Settings className="size-5" />
            <span className="hidden sm:inline">Themes</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile" className="btn btn-sm border-cyan-50 gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                className="flex gap-2 items-center px-2 hover:cursor-pointer hover:bg-base-100 hover:rounded-box"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
