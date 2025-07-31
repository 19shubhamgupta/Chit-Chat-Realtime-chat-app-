import React, { useState, useEffect } from "react";
import { useStoreAuth } from "../store/useAuthStore";
import { useMessageStore } from "../store/messageStore";

const UserView = () => {
  const { chatingToUser, chatMedia, getMedia } = useMessageStore();
  const { onlineUsers } = useStoreAuth();

  const [activeTab, setActiveTab] = useState("Media");

  // Whenever we switch to the "media" tab, fetch that user’s media:
  useEffect(() => {
    if (activeTab === "Media" && chatingToUser?._id) {
      getMedia(); 
    }
  }, [activeTab, chatingToUser?._id, getMedia]);

  if (!chatingToUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a user to view their profile
      </div>
    );
  }

  const isOnline = onlineUsers.includes(chatingToUser._id);

  return (
    <div className="flex flex-col flex-1 pt-30 bg-gray-800 h-[85vh] p-6 overflow-y-auto relative">

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["Media"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === tab
                ? "border-yellow-400 text-yellow-300"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab === "info" ? "Profile" : "Media"}
          </button>
        ))}
      </div>

      {activeTab === "Media" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {chatMedia.length > 0 ? (
            chatMedia.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-lg p-2 border border-yellow-700 flex items-center justify-center h-32"
              >
                <img
                  src={item.url || item.image}
                  alt="user media"
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No media to show.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserView;
