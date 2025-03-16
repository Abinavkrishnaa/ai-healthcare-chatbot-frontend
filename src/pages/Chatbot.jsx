import { useState } from "react";
import useChatbot from "../hooks/useChatbot";

const Chatbot = () => {
  const { conversation, handleUserResponse, loading, resetChat } = useChatbot();
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      handleUserResponse(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">AI Healthcare Chatbot</h2>
        <div className="h-96 overflow-y-auto space-y-3 p-3 border border-gray-700 rounded">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.sender === "bot" ? "bg-gray-700 text-left" : "bg-blue-500 text-right"
              }`}
            >
              {msg.type === "video" ? (
                <iframe
                  width="100%"
                  height="200"
                  src={msg.url.replace("watch?v=", "embed/")}
                  title="YouTube Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                msg.message
              )}
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none"
            placeholder="Type your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-2 p-2 bg-blue-500 rounded text-white font-bold"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
        {loading && <p className="text-center text-yellow-400 mt-2">Processing...</p>}
        <button
          className="mt-4 p-2 bg-red-500 rounded text-white"
          onClick={resetChat}
        >
          Restart Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
