import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useMessageStore } from "../store/messageStore";
import { Image, Send, X } from "lucide-react";
import { useStoreAuth } from "../store/useAuthStore";

const ChatSection = () => {
  const {
    messages,
    sendMessage,
    chatingToUser,
    suscribeNewMessages,
    unsuscribeNewMessages,
  } = useMessageStore();
  const { authUser } = useStoreAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messg = useRef();

  // Subscribe to new messages only when a chat is open
  useEffect(() => {
    if (!chatingToUser) return;
    const unsub = suscribeNewMessages(chatingToUser._id);
    return () => {
      if (unsub) unsub();
      else unsuscribeNewMessages(chatingToUser._id);
    };
    // eslint-disable-next-line
  }, [chatingToUser, suscribeNewMessages, unsuscribeNewMessages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    if (!chatingToUser) return;
    let messge = messg.current.value;
    if (!messge.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image");
      return;
    }

    try {
      await sendMessage(chatingToUser._id, {
        text: messge.trim(),
        image: imagePreview,
      });

      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (messg.current) messg.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-1 ml-2 pt-20">
      <div className="flex flex-col flex-1 bg-gray-800 border-1 border-yellow-700 rounded-lg h-[85vh] p-4 justify-end overflow-y-auto relative">
        <div
          className="pb-16 overflow-auto touch-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Example messages */}
          {chatingToUser &&
            messages
              .filter(
                (msg) =>
                  msg.senderId === chatingToUser._id ||
                  msg.receiverId === chatingToUser._id ||
                  msg.senderId === authUser._id
              )
              .map((msg, index) => (
                <Message
                  key={msg._id || index}
                  text={msg.text}
                  image={msg.image}
                  time={msg.createdAt}
                  isOwn={authUser._id === msg.senderId}
                  senderImg={
                    authUser._id === msg.senderId
                      ? authUser.profilePicture || "/avatar.png"
                      : chatingToUser.profilePicture || "/avatar.png"
                  }
                />
              ))}
          {!chatingToUser && (
            <div className="w-full text-center mb-50 cursor-pointer">
              <p className="text-3xl text-yellow-400">Ready to connect?</p>
              <p className="text-lg text-yellow-300">
                Select a friend and start your conversation
              </p>
            </div>
          )}
        </div>
        {/* Image preview */}
        {imagePreview && (
          <div className="md:-mb-4 flex items-center gap-2 absolute left-0 right-0 bottom-20 px-4 z-10">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
        {/* Fixed bottom bar */}
        <div className="absolute left-0 bottom-0 w-full bg-gray-800  p-3 flex items-center gap-2">
          <input
            type="text"
            ref={messg}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-yellow-200 rounded-lg px-4 py-2 border border-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
          {/* Image icon as file input */}
          <label
            className="p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            title="Attach image"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Image className="w-6 h-6 text-yellow-400" />
          </label>
          {/* Send icon */}
          <button
            className="p-2 rounded-lg hover:bg-gray-700 transition -ml-2"
            onClick={handleSendMessage}
            type="button"
            title="Send message"
          >
            <Send className="w-6 h-6  text-yellow-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
