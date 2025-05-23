"use client";

import { Bot, User } from "lucide-react";
import { memo } from "react";

interface MessageBubbleProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt?: string;
  };
  showTimestamp?: boolean;
  formatDate?: (date: string) => string;
}

export const MessageBubble = memo(({ 
  message, 
  showTimestamp = true, 
  formatDate 
}: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } items-start gap-3`}
    >
      {/* Avatar assistant */}
      {message.role === "assistant" && (
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-red-600" />
        </div>
      )}

      {/* Bulle de message */}
      <div
        className={`max-w-xs sm:max-w-md md:max-w-2xl p-4 md:p-5 rounded-2xl text-sm md:text-base whitespace-pre-wrap leading-relaxed shadow-sm ${
          message.role === "assistant"
            ? "bg-white text-stone-800 border border-stone-200"
            : "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md"
        }`}
      >
        {message.content}
        {showTimestamp && message.createdAt && formatDate && (
          <div
            className={`mt-2 text-xs ${
              message.role === "assistant" ? "text-stone-400" : "text-red-100"
            }`}
          >
            {formatDate(message.createdAt)}
          </div>
        )}
      </div>

      {/* Avatar utilisateur */}
      {message.role === "user" && (
        <div className="flex-shrink-0 w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-stone-600" />
        </div>
      )}
    </div>
  );
});