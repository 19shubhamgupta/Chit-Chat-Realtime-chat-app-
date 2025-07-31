import React from "react";
import { useMessageStore } from "../store/messageStore";
import { X, WormIcon } from "lucide-react";
import { useStoreAuth } from "../store/useAuthStore";

const UserCard = ({
  name,
  imgSrc,
  isOnline,
  id,
  isgrp,
  grpDesc,
  admin,
  grpuser,
}) => {
  const {
    getChatMessages,
    setChatingToUser,
    isaddingMember,
    addedMembers,
    addMembers,
    removeFromAddedMembers,
  } = useMessageStore();

  // Derive selected state from global store instead of local state
  const selected = addedMembers.some((member) => member.id === id);
  const { toggleChattingToGroup, getGroupChatUsers, setprofileClicked } =
    useStoreAuth();
  const handleCardClick = () => {
    setprofileClicked(false);
    if (isaddingMember) {
      if (!selected) {
        addMembers({ name, imgSrc, isOnline, id });
      }
    } else {
      if (isgrp) {
        toggleChattingToGroup(true);
        getGroupChatUsers(id);
        setChatingToUser({
          _id: id,
          fullname: name,
          profilePicture: imgSrc || "/avatar.png",
          admin,
          groupuser: grpuser,
        });
      } else {
        toggleChattingToGroup(false);
        setChatingToUser({
          _id: id,
          fullname: name,
          profilePicture: imgSrc || "/avatar.png",
        });
      }

      getChatMessages(id);
    }
  };
  const handleCross = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    removeFromAddedMembers(id);
  };
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer w-full border-b-3 border-black transform hover:scale-105 duration-200`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={imgSrc || "/avatar.png"}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
        />
        <span
          className={`${
            isgrp ? "hidden" : " "
          } absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
          title={isOnline ? "Online" : "Offline"}
        ></span>
      </div>
      <div className="flex flex-1 min-w-0">
        <div className="flex flex-col">
          <div className="text-yellow-200 font-medium truncate">{name}</div>
          <div
            className={`text-xs ${
              isOnline ? "text-green-400" : "text-gray-400"
            }`}
          >
            {isgrp ? grpDesc : isOnline ? "Online" : "Offline"}
          </div>
        </div>
        {isaddingMember && selected && (
          <div className="flex items-center ml-auto">
            <X
              className="w-5 h-5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full p-1 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={handleCross}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
