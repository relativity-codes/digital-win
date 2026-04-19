"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setSessionId(data.session_id);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-4xl p-4">
        {/* Header */}
        <div className="py-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Ukweh Everest Digital Twin Chat
          </h1>
          <p className="text-slate-300">Chat with my AI-powered digital twin</p>
        </div>

        {/* Chat Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-2xl backdrop-blur-sm">
          {/* Messages */}
          <div className="h-96 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Bot className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Start a conversation with my digital twin!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl bg-slate-700 px-4 py-2 text-slate-100">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-slate-700/50 p-4">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 text-center">
          <p className="text-sm text-slate-400">
            Powered by AWS Bedrock • Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </div>
  );
}
