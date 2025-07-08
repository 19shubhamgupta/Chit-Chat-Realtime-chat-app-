import React, { useState } from "react";
import { useMessageStore } from "../store/messageStore";

const UserCard = ({ name, imgSrc, isOnline, id }) => {
  const [selected , setSelected] = useState(false);
  const { getChatMessages , setChatingToUser } = useMessageStore();
  const handleCardClick = () => {
    //setSelected(true);
    setChatingToUser({
      _id : id,
      fullname: name,
      profilePicture: imgSrc || "/avatar.png",
      
    });  
    getChatMessages(id);
  };
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg ${selected?'bg-gray-700':'bg-gray-800'} hover:bg-gray-700 transition cursor-pointer w-full border-b-3 border-black transform hover:scale-105 duration-200`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={imgSrc || "/avatar.png"}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
          title={isOnline ? "Online" : "Offline"}
        ></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-yellow-200 font-medium truncate">{name}</div>
        <div
          className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}
        >
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
