import React from "react";
import UserSideBar from "../Components/UserSideBar";
import ChatSection from "../Components/ChatSection";
import { useMessageStore } from "../store/messageStore";
import { useStoreAuth } from "../store/useAuthStore";
import CreateGroup from "../Components/CreateGroup";
import WelcomeMsg from "../Components/WelcomeMsg";

const HomePage = () => {
  const { authUser } = useStoreAuth();
  const { isCreatingGroups, chatingToUser } = useMessageStore();
  return (
    authUser && (
      <div className="min-h-screen bg-gray-900">
        <div className="flex h-screen md:px-50">
          <UserSideBar />
          {!chatingToUser && !isCreatingGroups ? (
            <WelcomeMsg />
          ) : !isCreatingGroups ? (
            <ChatSection />
          ) : (
            <CreateGroup />
          )}
        </div>
      </div>
    )
  );
};

export default HomePage;
