import {motion} from 'framer-motion'
import { Player } from "@lottiefiles/react-lottie-player";
import aiAvatar from "../assets/avataaars.png";

// import aiAvatar from "../assets/ai-avatar.json";

const HeroSection = () => {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <motion.h1 className="text-5xl font-bold" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          AI Healthcare Chatbot
        </motion.h1>
        <motion.p className="text-lg mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
          Your Smart Medical Assistant
        </motion.p>
        <Player src={aiAvatar} loop autoplay className="w-64 h-64 mt-8" />
        <motion.button className="mt-6 px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300"
          whileHover={{ scale: 1.1 }}>
          Start Chat
        </motion.button>
      </div>
    );
  };
  
  export default HeroSection;