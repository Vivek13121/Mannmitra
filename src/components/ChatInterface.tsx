import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, RefreshCw } from "lucide-react";
import { useStore } from "../lib/store"; // Using real store
import { getChatResponse } from "../lib/ai";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { chatHistory, addChatMessage, clearChatHistory } = useStore();

  // Removed auto-scroll functionality - users can manually scroll as needed

  useEffect(() => {
    if (chatHistory.length === 0) {
      addChatMessage(
        "assistant",
        "Hello! I'm Adma, your AI mental health assistant. I'm here to provide emotional support, guide you through exercises, and help with stress management. How can I assist you today?"
      );
    }
    // Mark as initialized after the initial welcome message is added
    // Don't auto-scroll on initialization
    setTimeout(() => setIsInitialized(true), 100);
  }, [chatHistory.length, addChatMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    addChatMessage("user", userMessage);
    setIsLoading(true);

    try {
      const messages = chatHistory.map(({ role, content }) => ({
        role,
        content,
      }));
      messages.push({ role: "user", content: userMessage });

      const response = await getChatResponse(messages);
      if (response) {
        addChatMessage("assistant", response);
      }
    } catch (error) {
      console.error("Chat error:", error);
      addChatMessage(
        "assistant",
        "I apologize, but I encountered an error. Please try again or contact support if the issue persists."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    clearChatHistory();
    setIsInitialized(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Chat with Adma
        </h2>
        <button
          onClick={handleClearChat}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-slate-700"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white p-2 rounded-full transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
