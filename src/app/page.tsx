"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { FiMessageSquare, FiSmartphone, FiZap } from "react-icons/fi";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
              <FiMessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Gemini Chat</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of AI conversation with Google's Gemini
            technology. Chat naturally, share images, and explore ideas
            together.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <FiMessageSquare className="w-5 h-5 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Conversations
            </h3>
            <p className="text-gray-600">
              Engage in natural, intelligent conversations powered by Google's
              Gemini AI.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <FiSmartphone className="w-5 h-5 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mobile Ready
            </h3>
            <p className="text-gray-600">
              Fully responsive design that works perfectly on all devices and
              screen sizes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <FiZap className="w-5 h-5 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Built with Next.js 15 for optimal performance and instant
              responses.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            Get Started
          </button>
          <p className="text-gray-500 mt-4 text-sm">
            Join thousands of users exploring AI conversations
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center"></div>
      </div>
    </div>
  );
}
