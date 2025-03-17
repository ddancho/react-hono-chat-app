import { Loader, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { getUsers } from "../utils/users";

function Sidebar() {
  const { setUsers, users, selectedUser, setSelectedUser, onlineUserIds } =
    useChatContext();
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    setIsUsersLoading(true);

    getUsers()
      .then((data) => {
        setIsUsersLoading(false);
        setUsers(data);
      })
      .catch(() => {
        setIsUsersLoading(false);
        setUsers([]);
      });
  }, [setUsers]);

  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? users.filter((user) => onlineUserIds.includes(user.id))
      : users;
  }, [onlineUserIds, showOnlineOnly, users]);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUserIds.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {isUsersLoading && (
          <div className="flex justify-center items-center">
            <Loader className="size-6 animate-spin" />
          </div>
        )}
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 hover:cursor-pointer transition-colors
              ${
                selectedUser?.id === user.id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.username}
                className="size-12 object-cover rounded-full"
              />
              {onlineUserIds.includes(user.id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-zinc-400">
                {onlineUserIds.includes(user.id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
