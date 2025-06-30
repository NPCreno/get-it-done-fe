"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Handle view changes (e.g., switch to login)
  const handleViewChange = (view: string) => {
    if (view === "login") {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="relative min-h-screen w-full flex-col items-center justify-center grid lg:grid-cols-2">
          {/* Left side - Image/Illustration */}
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-default to-primary-100" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              Get It Done
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  "It's not that I'm so smart, it's just that I stay with problems longer."
                </p>
                <footer className="text-sm">Albert Einstein</footer>
              </blockquote>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Reset your password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a password reset link
                </p>
              </div>
              
              <ForgotPasswordForm onChangeView={handleViewChange} />
              
              <p className="px-8 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
