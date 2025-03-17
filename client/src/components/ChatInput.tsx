import { useRef, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { X, Image, Send } from "lucide-react";
import { sendMessage } from "../utils/messages";
import toast from "react-hot-toast";

function ChatInput() {
  const { selectedUser, setMessages } = useChatContext();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeImage = () => {
    setImagePreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const image = fileReader.result;

      if (image) {
        formData.delete("image");
        formData.append("image", file);
        setFormData(formData);

        setImagePreview(image as string);
      }
    };
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUser) {
      return;
    }

    if (!text.trim() && !imagePreview) {
      return;
    }

    if (text) {
      formData.append("text", text.trim());
    }

    try {
      const response = await sendMessage(selectedUser.id, formData);

      if (response.status === "success") {
        toast.success("Message send...");

        // update messages state with new text/image
        if (response.text) {
          setMessages((prev) => {
            return [...prev, response.text!];
          });
        }
      } else {
        toast.error(response.message ?? "Failed to send message");
      }

      // clear states
      setText("");
      setImagePreview(null);

      formData.delete("image");
      formData.delete("text");
      setFormData(formData);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("send message error:", error);

      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
