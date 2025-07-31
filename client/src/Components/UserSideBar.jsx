import { useEffect } from "react";
import UserCard from "./UserCard";
import { useMessageStore } from "../store/messageStore";
import { useStoreAuth } from "../store/useAuthStore";
import { FiPlus } from "react-icons/fi";

const dummyUsers = Array.from({ length: 15 }, (_, i) => ({
  name: `User ${i + 1}`,
  imgSrc: "/avatar.png",
  isOnline: false,
}));

const UserSideBar = () => {
  const { onlineUsers } = useStoreAuth();
  const {
    getUsers,
    users,
    addedMembers,
    isaddingMember,
    setisCreatingGroups,
    groups,
    getGroups,
  } = useMessageStore();

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const handleCreateGroupClicked = () => {
    setisCreatingGroups(true);
  };
  return (
    <div
      className={`h-screen w-[250px] pt-20 flex flex-col overflow-y-auto scrollbar-none touch-auto  ${
        isaddingMember
          ? "border-2 border-yellow-400"
          : "border-r border-[#23232a]"
      }  `}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* 🔍 Search Bar with Add Button */}
      <div className="flex items-center gap-2 px-3 mb-2 sticky top-0 z-10 bg-transparent">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#23232a] text-gray-200 placeholder-gray-400 border border-[#23232a] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 shadow-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <button
          className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-[#18181b] shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          title="Add new Group"
        >
          <FiPlus size={20} onClick={handleCreateGroupClicked} />
        </button>
      </div>

      {/* 👥 User List */}
      <div className="space-y-1 px-2">
        {groups != null &&
          groups.length > 0 &&
          groups.map((group) => (
            <UserCard
              key={group._id}
              id={group._id}
              name={group.groupName || "Group"}
              imgSrc={group.profilePicture || "/avatar.png"}
              isgrp={true}
              grpDesc={group.description || " "}
              isOnline={false}
              admin={group.admin}
              grpuser={group.groupuser}
            />
          ))}
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
    </div>
  );
};

export default UserSideBar;
