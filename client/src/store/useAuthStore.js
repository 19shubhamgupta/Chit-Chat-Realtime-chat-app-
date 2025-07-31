import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useStoreAuth = create((set, get) => ({
  authUser: null,
  isSigningup: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isUpdatingProfile: false,
  showNavBar: true,
  onlineUsers: [],
  currGrpUsers: [],
  isChattingToGroup: false,
  socket: null,
  profileClicked: false,

  getGooglePage: () => {
    try {
      const url = `${BASE_URL}/api/auth/google`;
      window.location.href = url;
    } catch (err) {
      toast.error("Failed to initiate Google login");
    }
  },
  setprofileClicked: (val) => {
    set({ profileClicked: val });
  },
  toggleNav: (val) => {
    set({ showNavBar: val });
  },
  toggleChattingToGroup: (val) => {
    set({ isChattingToGroup: val });
  },
  getGroupChatUsers: async (grpid) => {
    try {
      const res = await axiosInstance.get(`/message/group/getUsers/${grpid}`);
      console.log("/auth/google", res.data);
      set({ currGrpUsers: res.data });
    } catch (err) {
      if (err.response) {
        // Server responded with a status outside 2xx
        toast.error(
          err.response.data?.message || "Failed to get Group deatils"
        );
      } else {
        // Network error or no response
        toast.error("Network error — please try again");
      }
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      toast.success("Authentication successful!");
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
      if (err.response) {
        // Server responded with a status outside 2xx
        toast.error(err.response.data?.message || "Authentication failed");
      } else {
        // Network error or no response
        toast.error("Network error — please try again");
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signup successful!");
      get().connectSocket();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Signup failed");
      } else {
        toast.error("Network error — please try again");
      }
    } finally {
      set({ isSigningup: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful!");
      get().connectSocket();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Login failed");
      } else {
        toast.error("Network error — please try again");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful!");
      get().disconnectsocket();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Logout failed");
      } else {
        toast.error("Network error — please try again");
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Login failed");
      } else {
        toast.error("Network error — please try again");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; // is user authenticated and checking if conn already there

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online Users in useAuthStore : ", userIds);
      set({ onlineUsers: userIds });
    });
  },

  disconnectsocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
