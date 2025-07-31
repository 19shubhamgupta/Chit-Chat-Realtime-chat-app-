import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { Image, Send, X, ArrowLeft } from "lucide-react";
import { FaMicrophone } from "react-icons/fa";

import { useMessageStore } from "../store/messageStore";
import { useStoreAuth } from "../store/useAuthStore";
import GroupView from "./GroupView";
import Userview from "./Userview";
import toast from "react-hot-toast";
import VoiceRecorder from "./VoiceRecorder";

const ChatSection = () => {
  const {
    messages,
    sendMessage,
    chatingToUser,
    suscribeNewMessages,
    unsuscribeNewMessages,
    chatMedia,
    getMedia,
  } = useMessageStore();
  const {
    authUser,
    onlineUsers,
    isChattingToGroup,
    profileClicked,
    setprofileClicked,
    currGrpUsers,
  } = useStoreAuth();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const messg = useRef();
  const messagesEndRef = useRef(null);

  // Subscribe to new messages
  useEffect(() => {
    if (!chatingToUser) return;
    const unsub = suscribeNewMessages(chatingToUser._id);
    return () => {
      if (unsub) unsub();
      else unsuscribeNewMessages(chatingToUser._id);
    };
    // eslint-disable-next-line
  }, [chatingToUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch media when opening media tab in profile
  useEffect(() => {
    if (profileClicked && chatingToUser?._id) {
      getMedia();
    }
  }, [profileClicked, chatingToUser?._id]);

  // Image selection handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send message (text + optional image)
  const handleSendMessage = async (voiceFile = null) => {
    if (!chatingToUser) return;

    const text = messg.current?.value?.trim() || "";
    if (!voiceFile && !text && !imageFile) {
      toast.error("Please enter a message");
      return;
    }

    const formData = new FormData();

    // Validate and append text
    if (text) {
      formData.append("text", text);
    }

    // Validate and append image
    if (imageFile) {
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      } else {
        toast.error("Invalid image file");
        return;
      }
    }

    // Validate and append voice (only if voiceFile is actually provided)
    if (voiceFile && voiceFile instanceof Blob) {
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 10000);
      const filename = `voice_${timestamp}_${randomSuffix}.webm`;
      formData.append("voice", voiceFile, filename);
    }

    try {
      await sendMessage(chatingToUser._id, formData);
      // clear inputs
      if (messg.current) {
        messg.current.value = "";
      }
      removeImage();
    } catch (err) {
      toast.error("Message failed");
    }
  };

  const handleProfileClick = () => setprofileClicked(true);
  const handleBack = () => setprofileClicked(false);

  return (
    <div className="flex flex-1 ml-2 pt-20">
      <div className="flex flex-col flex-1 bg-gray-800 border-yellow-700 rounded-lg h-[85vh] relative">
        {chatingToUser && (
          <>
            {/* Header */}
            <div
              className="flex items-center gap-4 px-4 py-3 border-b border-yellow-700 bg-gray-900 rounded-t-lg absolute top-0 left-0 right-0 z-30"
              style={{ minHeight: "64px" }}
              onClick={!profileClicked ? handleProfileClick : undefined}
            >
              {profileClicked && (
                <button
                  className="mr-2 p-2 rounded-full hover:bg-gray-700 transition"
                  onClick={handleBack}
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5 text-yellow-300" />
                </button>
              )}
              <img
                src={chatingToUser.profilePicture || "/avatar.png"}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border border-yellow-700 mt-1 cursor-pointer"
              />
              <div className="flex flex-col justify-center w-full">
                <span className="text-lg font-semibold text-yellow-300">
                  {isChattingToGroup
                    ? chatingToUser.groupName
                    : chatingToUser.fullname}
                </span>
                {!isChattingToGroup && (
                  <span
                    className={`text-xs ${
                      onlineUsers.includes(chatingToUser._id)
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {onlineUsers.includes(chatingToUser._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                )}
                {isChattingToGroup && currGrpUsers && (
                  <span className="text-xs text-yellow-200 mt-1 flex flex-wrap gap-2">
                    <span className="whitespace-nowrap">You</span>
                    {currGrpUsers
                      .filter((u) => u._id !== authUser._id)
                      .map((u) => (
                        <span key={u._id} className="whitespace-nowrap">
                          {u.fullname}
                        </span>
                      ))}
                  </span>
                )}
              </div>
            </div>

            {/* Profile view */}
            {profileClicked &&
              (isChattingToGroup ? <GroupView /> : <Userview />)}

            {/* Chat view */}
            {!profileClicked && (
              <>
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden"
                  style={{
                    paddingTop: "72px",
                    paddingBottom: "60px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="flex flex-col gap-2 px-4 pb-4">
                    {messages
                      .filter(
                        (m) =>
                          m.senderId === chatingToUser._id ||
                          m.receiverId === chatingToUser._id ||
                          m.senderId === authUser._id
                      )
                      .map((msg, idx) => (
                        <Message
                          key={msg._id || idx}
                          text={msg.text}
                          image={msg.image}
                          time={msg.createdAt}
                          isOwn={msg.senderId === authUser._id}
                          voice={msg.voice}
                          senderImg={
                            msg.senderId === authUser._id
                              ? authUser.profilePicture || "/avatar.png"
                              : chatingToUser.profilePicture || "/avatar.png"
                          }
                        />
                      ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Image preview */}
                {imagePreview && (
                  <div className="absolute left-0 right-0 bottom-20 px-4 flex items-center gap-2 z-10">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-yellow-300" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Input bar */}
                <div className="absolute left-0 bottom-0 w-full bg-gray-800 p-3 flex items-center gap-2">
                  <input
                    type="text"
                    ref={messg}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-yellow-200 rounded-lg px-4 py-2 border border-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />

                  {/* Image Upload */}
                  <label className="p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    <Image className="w-6 h-6 text-yellow-400" />
                  </label>

                  {/* Voice Button */}
                  <VoiceRecorder handleSendMessage={handleSendMessage} />
                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    className="p-2 rounded-lg hover:bg-gray-700 transition -ml-2"
                  >
                    <Send className="w-6 h-6 text-yellow-400" />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
