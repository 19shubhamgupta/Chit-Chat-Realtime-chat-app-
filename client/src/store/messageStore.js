import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useStoreAuth } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  users: [],
  isLoadingUsers: false,
  messages: [],
  chatingToUser: null,
  chatMedia: [],
  //groups
  isCreatingGroups: false,
  isaddingMember: false,
  addedMembers: [],
  groups: [],

  setChatingToUser: (userdata) => set({ chatingToUser: userdata }),

  getUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to load users");
      } else {
        toast.error("Network error — please try again");
      }
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  getChatMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to load messages");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },

  // Subscribe to new messages for the current chat only, and clean up previous listeners
  suscribeNewMessages: (chatUserId) => {
    const { chatingToUser } = get();
    if (!chatingToUser) return;
    const userId = chatingToUser._id;
    const socket = useStoreAuth.getState().socket;
    if (!socket) return;

    // Remove any previous listener to avoid duplicates
    socket.off("newMessage");

    const handler = (message) => {
      const { authUser } = useStoreAuth.getState();
      // Only add message if it belongs to the current chat and is not from current user
      // (current user messages are added optimistically)
      if (
        message.senderId !== authUser._id &&
        (message.senderId === userId || message.receiverId === userId)
      ) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    };
    socket.on("newgrpMsg", handler);
    socket.on("newMessage", handler);
    // Return an unsubscribe function for cleanup
    return () => {
      socket.off("newMessage", handler);
      socket.off("newgrpMsg");
    };
  },

  unsuscribeNewMessages: (chatUserId) => {
    const socket = useStoreAuth.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("newgrpMsg");
  },

  sendMessage: async (userId, formData) => {
    try {
      const res = await axiosInstance.post(`/message/send/${userId}`, formData);

      // Immediately add the sent message to local state
      set((state) => ({
        messages: [...state.messages, res.data],
      }));

      toast.success("Message sent successfully");
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to send message");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },

  getMedia: async () => {
    try {
      const media = await axiosInstance.get(
        `/message/media/${get().chatingToUser._id}`
      );
      set({ chatMedia: media.data });
      console.log("Media loaded:", get().chatMedia);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to get media");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },

  createGroup: async (data) => {
    try {
      set({ isCreatingGroups: true });
      const onlyIds = data.groupuser
        .filter((u) => u.id) // keep only those with an id
        .map((u) => u.id);
      data.groupuser = onlyIds; // update
      const res = await axiosInstance.post(`/message/group/create`, data);
      toast.success(`${data.groupName} created successfully`);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to create group");
      } else {
        toast.error("Network error — please try again");
      }
    } finally {
      set({ isCreatingGroups: false });
      set({ isaddingMember: false });
    }
  },
  setisAddingMember: (val) => {
    set({ isaddingMember: val });
  },
  setisCreatingGroups: (val) => {
    set({ isCreatingGroups: val });
  },
  removeFromAddedMembers: (id) => {
    set((state) => ({
      addedMembers: state.addedMembers.filter((mem) => mem.id !== id),
    }));
    const { addedMembers } = get();
    console.log("from remove member", addedMembers);
  },
  addMembers: (data) => {
    set((state) => ({
      addedMembers: [...state.addedMembers, data],
    }));
    const { addedMembers } = get();
    console.log(addedMembers);
  },
  getGroups: async () => {
    try {
      const res = await axiosInstance.get(`/message/group/getgroups`);
      set({
        groups: res.data,
      });
      console.log("Groups loaded:", res.data);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to load groups");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },
  removeMember: async (userid, grpid) => {
    try {
      const data = {
        userId: userid,
        groupId: grpid,
      };
      await axiosInstance.post(
        `/message/group/remove-a-member/${userid}`,
        data
      );
      const { getGroupChatUsers } = useStoreAuth.getState();
      await getGroupChatUsers(grpid);

      toast.success(`Removed user`);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to remove member");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },
  sucide: async (userid, grpid) => {
    try {
      const data = {
        userId: userid,
        groupId: grpid,
      };
      await axiosInstance.post(`/message/group/sucide`, data);

      await get().getGroups();
      set({ chatingToUser: null });
      toast.success(`You have left the group`);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to leave group");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },
}));
