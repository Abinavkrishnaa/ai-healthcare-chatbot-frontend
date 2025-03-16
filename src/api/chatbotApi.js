import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/chatbot/";

/**
 * Sends user responses to the chatbot API.
 * @param {Object} userData - User's answers.
 * @returns {Promise<Object>} - API response.
 */
export const sendChatbotRequest = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Chatbot API error:", error);
    throw error;
  }
};
