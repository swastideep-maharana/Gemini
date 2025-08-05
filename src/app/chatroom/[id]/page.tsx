"use client";

import ImageUploader from "@/app/components/ImageUploader";
import MessageBubble from "@/app/components/MessageBubble";
import MessageSkeleton from "@/app/components/MessageSkeleton";
import { Message, useMessageStore } from "@/app/store/messageStore";
import { useChatStore } from "@/app/store/chatStore";
import { useAuthStore } from "@/app/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import { geminiService } from "@/app/utils/geminiApi";
import { chatService } from "@/app/store/chatService";

export default function ChatroomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { addMessage, getMessagesByRoom, getMessagesByRoomPaginated } =
    useMessageStore();
  const { chatrooms } = useChatStore();
  const { isAuthenticated } = useAuthStore();
  const currentRoom = chatrooms.find((room) => room.id === id);
  const roomMessages = getMessagesByRoom(id as string);

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect to login if not authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isHydrated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages.length]);

  // Infinite scroll setup
  const lastMessageRef = useCallback(
    (node: HTMLDivElement) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMessages();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore, isLoading]
  );

  const loadMoreMessages = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newPage = page + 1;
      const newMessages = getMessagesByRoomPaginated(id as string, newPage, 20);
      if (newMessages.length === 0) {
        setHasMore(false);
      } else {
        setPage(newPage);
      }
      setIsLoading(false);
    }, 500);
  };

  const generateAIResponse = async (
    userMessage: string,
    hasImage: boolean = false
  ) => {
    setTyping(true);

    try {
      // Use chat service for better conversation context
      const aiResponse = await chatService.getResponse(
        id as string,
        userMessage,
        hasImage
      );

      setTyping(false);

      addMessage({
        id: crypto.randomUUID(),
        roomId: id as string,
        sender: "ai",
        text: aiResponse,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      setTyping(false);

      // Fallback response
      const fallbackResponse = hasImage
        ? "That's a beautiful image! I can see the details clearly. What would you like to discuss about it?"
        : "I understand what you're saying. That's an interesting point!";

      addMessage({
        id: crypto.randomUUID(),
        roomId: id as string,
        sender: "ai",
        text: fallbackResponse,
        timestamp: Date.now(),
      });
    }
  };

  const sendMessage = (text?: string, image?: string) => {
    if (!text && !image) return;

    const userMsg = {
      id: crypto.randomUUID(),
      roomId: id as string,
      sender: "user",
      text,
      image,
      timestamp: Date.now(),
    };
    addMessage(userMsg as Message);
    setInput("");
    toast.success("Message sent!");
    scrollToBottom();

    // Generate AI response using chat service
    generateAIResponse(text || "", !!image);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input);
      }
    }
  };

  // Show loading while checking authentication or during hydration
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isHydrated ? "Loading..." : "Redirecting to login..."}
          </p>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Chatroom not found</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {currentRoom.title}
              </h1>
              <p className="text-sm text-gray-600">
                {roomMessages.length} messages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50"
      >
        {isLoading && (
          <div className="flex justify-center">
            <MessageSkeleton />
          </div>
        )}

        {roomMessages.map((msg, index) => (
          <div key={msg.id} ref={index === 0 ? lastMessageRef : null}>
            <MessageBubble message={msg} />
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm">Gemini is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="flex-1 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500"
              disabled={typing}
            />
            <ImageUploader
              onUpload={(img: string) => sendMessage(undefined, img)}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="bg-black text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <FiSend className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
