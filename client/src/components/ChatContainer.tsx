import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";
import { getMessages } from "../utils/messages";
import { Loader } from "lucide-react";
import {
  listenToCreateNewMessageEvent,
  unsubFromCreateNewMessageEvent,
} from "../lib/socketClient";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

function ChatContainer() {
  const { authUser, socketClient } = useAuthContext();
  const { messages, setMessages, selectedUser } = useChatContext();
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser) {
      setIsMessagesLoading(true);

      getMessages(selectedUser.id)
        .then((data) => {
          setIsMessagesLoading(false);
          setMessages(data);
        })
        .catch(() => {
          setIsMessagesLoading(false);
          setMessages([]);
        });

      if (socketClient) {
        listenToCreateNewMessageEvent(socketClient, selectedUser, setMessages);
      }
    }

    return () => {
      if (socketClient) {
        unsubFromCreateNewMessageEvent(socketClient);
      }
    };
  }, [setMessages, selectedUser, socketClient]);

  useEffect(() => {
    if (messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {isMessagesLoading && (
        <div className="flex justify-center items-center h-full mx-auto">
          <Loader className="size-10 animate-spin" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.senderId === authUser?.id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser?.id
                      ? authUser.profilePicture || "/avatar.png"
                      : selectedUser?.profilePicture || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {message.createdAt}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <ChatInput />
    </div>
  );
}

export default ChatContainer;
