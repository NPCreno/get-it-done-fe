"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "@/app/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { loginEmail, loginUsername } from "@/app/api/userRequests";
import { Button } from "@/app/components/shadcn/button";
import { Loader2 } from "lucide-react";
import InputBox from "@/app/components/inputBox";

interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm({
  onChangeView,
}: {
  onChangeView: (view: "signup" | "forgotPassword") => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError("");
      
      try {
        let response;
        if (values.usernameOrEmail.includes("@")) {
          response = await loginEmail(
            values.usernameOrEmail,
            values.password
          );
        } else {
          response = await loginUsername(
            values.usernameOrEmail,
            values.password
          );
        }

        if (response.error) {
          setError(response.error.message || "An error occurred during login.");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle input change to work with InputBox component
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-primary-default">Welcome Back</h2>
        <p className="text-gray-600">
          Enter your credentials to access your account
        </p>
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="space-y-2">
          <div>
            <InputBox
              label="Username or Email"
              placeholder="Enter your username or email"
              value={{ name: formik.values.usernameOrEmail }}
              onChange={handleInputChange}
              type="text"
              onBlur={formik.handleBlur}
              error={formik.touched.usernameOrEmail ? formik.errors.usernameOrEmail : undefined}
              disabled={isLoading}
              isLabelVisible={true}
              customClass="w-full"
            />
            <input
              type="hidden"
              name="usernameOrEmail"
              value={formik.values.usernameOrEmail}
              onChange={formik.handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => onChangeView("forgotPassword")}
                disabled={isLoading}
                className="text-sm font-medium text-primary-default hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>
          <div>
            <InputBox
              label="Password"
              placeholder="Enter your password"
              value={{ name: formik.values.password }}
              onChange={handleInputChange}
              type="password"
              onBlur={formik.handleBlur}
              error={formik.touched.password ? formik.errors.password : undefined}
              disabled={isLoading}
              isLabelVisible={false}
              customClass="w-full"
            />
            <input
              type="hidden"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={(e) => formik.setFieldValue("rememberMe", e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300 text-primary-default focus:ring-primary-default"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Remember me
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary-default hover:bg-primary-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
      
      <div className="text-sm text-center text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onChangeView("signup")}
          className="font-medium text-primary-default hover:text-primary-hover transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
