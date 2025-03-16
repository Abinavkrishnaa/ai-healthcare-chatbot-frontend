import { create } from "zustand";

const useChatbotStore = create((set) => ({
  conversation: [],
  userData: {},

  addMessage: (message, sender) =>
    set((state) => ({
      conversation: [...state.conversation, { message, sender }],
    })),

  updateUserData: (key, value) =>
    set((state) => ({
      userData: { ...state.userData, [key]: value },
    })),

  resetChat: () => set({ conversation: [], userData: {} }),
}));

export default useChatbotStore;
