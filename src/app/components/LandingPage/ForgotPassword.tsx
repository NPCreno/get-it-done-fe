"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { userSchema } from "@/app/schemas/userSchema";

export default function ForgotPassword() {
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
    initialValues: { rememberMe: false },
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

  return (
    <div className="flex flex-col rounded-2xl gap-10 bg-white w-[430px] h-auto p-16 items-center justify-center shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-lato text-[40px] text-primary-default text-center font-bold">
          Forgot Password
        </h1>
        <span className="font-lato text-lg text-primary-default text-center font-normal">
          Please enter your email to continue
        </span>
      </div>

      {/* form */}
      <form className="flex flex-col w-full" id="signupForm" name="signupForm">
        <div className="flex flex-col justify-center">
          {/* Password */}
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
        </div>

        {/* buttons */}
        <div className="w-full flex flex-col gap-5 mt-8">
          <button
            type="button"
            className="rounded-3xl bg-primary-default font-bold font-poppins h-10 text-white 
              hover:shadow-primary-default transition-shadow duration-300"
          >
            Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
}
