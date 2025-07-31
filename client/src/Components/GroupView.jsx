import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useStoreAuth } from "../store/useAuthStore";
import { useMessageStore } from "../store/messageStore";

const GroupView = () => {
  const { currGrpUsers, onlineUsers, authUser } = useStoreAuth();
  const { groups, chatingToUser, removeMember, sucide, chatMedia, getMedia } =
    useMessageStore();
  const group = groups.find((g) => g._id === chatingToUser._id);

  const [activeTab, setActiveTab] = useState("members");
  const [showDelOption, setShowDelOption] = useState(false);

  useEffect(() => {
    setShowDelOption(authUser._id === group?.admin);
     getMedia();
  }, [authUser._id, group?.admin ]);

  const onRemoveUser = (userId) => {
    console.log("Removing user with ID:", userId);
    removeMember(userId, group._id);
  };

  const handleSucide = () => {
    if (window.confirm(`Are you sure you want to exit ${group.groupName}?`)) {
      sucide(authUser._id, group._id);
    }
  };
  const handleTabClick = async (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex flex-col flex-1 pt-30 bg-gray-800 h-[85vh] p-6 overflow-y-auto relative">
      {/* Group Info */}
      <div className="mb-6 pb-4 flex items-center gap-3 flex-wrap">
        <h3 className="text-base font-semibold text-yellow-300 mb-0">
          Group Description:
        </h3>
        <p className="text-sm text-gray-300 mb-0 truncate whitespace-nowrap overflow-hidden max-w-[200px]">
          {group?.description || "No description provided."}
        </p>
        <span className="text-s text-yellow-300 ml-auto">
          Created:{" "}
          {group?.createdAt
            ? new Date(group.createdAt).toLocaleDateString()
            : "-"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["members", "chatMedia"].map((tab) => (
          <button
            key={tab }
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === tab
                ? "border-yellow-400 text-yellow-300"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab === "chatMedia" ? 'Media' : "Members"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "members" && (
        <div className="flex flex-col gap-4 mt-2">
          {currGrpUsers?.map((member) => {
            const isYou = member._id === authUser._id;
            const isAdmin = member._id === group?.admin;
            const isOnline = onlineUsers.includes(member._id);
            const canRemove = showDelOption && !isYou && !isAdmin;

            return (
              <div
                key={member._id}
                className="flex items-center gap-4 rounded-lg p-4 border border-yellow-700 shadow-sm transition relative group hover:bg-gray-700"
              >
                <img
                  src={member.profilePicture || "/avatar.png"}
                  alt={member.fullname || "Member"}
                  className="w-14 h-14 rounded-full object-cover border border-yellow-700"
                />
                <div className="flex flex-col justify-center w-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-lg font-semibold text-yellow-200">
                      {isYou ? "You" : member.fullname}
                    </span>
                    {isAdmin && (
                      <span className="text-md text-green-500 border border-green-700 px-2 rounded-xl">
                        Admin
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isOnline ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                {canRemove && (
                  <button
                    onClick={() => onRemoveUser(member._id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 hover:text-white hover:bg-red-600 rounded-full p-1 transition hidden group-hover:block"
                    title="Remove Member"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "chatMedia" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {
            chatMedia.map((media, idx) => (
              <div
                key={media._id}
                className="bg-gray-900 rounded-lg p-2 border border-yellow-700 flex items-center justify-center h-32"
              >
                <img
                  src={media.image}
                  alt="chatMedia"
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            ))}
        </div>
      )}
      <div className="w-full text-center mt-4">
        <button
          className="bg-red-600 text-lg border-2 border-red-900 px-2 w-30 rounded-lg cursor-pointer hover:bg-red-700 font-semibold"
          onClick={handleSucide}
        >
          Exit Group
        </button>
      </div>
    </div>
  );
};

export default GroupView;
