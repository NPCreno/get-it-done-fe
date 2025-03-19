"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { userSchema } from "@/app/schemas/userSchema";

export default function Signup() {
  // UseStates
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    initialValues: {},
    enableReinitialize: true,
    validationSchema: userSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values: any) => {
      setSubmitting(false);
      onHandleFormSubmit(values);
    },
  });

  const handleSubmitForm = async (values: any) => {
    setIsSubmitted(true); // Mark as submitted
    await validateForm(); // Revalidate fields
    if (Object.keys(errors).length === 0) {
      onHandleFormSubmit(values);
    }
  };
  const onHandleFormSubmit = async (data: any) => {
    try {
    } catch (error) {
      // alert("Oops! Something went wrong. Please try again "+ {error});
    }
  };

  console.log("errors: ", errors);
  console.log("values: ", values);
  return (
    <div className="flex flex-col rounded-2xl gap-6 bg-white w-[430px] h-auto px-16 py-8 items-center justify-center shadow-2xl">
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
      <form className="flex flex-col w-full" id="signupForm" name="signupForm">
        <div className="flex flex-col justify-center">
          {/* Full name */}
          <div className="min-h-[89px]">
            <div className={` ${errors.fullname ? "shake" : ""}`}>
              <label
                htmlFor="fullname"
                className={`text-base font-normal font-lato ${
                  errors.fullname ? "text-error " : "text-primary-default"
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
              className={`rounded-xl border  w-full h-10 py-2 px-2 
                outline-none transition-all duration-200 
                text-primary-default ${
                  errors.fullname
                    ? "focus:ring-error border-error"
                    : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                }`}
              placeholder="Enter your Full Name"
            />
            {errors.fullname && (
              <span className="text-error font-lato text-xs top-0">
                {errors.fullname as string}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="min-h-[89px]">
            <div className={` ${errors.username ? "shake" : ""}`}>
              <label
                htmlFor="username"
                className={`text-base font-normal font-lato ${
                  errors.username ? "text-error " : "text-primary-default"
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
              className={`rounded-xl border  w-full h-10 py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.username
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Enter your Username"
            />
            {errors.username && (
              <span className="text-error font-lato text-xs top-0">
                {errors.username as string}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="min-h-[89px]">
            <div className={` ${errors.email ? "shake" : ""}`}>
              <label
                htmlFor="email"
                className={`text-base font-normal font-lato ${
                  errors.email ? "text-error " : "text-primary-default"
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
              className={`rounded-xl border  w-full h-10 py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.email
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="text-error font-lato text-xs top-0">
                {errors.email as string}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="min-h-[89px]">
            <div className={` ${errors.password ? "shake" : ""}`}>
              <label
                htmlFor="password"
                className={`text-base font-normal font-lato ${
                  errors.password ? "text-error " : "text-primary-default"
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
              className={`rounded-xl border  w-full h-10 py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.password
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="text-error font-lato text-xs top-0">
                {errors.password as string}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="min-h-[89px]">
            <div className={` ${errors.password ? "shake" : ""}`}>
              <label
                htmlFor="password"
                className={`text-base font-normal font-lato ${
                  errors.password ? "text-error " : "text-primary-default"
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
              value={values.password ?? ""}
              onChange={handleChange}
              type="password"
              id="password"
              onBlur={handleBlur}
              className={`rounded-xl border  w-full h-10 py-2 px-2 
                        outline-none transition-all duration-200 
                        text-primary-default ${
                          errors.password
                            ? "focus:ring-error border-error"
                            : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                        }`}
              placeholder="Confirm your password"
            />
            {errors.password && (
              <span className="text-error font-lato text-xs top-0">
                {errors.password as string}
              </span>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className="w-full flex flex-col gap-5 mt-4">
          <button
            type="button"
            onClick={() => handleSubmitForm(values)}
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
