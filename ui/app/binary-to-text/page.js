"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BinaryToText() {
  const [binaryInput, setBinaryInput] = useState("");
  const [convertedText, setConvertedText] = useState("");

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
    const text = convertBinaryToText(binaryInput);
    setConvertedText(text);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-blue-400">
          Binary to Text Converter
        </h1>
        <p className="text-gray-400 text-center mt-2">
          Alright, alright, paste your binary message (with spaces between bytes) below and
          get dissapointed
        </p>

        {/* Input Field */}
        <div className="mt-6">
          <textarea
            className="w-full p-3 text-white bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 border border-gray-600 resize-none"
            placeholder="Enter binary message here..."
            rows={5}
            value={binaryInput}
            onChange={(e) => setBinaryInput(e.target.value)}
          />
        </div>

        {/* Convert Button */}
        <motion.button
          onClick={handleConvert}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 py-2.5 rounded-md transition font-bold bg-blue-600 hover:bg-blue-700 text-white"
        >
          Convert to Text
        </motion.button>

        {/* Display Converted Text */}
        {convertedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-gray-900 rounded-md border border-gray-700"
          >
            <h2 className="text-lg font-semibold text-green-400">
              Converted Text:
            </h2>
            <p className="mt-2 text-yellow-300 break-words">
              {convertedText}
            </p>
          </motion.div>
        )}

        {/* Link to go back to the Binary Messenger page */}
        <div className="mt-4 text-center">
          <Link href="/">
            <span className="text-sm text-blue-400 hover:underline cursor-pointer">
              Back to Binary Messenger
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
