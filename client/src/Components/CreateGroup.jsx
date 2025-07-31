import React, { useEffect, useRef, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useMessageStore } from "../store/messageStore";
import { useStoreAuth } from "../store/useAuthStore";

const CreateGroup = () => {
  const { createGroup, setisAddingMember, isaddingMember, addedMembers , setisCreatingGroups } =
    useMessageStore();
  const { authUser } = useStoreAuth();
  const dummyUsers = [
    {
      id: authUser._id,
      name: authUser.fullname,
      imgSrc: authUser.profilePicture || "/avatar.png",
      isOnline: true,
    },
  ];
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const fileInputRef = useRef();

  const handleMemberAddMode = () => {
    setisAddingMember(true);
  };

  useEffect(() => {
    const v = [...addedMembers, ...dummyUsers];
    setMembers(v);
  }, [addedMembers]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleAddMember = (user) => {
    setMembers((prev) => [...prev, user]);
    setMemberInput("");
  };

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let base64Image = "";
    if (photo) {
      const reader = new FileReader();
      const fileReadPromise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(photo);
      });
      base64Image = await fileReadPromise;
    }

    const data = {
      groupName,
      description,
      profilePicture: base64Image,
      groupuser: members,
    };
    console.log(data);
    await createGroup(data);
  };

  return (
    <div className="flex flex-1 ml-2 pt-20 w-full ">
      <form
        className="flex flex-col flex-1 bg-gray-800 border border-yellow-700 rounded-lg h-[85vh] p-6 max-w-2xl mx-auto shadow-lg overflow-y-auto min-w-[450px] overflow-auto touch-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Create New Group
        </h2>

        {/* Group Photo */}
        <div className="mb-5 flex flex-col items-center">
          <label className="mb-2 text-gray-200 font-medium">Group Photo</label>
          <div className="relative w-24 h-24 mb-2">
            <img
              src={photoPreview || "/avatar.png"}
              alt="Group Preview"
              className="w-24 h-24 object-cover rounded-full border-2 border-yellow-400 shadow"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Choose group photo"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-gray-800 text-yellow-400 rounded-full p-1 shadow hover:bg-yellow-500 hover:text-black"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              tabIndex={-1}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Group Name */}
        <div className="mb-4 -mt-4">
          <label className="block text-gray-200 mb-1 font-medium">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-yellow-700 rounded-lg bg-[#23232a] text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter group name"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-1 font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#23232a] text-gray-200 border border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter group description"
            rows={2}
            required
          />
        </div>

        {/* Add Members */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <span className="block text-gray-200 font-medium text-lg mr-2">
              Add Members
            </span>
            <FiUserPlus
              className="text-yellow-400 ml-4 "
              size={22}
              onClick={handleMemberAddMode}
            />
          </div>

          {/* Preview added members */}
          {members.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 ">
              {members.map(({ name, isOnline, imgSrc }) => (
                <div className="flex flex-col items-center mr-2">
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
                  <div className="text-yellow-200 font-medium truncate text-xs mt-1 text-center max-w-[60px]">
                    {name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => {
              setisCreatingGroups(false)
              setisAddingMember(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
