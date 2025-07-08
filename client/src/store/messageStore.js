import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useStoreAuth } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  users: [],
  isLoadingUsers: false,
  messages: [],
  chatingToUser: null,

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
      console.log("Messages loaded:", res.data);
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
    if (!chatingToUser ) return;
    const userId = chatingToUser._id;
    const socket = useStoreAuth.getState().socket;
    if (!socket) return;

    // Remove any previous listener to avoid duplicates
    socket.off("newMessage");

    const handler = (message) => {
      // Only add message if it belongs to the current chat
      if (message.senderId === userId || message.receiverId === userId) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    };
    socket.on("newMessage", handler);
    // Return an unsubscribe function for cleanup
    return () => socket.off("newMessage", handler);
  },

  unsuscribeNewMessages: (chatUserId) => {
    const socket = useStoreAuth.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  sendMessage: async (userId, data) => {
    try {
      const res = await axiosInstance.post(`/message/send/${userId}`, data);
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
}));
