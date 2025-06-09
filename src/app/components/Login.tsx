"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "@/app/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { loginEmail, loginUsername } from "../api/api";
import { useFormState } from "../context/FormProvider";
import { parseJwt } from "../utils/utils";
import Image from "next/image";
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
  const { setUser } = useFormState();
  // UseStates
  const [isLoading, setIsLoading] = useState(false);
  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    handleChange,
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
      } 
      else {
        const response = await loginEmail(usernameOrEmail, password); // Login using email
        access_token = response?.access_token;
      }

      if (access_token) {
        const payload = parseJwt(access_token);
        setUser(payload.user)
        localStorage.setItem("access_token", access_token); // Store token in both localStorage and cookies
        document.cookie = `access_token=${access_token}; path=/; max-age=3600; secure; SameSite=Strict`;
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
    <div className="flex flex-col rounded-2xl gap-10 bg-white w-[430px] h-auto p-10 items-center justify-center shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-lato text-[40px] text-primary-default text-center font-bold h-16">
          Welcome Back!
        </h1>
        <span className="font-lato text-lg text-primary-default text-center font-normal h-6">
          Enter to start getting things done
        </span>
      </div>

      {/* form */}
      <form className="flex flex-col w-full" id="loginForm" name="loginForm" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col justify-center">
            {/* Username or Email */}
            <div className="min-h-[95px]">
              <div className={` ${errors.usernameOrEmail ? "shake" : ""}`}>
                <label
                  htmlFor="usernameOrEmail"
                  className={`text-base font-normal font-lato ${
                    errors.usernameOrEmail
                      ? "text-error-default "
                      : "text-primary-default"
                  }`}
                >
                  Email or Username
                </label>
              </div>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                value={values.usernameOrEmail}
                onChange={handleChange}
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                onBlur={handleBlur}
                className={`rounded-xl border  w-full h-[46px] py-2 px-2 
                  outline-none transition-all duration-200 
                  text-primary-default ${
                    errors.usernameOrEmail
                      ? "focus:ring-error border-error"
                      : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                  }`}
                placeholder="Enter email or username"
              />
              {errors.usernameOrEmail && (
                <span className="text-error-default font-lato text-xs top-0">
                  {errors.usernameOrEmail as string}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="min-h-[95px]">
              <div className={` ${errors.password ? "shake" : ""}`}>
                <label
                  htmlFor="password"
                  className={`text-base font-normal font-lato ${
                    errors.password ? "text-error-default " : "text-primary-default"
                  }`}
                >
                  Password
                </label>
              </div>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                value={values.password ?? ""}
                onChange={handleChange}
                type="password"
                id="password"
                onBlur={handleBlur}
                className={`rounded-xl border  w-full h-[46px] py-2 px-2 
                          outline-none transition-all duration-200 
                          text-primary-default ${
                            errors.password
                              ? "focus:ring-error border-error"
                              : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                          }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <span className="text-error-default font-lato text-xs top-0">
                  {errors.password as string}
                </span>
              )}
            </div>
          
          <div className="mt-2 flex flex-row justify-between">
          {/* remember password */}
          <div className="flex flex-row">
            <div className="border-[2px] border-solid rounded-[5px] border-primary-default w-5 h-5 flex items-center justify-center cursor-pointer">
              <input
                id="rememberMe"
                type="checkbox"
                onChange={(e) => setFieldValue("rememberMe", e.target.checked)} // ✅ Manually update Formik state
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
            className="font-lato text-xs text-primary-default ml-2 font-bold"
            onClick={() => onChangeView("forgotPassword")}
          >
            Forgot Password?
          </button>
          </div>
        </div>
        </div>

        

        {/* buttons */}
        <div className="w-full flex flex-col gap-5 mt-8">
          <button
            type="submit"
            className="rounded-3xl bg-primary-default font-bold font-poppins h-10 text-white 
                    hover:shadow-primary-default transition-shadow duration-300 flex justify-center items-center"
          >
            {isLoading ? <div className="loader"></div> : "Login"}
          </button>
          <button
            className="rounded-3xl bg-white border-solid border-[2px] border-primary-default font-bold font-poppins h-10 text-primary-default"
            onClick={() => onChangeView("signup")}
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="flex flex-row justify-center items-center gap-6">
        <div className="w-14 h-[3px] bg-primary-default" />
        <span className="font-normal font-poppins text-primary-default text-center">
          or sign in with
        </span>
        <div className="w-14 h-[3px] bg-primary-default" />
      </div>

      <div className="flex flex-row gap-6">
        <button className="h-12 w-12 border-[2px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <Image src="/fb-logo.png" alt="fb-logo" width={24} height={24} />
        </button>
        <button className="h-12 w-12 border-[2px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <Image src="/google-logo.png" alt="google-logo" width={24} height={24} />
        </button>
        <button className="h-12 w-12 border-[2px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <Image src="/apple-logo.png" alt="apple-logo" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
