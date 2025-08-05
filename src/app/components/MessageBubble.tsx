"use client";

import { useState } from "react";
import { Message } from "../store/messageStore";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    if (message.text) {
      try {
        await navigator.clipboard.writeText(message.text);
        toast.success("Message copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy message");
      }
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="group relative max-w-sm lg:max-w-md xl:max-w-lg">
          <div className="bg-black text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
            {message.text && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
            )}
            {message.image && (
              <div className="mt-2">
                <img
                  src={message.image}
                  alt="User uploaded"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={copyText}
              className="p-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <FiCheck className="w-3 h-3" />
              ) : (
                <FiCopy className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="group relative max-w-sm lg:max-w-md xl:max-w-lg">
        <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
          {message.text && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          )}
          {message.image && (
            <div className="mt-2">
              <img
                src={message.image}
                alt="AI uploaded"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={copyText}
            className="p-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            title="Copy message"
          >
            {copied ? (
              <FiCheck className="w-3 h-3" />
            ) : (
              <FiCopy className="w-3 h-3" />
            )}
          </button>
        </div>
        <div className="flex justify-start mt-1">
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
