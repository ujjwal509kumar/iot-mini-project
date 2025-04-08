"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BinaryToText() {
  const [binaryInput, setBinaryInput] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert binary string (space separated) to text
  const convertBinaryToText = (binary) => {
    return binary
      .split(" ")
      .map((chunk) => {
        if (chunk.trim() === "") return "";
        const charCode = parseInt(chunk, 2);
        return String.fromCharCode(charCode);
      })
      .join("");
  };

  const handleConvert = () => {
    setIsConverting(true);
    setTimeout(() => {
      const text = convertBinaryToText(binaryInput);
      setConvertedText(text);
      setIsConverting(false);
    }, 300); // Short delay for animation effect
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-700"
      >
        <motion.h1
          className="text-3xl font-bold text-center text-blue-400"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Binary to Text Converter
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-400 text-center mt-2"
        >
          Alright, alright, paste your binary message (with spaces between bytes) below and
          get dissapointed
        </motion.p>

        {/* Input Field */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.textarea
            className="w-full p-3 text-white bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 border border-gray-600 resize-none"
            placeholder="Enter binary message here..."
            rows={5}
            value={binaryInput}
            onChange={(e) => setBinaryInput(e.target.value)}
            whileFocus={{ borderColor: "#3b82f6", boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Convert Button */}
        <motion.button
          onClick={handleConvert}
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full mt-4 py-2.5 rounded-md transition font-bold bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isConverting ? (
            <motion.div
              className="flex justify-center items-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            </motion.div>
          ) : (
            "Convert to Text"
          )}
        </motion.button>

        {/* Display Converted Text */}
        <AnimatePresence mode="wait">
          {convertedText && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 bg-gray-900 rounded-md border border-gray-700"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-green-400"
              >
                Converted Text:
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-yellow-300 break-words"
              >
                {convertedText}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link to go back to the Binary Messenger page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-center"
        >
          <Link href="/">
            <motion.span
              className="text-sm text-blue-400 hover:underline cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Back to Binary Messenger
            </motion.span>
          </Link>
        </motion.div>

        {/* Binary background accents - client side only to avoid hydration errors */}
        {isClient && (
          <>
            <motion.div
              className="absolute text-blue-500/5 text-xs font-mono top-10 left-10 pointer-events-none"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [0, -20, 0]
              }}
              transition={{ repeat: Infinity, duration: 8 }}
            >
              01000010
            </motion.div>
            <motion.div
              className="absolute text-blue-500/5 text-xs font-mono bottom-10 right-10 pointer-events-none"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [0, 20, 0]
              }}
              transition={{ repeat: Infinity, duration: 10, delay: 2 }}
            >
              01010100
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
