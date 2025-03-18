import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Chatbot = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    duration: '',
    severity: '',
    existing_conditions: '',
    medications: '',
    recent_travel: 'No',
    contact_with_sick: 'No'
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const responseRef = useRef(null);

  const questions = [
    { id: 'name', question: 'What is your name?', type: 'text' },
    { id: 'age', question: 'What is your age?', type: 'number' },
    { id: 'gender', question: 'What is your gender?', type: 'select', options: ['Male', 'Female', 'Other'] },
    { id: 'symptoms', question: 'Please describe your symptoms in detail:', type: 'textarea' },
    { id: 'duration', question: 'How long have you been experiencing these symptoms?', type: 'text' },
    { id: 'severity', question: 'On a scale of 1-10, how severe are your symptoms?', type: 'range', min: 1, max: 10 },
    { id: 'existing_conditions', question: 'Do you have any existing medical conditions?', type: 'textarea' },
    { id: 'medications', question: 'Are you currently taking any medications?', type: 'textarea' },
    { id: 'recent_travel', question: 'Have you traveled recently?', type: 'radio', options: ['Yes', 'No'] },
    { id: 'contact_with_sick', question: 'Have you been in contact with anyone who was sick?', type: 'radio', options: ['Yes', 'No'] },
  ];

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    const currentField = questions[step].id;
    
    // Basic validation
    if (!formData[currentField] && currentField !== 'existing_conditions' && currentField !== 'medications') {
      setError('Please provide an answer before continuing');
      return;
    }
    
    setError(null);
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const submitForm = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder={`Enter your ${field.id}`}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder={`Enter your ${field.id}`}
          />
        );
      case 'select':
        return (
          <select
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select an option</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-32"
            placeholder={`Enter details here...`}
          />
        );
      case 'range':
        return (
          <div className="w-full">
            <input
              type="range"
              min={field.min}
              max={field.max}
              value={formData[field.id] || field.min}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>Mild ({field.min})</span>
              <span>Severe ({field.max})</span>
            </div>
            <div className="text-center text-white mt-2 text-lg font-bold">
              {formData[field.id] || field.min}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="flex flex-col space-y-2">
            {field.options.map(option => (
              <label key={option} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={formData[field.id] === option}
                  onChange={() => handleInputChange(field.id, option)}
                  className="form-radio h-5 w-5 text-cyan-500"
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-blue-800 py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-8 h-8 text-cyan-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12ZM18 18H6V16.6C6 14.6 10 13.5 12 13.5C14 13.5 18 14.6 18 16.6V18Z" />
              </svg>
              <span className="text-xl font-bold">MediAssist</span>
            </motion.div>
          </Link>
          <motion.div 
            className="text-sm md:text-base font-medium text-cyan-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            AI-Powered Medical Assistant
          </motion.div>
        </div>
      </header>

      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {!response ? (
          <motion.div
            className="bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-gradient-to-r from-blue-800 to-indigo-900">
              <h2 className="text-2xl font-bold text-center">Medical Symptom Assessment</h2>
              <div className="mt-4 overflow-hidden bg-gray-700 h-2 rounded-full">
                <motion.div 
                  className="bg-cyan-500 h-2"
                  initial={{ width: `${(step / questions.length) * 100}%` }}
                  animate={{ width: `${(step / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="text-center mt-2 text-sm text-cyan-200">
                Step {step + 1} of {questions.length}
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <motion.h3 variants={itemVariants} className="text-xl font-medium text-cyan-300">
                    {questions[step].question}
                  </motion.h3>
                  
                  <motion.div variants={itemVariants}>
                    {renderField(questions[step])}
                  </motion.div>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <motion.div variants={itemVariants} className="flex justify-between pt-4">
                    <button
                      onClick={prevStep}
                      disabled={step === 0}
                      className={`px-5 py-2 rounded-lg ${step === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'} transition duration-200`}
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:shadow-lg transition duration-200"
                    >
                      {step === questions.length - 1 ? 'Submit' : 'Next'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            ref={responseRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </Link>
              <h2 className="text-2xl font-bold">Your Medical Assessment Results</h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-blue-800 to-indigo-900">
                <h3 className="text-xl font-bold">Possible Condition</h3>
                <motion.div 
                  variants={itemVariants}
                  className="text-3xl font-bold text-white mt-2"
                >
                  {response.possible_condition}
                </motion.div>
              </div>

              <div className="p-6 space-y-6">
                <motion.div variants={itemVariants} className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">Medical Explanation</h4>
                  <p className="text-gray-200">{response.explanation}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">Recommended Specialist</h4>
                  <div className="flex items-center">
                    <div className="bg-blue-900/60 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">{response.specialist}</p>
                      <p className="text-sm text-gray-400">Consult as soon as possible</p>
                    </div>
                  </div>
                </motion.div>

                {response.youtube_link && (
                  <motion.div variants={itemVariants} className="space-y-3">
                    <h4 className="text-lg font-medium text-cyan-300">Educational Resource</h4>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={response.youtube_link.replace('watch?v=', 'embed/')}
                        title="Educational video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  variants={itemVariants}
                  className="bg-red-900/30 border border-red-800 p-4 rounded-lg mt-8"
                >
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-200 text-sm">
                      This is an AI-generated assessment and should not replace professional medical advice. 
                      Please consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-center pt-4">
                  <Link to="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:shadow-lg transition duration-200"
                    >
                      Start New Consultation
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div 
              className="bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <svg className="animate-spin h-12 w-12 text-cyan-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-xl font-medium text-white">Analyzing your symptoms...</p>
              <p className="text-gray-400 mt-2 text-center">Our AI is processing your information and consulting medical databases.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-800 py-4 text-center text-gray-400 text-sm">
        <p>© 2025 MediAssist. This is an AI assistant and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default Chatbot;