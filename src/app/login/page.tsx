"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchCountries } from "../utils/fetchCountries";
import { FiPhone, FiShield, FiArrowRight, FiGlobe } from "react-icons/fi";

const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  otp: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [countryError, setCountryError] = useState("");
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, isHydrated]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        setCountryError("");
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries:", error);
        setCountryError("Failed to load countries");
        toast.error("Failed to load countries");
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    if (!otpSent) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP sent to your number!");
      setOtpSent(true);
      setTimeout(() => {
        toast.success("Enter 123456 to verify!");
      }, 1000);
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    if (data.otp === "123456") {
      console.log("OTP verified, logging in...");
      toast.success("Login successful!");
      login({ phone: data.phone, countryCode: data.countryCode });
      console.log("Login function called, redirecting in 500ms...");
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        router.push("/dashboard");
      }, 500);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  // Show loading while checking authentication or during hydration
  if (!isHydrated || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isHydrated ? "Loading..." : "Redirecting to dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-3">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            </div>
            <p className="text-gray-600">Sign in to continue to Gemini Chat</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative">
                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  {...register("countryCode")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  disabled={isLoadingCountries}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.cca2} value={country.idd.root}>
                      {country.name.common} ({country.idd.root})
                    </option>
                  ))}
                </select>
                {isLoadingCountries && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {errors.countryCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.countryCode.message}
                </p>
              )}
              {countryError && (
                <p className="text-red-500 text-sm mt-1">{countryError}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  disabled={otpSent}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <input
                  {...register("otp")}
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiArrowRight className="w-5 h-5" />
              )}
              {otpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>

          {/* Demo Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Demo:</strong> Use any phone number and enter{" "}
              <strong>123456</strong> as OTP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
