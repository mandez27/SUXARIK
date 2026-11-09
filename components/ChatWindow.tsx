"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Привет! Чем я могу помочь тебе сегодня?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });git checkout FrontEnd

  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Вы сказали: "${input}". Это эхо-ответ сервера.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    // Добавлен класс h-full, чтобы чат растягивался строго под размер родителя
    <div className="flex flex-col h-full border border-gray-200 bg-white shadow-xl overflow-hidden">
      {/* Шапка чата */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0">
        <div className="p-2 bg-white/20 rounded-full">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Ассистент поддержки</h3>
          <p className="text-xs text-blue-100">Онлайн</p>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`p-1.5 rounded-full text-white shrink-0 ${
                msg.sender === "user" ? "bg-indigo-500" : "bg-gray-400"
              }`}
            >
              {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              <p className="break-words">{msg.text}</p>
              <span
                className={`text-[10px] block text-right mt-1 ${
                  msg.sender === "user" ? "text-indigo-200" : "text-gray-400"
                }`}
              >
                {mounted 
                  ? msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : ""}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Форма отправки */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 bg-white border-t border-gray-100 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-indigo-600 transition shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
