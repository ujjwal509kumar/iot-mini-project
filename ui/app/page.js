"use client";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [message, setMessage] = useState("");
  const [binaryMessage, setBinaryMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSarcasm, setShowSarcasm] = useState(false);

  // Convert text to binary
  const toBinary = (text) => {
    return text
      .split("")
      .map((char) =>
        char.charCodeAt(0).toString(2).padStart(8, "0")
      )
      .join(" ");
  };

  // Send message to ESP8266
  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    const binary = toBinary(message);
    setBinaryMessage(binary);

    try {
      await axios.post(
        "http://<your-esp8266-ip-here>/message",//change this
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Show the sarcastic message after successful send
      setShowSarcasm(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
    setIsLoading(false);
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
          Binary Messenger
        </h1>
        <p className="text-gray-400 text-center mt-2">
          Enter your message to send to ESP8266
        </p>

        {/* Input Field */}
        <div className="mt-6">
          <input
            type="text"
            className="w-full p-3 text-white bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 border border-gray-600"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <motion.button
          onClick={sendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className={`w-full mt-4 py-2.5 rounded-md transition font-bold ${
            isLoading
              ? "bg-gray-500"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? "Sending..." : "Send to ESP8266"}
        </motion.button>

        {/* Sarcastic Message Display */}
        {showSarcasm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-center"
          >
            <p>
              Doubting whether the binary message is right or wrong? No worries, we got you.{" "}
              <Link href="/binary-to-text" target="_blank">
                <span className="underline font-bold cursor-pointer">
                Click here
                </span>
              </Link>
              &nbsp;to get disappointed.
            </p>
          </motion.div>
        )}

        {/* Display Binary Output */}
        {binaryMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-gray-900 rounded-md border border-gray-700"
          >
            <h2 className="text-lg font-semibold text-green-400">
              Binary Output:
            </h2>
            <p className="mt-2 text-yellow-300 break-words">
              {binaryMessage}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
