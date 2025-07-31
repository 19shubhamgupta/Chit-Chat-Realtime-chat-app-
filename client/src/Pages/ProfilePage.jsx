import { useState } from "react";
import { useStoreAuth } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useStoreAuth();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  };
  return (
    authUser && (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-gray-800 rounded-xl p-6 space-y-8 border border-gray-700 shadow-xl">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-white">Profile</h1>
              <p className="mt-2 text-gray-400">Your profile information</p>
            </div>

              {/* avatar upload section */}

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      selectedImg || authUser.profilePicture || "/avatar.png"
                    }
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 "
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                  absolute bottom-0 right-0 
                  bg-blue-600 hover:bg-blue-700 hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-lg
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-400">
                  {isUpdatingProfile
                    ? "Uploading..."
                    : "Click the camera icon to update your photo"}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 text-white">
                    {authUser?.fullname}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 text-white">
                    {authUser?.email}
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                <h2 className="text-lg font-medium text-white mb-4">
                  Account Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">
                      {authUser.createdAt?.split("T")[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Account Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    )
  );
};

export default ProfilePage;
