"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "@/app/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { loginEmail, loginUsername } from "@/app/api/userRequests";
import { Button } from "@/app/components/shadcn/button";
import { Loader2 } from "lucide-react";
import InputBox from "@/app/components/inputBox";
import Cookies from 'js-cookie';

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
      try {
        setIsLoading(true);
        setError('');

        let response;
        if (values.usernameOrEmail.includes('@')) {
          response = await loginEmail(values.usernameOrEmail, values.password);
        } else {
          response = await loginUsername(values.usernameOrEmail, values.password);
        }

        // The API returns { data, error } format
        if (response.error) {
          throw new Error(response.error || 'Login failed');
        }

        // Store the access token in a cookie
        if (response.data?.access_token) {
          const cookieOptions = {
            expires: values.rememberMe ? 30 : 1, // 30 days if remember me is checked, otherwise 1 day
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/',
          };
          
          Cookies.set('access_token', response.data.access_token, cookieOptions);
          // Store the remember me preference
          if (values.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }
        }

        // Redirect to dashboard
        router.push('/dashboard');
        router.refresh(); // Ensure the layout updates with the new auth state
      } catch (error: any) {
        setError(error.message || 'An error occurred during login');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle input change for InputBox component
  const handleInputChange = (fieldName: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formik.setFieldValue(fieldName, e.target.value);
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('rememberMe', e.target.checked);
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
              onChange={handleInputChange('usernameOrEmail')}
              type="text"
              onBlur={formik.handleBlur}
              error={formik.touched.usernameOrEmail ? formik.errors.usernameOrEmail : undefined}
              disabled={isLoading}
              isLabelVisible={true}
              customClass="w-full"
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
              onChange={handleInputChange('password')}
              type="password"
              onBlur={formik.handleBlur}
              error={formik.touched.password ? formik.errors.password : undefined}
              disabled={isLoading}
              isLabelVisible={false}
              customClass="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={handleCheckboxChange}
              disabled={isLoading}
              className="h-4 w-4 text-primary-default focus:ring-primary-default border-gray-300 rounded"
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
