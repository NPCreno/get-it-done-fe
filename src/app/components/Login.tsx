"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "@/app/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { loginEmail, loginUsername } from "../api/api";
import Image from "next/image";
import InputBox from "./inputBox";
interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}
export default function Login({
  onChangeView,
}: {
  onChangeView: (view: "signup" | "forgotPassword") => void;
}) {
  const router = useRouter();
  // UseStates
  const [isLoading, setIsLoading] = useState(false);
  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    setSubmitting,
    handleBlur,
    setFieldError,
  } = useFormik<LoginFormValues>({
    initialValues: { usernameOrEmail: "", password: "", rememberMe: false },
    enableReinitialize: true,
    validationSchema: loginSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values: LoginFormValues) => {
      setSubmitting(false);
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: LoginFormValues) => {
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      await login(values);
    }
  };

  const login = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const { usernameOrEmail, password } = values;

      let access_token: string | undefined;

      if (!usernameOrEmail.includes("@")) {
        const response = await loginUsername(usernameOrEmail, password); // Login using username
        access_token = response?.access_token;
      } else {
        const response = await loginEmail(usernameOrEmail, password); // Login using email
        access_token = response?.access_token;
      }

      if (access_token) {
        document.cookie = `access_token=${access_token}; path=/; secure; SameSite=Strict`;
        router.push("/dashboard");
      } else {
        setFieldError("usernameOrEmail", "Invalid login credentials"); // Set field errors if login failed
        setFieldError("password", "Invalid login credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setFieldError("usernameOrEmail", "Login failed");
      setFieldError("password", "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-none sm:rounded-2xl gap-4 sm:gap-6 bg-white w-full max-w-[430px] h-auto p-4 sm:p-6 md:p-8 lg:p-10 items-center justify-center shadow-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 w-full pt-5">
        <h1 className="font-lato text-2xl sm:text-3xl md:text-4xl text-primary-default text-center font-bold">
          Welcome Back!
        </h1>
        <span className="font-lato text-sm sm:text-base text-primary-default text-center font-normal">
          Enter to start getting things done
        </span>
      </div>

      {/* form */}
      <form
        className="flex flex-col w-full mt-2 sm:mt-4"
        id="loginForm"
        name="loginForm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col justify-center">
            {/* Username or Email */}
            <InputBox 
              type="text"
              label="Email or Username" 
              placeholder="Enter email or username" 
              value={{name: values.usernameOrEmail}} 
              onChange={(e) => setFieldValue("usernameOrEmail", e.target.value)} 
              isLabelVisible={true}
              error={errors.usernameOrEmail}
              isLanding={true}
            />

            {/* Password */}
            <InputBox 
              type="password"
              label="Password" 
              placeholder="Enter password" 
              value={{name: values.password}} 
              onChange={(e) => setFieldValue("password", e.target.value)} 
              isLabelVisible={true}
              error={errors.password}
              isLanding={true}
            />

            <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
              {/* remember password */}
              <div className="flex flex-row">
                <div className="border-[2px] border-solid rounded-[5px] border-primary-default w-5 h-5 flex items-center justify-center cursor-pointer">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    onChange={(e) =>
                      setFieldValue("rememberMe", e.target.checked)
                    } // ✅ Manually update Formik state
                    onBlur={handleBlur}
                    checked={values.rememberMe} // ✅ Ensure it's properly controlled
                    className="appearance-none w-full h-full checked:bg-primary-default checked:border-white checked:border-solid 
              border-[1px] rounded-[3px] relative cursor-pointer"
                  />
                </div>

                <label
                  htmlFor="rememberMe"
                  className="font-lato text-xs text-primary-default ml-2 font-bold"
                >
                  Remember me
                </label>
              </div>

              {/* forgot password */}
              <button
                type="button"
                className="font-lato text-xs text-primary-default ml-2 font-bold"
                onClick={() => onChangeView("forgotPassword")}
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>

        {/* buttons */}
        <div className="w-full flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8">
          <button
            type="submit"
            className="rounded-3xl bg-primary-default font-bold font-poppins h-10 text-white 
                    hover:shadow-primary-default transition-shadow duration-300 flex justify-center items-center"
          >
            {isLoading ? <div className="loader"></div> : "Login"}
          </button>
          <button
            type="button"
            className="rounded-3xl bg-white border-solid border-[2px] border-primary-default font-bold font-poppins h-10 text-primary-default"
            onClick={() => onChangeView("signup")}
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="w-full flex flex-row justify-center items-center gap-2 sm:gap-4 my-2 sm:my-4">
        <div className="flex-1 h-[1px] sm:h-[2px] bg-gray-200" />
        <span className="font-normal text-xs sm:text-sm font-poppins text-gray-500 text-center px-2">
          or sign in with
        </span>
        <div className="flex-1 h-[1px] sm:h-[2px] bg-gray-200" />
      </div>

      <div className="w-full flex flex-row justify-center gap-3 sm:gap-5 flex-wrap mt-2">
        <button 
          className="h-10 w-10 sm:h-12 sm:w-12 border border-solid border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          onClick={() => alert("Facebook Oauth2 coming soon")}
        >
          <Image src="/fb-logo.png" alt="Facebook login" width={20} height={20} className="w-5 h-5" />
        </button>
        <button 
          className="h-10 w-10 sm:h-12 sm:w-12 border border-solid border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          onClick={() => alert("Gmail Oauth2 coming soon")}
        >
          <Image
            src="/google-logo.png"
            alt="Google login"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>
        <button 
          className="h-10 w-10 sm:h-12 sm:w-12 border border-solid border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          onClick={() => alert("AppleID Oauth2 coming soon")}
        >
          <Image
            src="/apple-logo.png"
            alt="Apple login"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
}
