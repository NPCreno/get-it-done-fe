"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "@/app/schemas/forgotPasswordSchema";
import OTPInput from "@/app/components/OTPinput";
import { useRouter } from "next/navigation";
import InputBox from "@/app/components/inputBox";
import { Button } from "@/app/components/shadcn/button";
import { Loader2 } from "lucide-react";

interface ForgotPasswordFormValues {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordForm({
  onChangeView,
}: {
  onChangeView: (view: "login") => void;
}) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Handle input change to work with InputBox component
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  // Handle OTP change from OTPInput component
  const handleOtpComplete = (otp: string) => {
    formik.setFieldValue('otp', otp);
  };

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError("");
      setMessage("");

      try {
        if (step === 1) {
          // Step 1: Request OTP
          // TODO: Implement OTP request to your backend
          console.log("Requesting OTP for:", values.email);
          setMessage("OTP sent to your email. Please check your inbox.");
          setStep(2);
        } else if (step === 2) {
          // Step 2: Verify OTP and update password
          // TODO: Implement OTP verification and password reset
          console.log("Verifying OTP and updating password");
          setMessage("Password updated successfully! Redirecting to login...");
          // Redirect to login after a short delay
          setTimeout(() => {
            onChangeView("login");
          }, 2000);
        }
      } catch (error: any) {
        console.error("Forgot password error:", error);
        setError(error.message || "An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-primary-default">
          {step === 1 ? "Reset your password" : "Verify OTP"}
        </h2>
        <p className="text-gray-600">
          {step === 1
            ? "Enter your email to receive a verification code"
            : "Enter the verification code sent to your email and set a new password"}
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {message}
        </div>
      )}

      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="relative">
              <InputBox
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={{ name: formik.values.email }}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email ? formik.errors.email : undefined}
                disabled={isLoading}
              />
              <input
                type="hidden"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-default hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-default/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter OTP
              </label>
              <div className="flex justify-center my-4">
                <OTPInput
                  length={6}
                  onComplete={handleOtpComplete}
                />
              </div>
              {formik.touched.otp && formik.errors.otp && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.otp}</p>
              )}
            </div>
            
            <div className="relative">
              <InputBox
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={{ name: formik.values.newPassword }}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newPassword ? formik.errors.newPassword : undefined}
                disabled={isLoading}
              />
              <input
                type="hidden"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            
            <div className="relative">
              <InputBox
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={{ name: formik.values.confirmPassword }}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
                disabled={isLoading}
              />
              <input
                type="hidden"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-default hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-default/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : 'Update Password'}
            </button>
          </div>
        )}
      </form>

      <div className="text-sm text-center text-gray-600">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => onChangeView("login")}
          className="font-medium text-primary-default hover:text-primary-hover transition-colors"
          disabled={isLoading}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
