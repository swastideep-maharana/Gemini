"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import { useDebounce } from "../../../hooks/useDebounce";
import toast from "react-hot-toast";
import { chatService } from "../store/chatService";
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuthStore();
  const { chatrooms, createChatroom, deleteChatroom } = useChatStore();

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isHydrated]);

  const handleCreate = () => {
    if (newChatroomTitle.trim()) {
      createChatroom(newChatroomTitle.trim());
      setNewChatroomTitle("");
      setShowCreateForm(false);
      toast.success(`Chatroom "${newChatroomTitle.trim()}" created!`);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteChatroom(id);
      chatService.resetChat(id);
      toast.success(`Chatroom "${title}" deleted!`);
    }
  };

  const handleLogout = () => {
    logout();
    chatService.clearAllChats();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gemini Chat</h1>
              <p className="text-gray-600">Welcome back, {user?.phone}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chatrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        {/* Create New Chatroom */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Chatrooms
            </h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <FiPlus className="w-4 h-4" />
              New Chatroom
            </button>
          </div>

          {showCreateForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter chatroom title..."
                  value={newChatroomTitle}
                  onChange={(e) => setNewChatroomTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleCreate}
                  disabled={!newChatroomTitle.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chatrooms List */}
        <div className="space-y-3">
          {filteredChatrooms.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No chatrooms found" : "No chatrooms yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first chatroom to start chatting with Gemini"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-black text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  Create First Chatroom
                </button>
              )}
            </div>
          ) : (
            filteredChatrooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <FiMessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {room.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created {new Date(room.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/chatroom/${room.id}`)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(room.id, room.title)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete chatroom"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
