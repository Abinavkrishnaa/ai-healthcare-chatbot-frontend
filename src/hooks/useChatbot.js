import { useState, useEffect } from "react";
import useChatbotStore from "../store/chatbotstore.js";
import { sendChatbotRequest } from "../api/chatbotApi";

const questions = [
  { key: "name", text: "What's your name?" },
  { key: "age", text: "How old are you?" },
  { key: "gender", text: "What's your gender?" },
  { key: "symptoms", text: "What symptoms are you experiencing?" },
  { key: "duration", text: "For how many days?" },
  { key: "severity", text: "How severe is it? (low/medium/high)" },
  { key: "existing_conditions", text: "Any existing medical conditions?" },
  { key: "medications", text: "Are you on any medications?" },
  { key: "recent_travel", text: "Have you traveled recently? (Yes/No)" },
  { key: "contact_with_sick", text: "Have you been in contact with a sick person? (Yes/No)" },
];

const useChatbot = () => {
  const { conversation, addMessage, userData, updateUserData, resetChat } = useChatbotStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 0) {
      addMessage("Hi! Let's start with some questions.", "bot");
      addMessage(questions[0].text, "bot");
    }
  }, []);

  const handleUserResponse = async (response) => {
    addMessage(response, "user");
    updateUserData(questions[step].key, response);

    if (step < questions.length - 1) {
      setStep(step + 1);
      setTimeout(() => addMessage(questions[step + 1].text, "bot"), 500);
    } else {
      setLoading(true);
      addMessage("Processing your details...", "bot");
      try {
        const result = await sendChatbotRequest(userData);
        setLoading(false);
        addMessage(`Possible condition: ${result.possible_condition}`, "bot");
        addMessage(`Consult a: ${result.specialist}`, "bot");
        addMessage(result.explanation, "bot");
        addMessage(
          { type: "video", url: result.youtube_link },
          "bot"
        );
      } catch (error) {
        setLoading(false);
        addMessage("Oops! Something went wrong.", "bot");
      }
    }
  };

  return { conversation, handleUserResponse, loading, resetChat };
};

export default useChatbot;
