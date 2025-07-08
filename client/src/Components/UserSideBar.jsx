import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useMessageStore } from "../store/messageStore";
import { useStoreAuth } from "../store/useAuthStore";

const dummyUsers = Array.from({ length: 10 }, (_, i) => ({
  name: `User ${i + 1}`,
  imgSrc: "/avatar.png",
  isOnline: false,
}));

const UserSideBar = () => {
  const { onlineUsers } = useStoreAuth();
  const { getUsers, users , suscribeNewMessages , unsuscribeNewMessages } = useMessageStore();

  useEffect(() => {
    getUsers();
    
  }, [getUsers]);

  console.log("Online Users:", onlineUsers);
  return (
    <div
      className="h-screen w-[250px] pt-17 space-y-1 overflow-y-auto scrollbar-none touch-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {users.map((user) => (
        <UserCard
          key={user._id}
          id={user._id}
          name={user.fullname}
          imgSrc={user.profilePicture || "/avatar.png"}
          isOnline={onlineUsers.includes(user._id)}
        />
      ))}
      {dummyUsers.map((user, idx) => (
        <UserCard
          key={idx}
          name={user.name}
          imgSrc={user.imgSrc}
          isOnline={user.isOnline}
        />
      ))}
    </div>
  );
};

export default UserSideBar;
