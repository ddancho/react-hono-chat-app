import { useChatContext } from "../context/ChatContext";
import { X } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser, onlineUserIds } = useChatContext();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePicture || "/avatar.png"}
                alt={selectedUser?.username}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser?.username}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser && onlineUserIds.includes(selectedUser.id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <button
          className="hover:cursor-pointer"
          onClick={() => setSelectedUser(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
