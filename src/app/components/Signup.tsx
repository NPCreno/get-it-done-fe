"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { signUpSchema } from "@/app/schemas/signUpSchema";
import { supabase } from "@/app/lib/supabase";
import { createUser, loginEmail } from "../api/api";

export default function Signup({
  onChangeView,
}: {
  onChangeView: (view: "signedUp" | "login") => void;
}) {
  // UseStates
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    handleChange,
    isValid,
    setSubmitting,
    handleBlur,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      tier: "Standard"
    },
    enableReinitialize: true,
    validationSchema: signUpSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values: any) => {
      setSubmitting(false);
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: any) => {
    const validationErrors = await validateForm();

    // Allow submission if there are no errors OR the only error is usernameOrEmail
    if (
      Object.keys(validationErrors).length === 0 ||
      (Object.keys(validationErrors).length === 1 &&
        validationErrors.usernameOrEmail)
    ) {
      await signUp();
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (
      values.password === values.confirmPassword &&
      (values.password != undefined || values.confirmPassword != undefined)
    ) {
      setIsPasswordMatched(true);
    } else {
      setIsPasswordMatched(false);
    }
  }, [values.password, values.confirmPassword]);

  const autoLogin = async () => {
    const { email, password } = values;
    const { access_token } = await loginEmail(email, password);

    if (access_token) {
      localStorage.setItem("access_token", access_token); //store in local storage
      document.cookie = `access_token=${access_token}; path=/; max-age=3600; secure; SameSite=Strict`; // Store in cookie (expires in 1 hour)
      setIsLoading(false);
      onChangeView("signedUp");
    }
  }

  const signUp = async () => {
    try {
      const { confirmPassword, ...payload } = values; // Remove confirmPassword value in payload
      setIsLoading(true);
      const response = await createUser(payload);
      if (response) {
          if (response.error) {
            console.error("Error:", response.error);
          } else {
            await autoLogin();
          }
        }
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };


  return (
    <div className="flex flex-col rounded-2xl gap-6 bg-white w-[430px] h-auto p-10 items-center justify-center shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 h-auto">
        <h1 className="font-lato text-[40px] text-primary-default text-center font-bold">
          Create your Account
        </h1>
        <span className="font-lato text-lg text-primary-default text-center font-normal">
          Please fill up all the details
        </span>
      </div>

      {/* form */}
      <form className="flex flex-col w-full" id="signupForm" name="signupForm" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Full name */}
          <div className="min-h-[95px]">
            <div className={` ${errors.fullname ? "shake" : ""}`}>
              <label
                htmlFor="fullname"
                className={`text-base font-normal font-lato ${
                  errors.fullname ? "text-error-default " : "text-primary-default"
                }`}
              >
                Full Name
              </label>
            </div>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission when "Enter" is pressed
                }
              }}
              value={values.fullname ?? ""}
              onChange={handleChange}
              type="text"
              id="fullname"
              name="fullname"
              onBlur={handleBlur}
              className={`rounded-xl border  w-full h-[46px] py-2 px-2 
                outline-none transition-all duration-200 
                text-primary-default ${
                  errors.fullname
                    ? "focus:ring-error border-error"
                    : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                }`}
              placeholder="Enter your Full Name"
            />
            {errors.fullname && (
              <span className="text-error-default font-lato text-xs top-0">
                {errors.fullname as string}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="min-h-[95px]">
            <div className={` ${errors.username ? "shake" : ""}`}>
              <label
                htmlFor="username"
                className={`text-base font-normal font-lato ${
                  errors.username ? "text-error-default " : "text-primary-default"
                }`}
              >
                Username
              </label>
            </div>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              value={values.username ?? ""}
              onChange={handleChange}
              type="username"
              id="username"
              onBlur={handleBlur}
              className={`rounded-xl border  w-full h-[46px] py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.username
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Enter your Username"
            />
            {errors.username && (
              <span className="text-error-default font-lato text-xs top-0">
                {errors.username as string}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="min-h-[95px]">
            <div className={` ${errors.email ? "shake" : ""}`}>
              <label
                htmlFor="email"
                className={`text-base font-normal font-lato ${
                  errors.email ? "text-error-default " : "text-primary-default"
                }`}
              >
                Email
              </label>
            </div>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              value={values.email ?? ""}
              onChange={handleChange}
              type="email"
              id="email"
              onBlur={handleBlur}
              className={`rounded-xl border  w-full h-[46px] py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.email
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="text-error-default font-lato text-xs top-0">
                {errors.email as string}
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
                  e.preventDefault();
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="text-error-default font-lato text-xs top-0">
                {errors.password as string}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="min-h-[95px]">
            <div className={` ${errors.confirmPassword ? "shake" : ""}`}>
              <label
                htmlFor="password"
                className={`text-base font-normal font-lato ${
                  errors.confirmPassword
                    ? "text-error-default "
                    : "text-primary-default"
                }`}
              >
                Confirm Password
              </label>
            </div>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              value={values.confirmPassword ?? ""}
              onChange={handleChange}
              type="password"
              id="confirmPassword"
              onBlur={handleBlur}
              className={`rounded-xl border  w-full h-[46px] py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.confirmPassword
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="text-error-default font-lato text-xs top-0">
                {errors.confirmPassword as string}
              </span>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className="w-full flex flex-col mt-6 gap-4">
          <button
            type="button"
            onClick={() => onChangeView("login")}
            className="rounded-3xl bg-white border-solid border-[2px] border-primary-default font-bold font-poppins h-10 text-primary-default 
             hover:shadow-primary-default transition-shadow duration-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-3xl bg-primary-default font-bold font-poppins h-10 text-white 
             hover:shadow-primary-default transition-shadow duration-300"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
