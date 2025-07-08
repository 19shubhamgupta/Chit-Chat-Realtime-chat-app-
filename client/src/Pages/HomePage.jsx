import React from "react";
import UserSideBar from "../Components/UserSideBar";
import ChatSection from "../Components/ChatSection";
import { useMessageStore } from "../store/messageStore";
import { useStoreAuth } from "../store/useAuthStore";

const HomePage = () => {
  const { authUser } = useStoreAuth();
  return (
    authUser && (
      <div className="">
        <div className="flex h-screen bg-base-300 md:px-50">
          <UserSideBar />
          <ChatSection />
        </div>
      </div>
    )
  );
};

export default HomePage;
