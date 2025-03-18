import { useState, useEffect } from "react";
import useChatbotStore from "../store/chatbotstore";
import { sendChatbotRequest } from "../api/chatbotApi";

const questions = [
  { key: "name", text: "What's your name?" },
  { key: "age", text: "How old are you?" },
  { key: "gender", text: "What is your gender? (Male/Female/Other)" },
  { key: "symptoms", text: "What symptoms are you experiencing?" },
  { key: "duration", text: "How long have you had these symptoms?" },
  { key: "severity", text: "How severe is it? (low/medium/high)" },
  { key: "existing_conditions", text: "Do you have any existing medical conditions?" },
  { key: "medications", text: "Are you taking any medications?" },
  { key: "recent_travel", text: "Have you traveled recently? (Yes/No)" },
  { key: "contact_with_sick", text: "Have you been in contact with a sick person? (Yes/No)" }
];

const useChatbot = () => {
  const { conversation, addMessage, userData, updateUserData, resetChat } = useChatbotStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 0) {
      addMessage(questions[0].text, "bot");
    }
  }, [step]);

  const handleUserInput = async (response) => {
    addMessage(response, "user");
    updateUserData(questions[step].key, response);

    if (step < questions.length - 1) {
      setStep((prevStep) => prevStep + 1);
      setTimeout(() => addMessage(questions[step + 1].text, "bot"), 500);
    } else {
      setLoading(true);
      addMessage("🔎 Analyzing your symptoms, please wait...", "bot");

      try {
        const result = await sendChatbotRequest(userData);
        setLoading(false);

        if (result) {
          addMessage(`🩺 **Possible Condition:** ${result.possible_condition}`, "bot");
          addMessage(`👨‍⚕️ **Consult a Specialist:** ${result.specialist}`, "bot");
          addMessage(`📖 **Explanation:** ${result.explanation}`, "bot");

          if (result.youtube_link) {
            addMessage({ type: "video", url: result.youtube_link }, "bot");
          }
        } else {
          addMessage("⚠️ No diagnosis found. Please consult a doctor.", "bot");
        }
      } catch (error) {
        setLoading(false);
        addMessage("❌ Oops! Something went wrong. Please try again.", "bot");
      }
    }
  };

  return { conversation, handleUserInput, loading, resetChat };
};

export default useChatbot;
