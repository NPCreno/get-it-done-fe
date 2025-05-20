"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "@/app/schemas/forgotPasswordSchema";
import OTPInput from "@/app/components/OTPinput";
interface forgotPasswordFormValues {
  email: string;
}

export default function ForgotPassword({
  onChangeView,
}: {
  onChangeView: (view: "login") => void;
}) {
  // UseStates
  const [step, setStep] = useState(1);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    setSubmitting,
    handleBlur,
  } = useFormik<forgotPasswordFormValues>({
    initialValues: { email: "" },
    enableReinitialize: true,
    validationSchema: forgotPasswordSchema, 
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values: forgotPasswordFormValues) => {
      setSubmitting(false);
      onHandleFormSubmit(values);
    },
  });

  const onHandleFormSubmit = async (values: forgotPasswordFormValues) => {
    try {
      // TODO: Add API call to send OTP
      console.log(values);
      setStep(2);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOTPComplete = (otp: string) => {
    console.log("Entered OTP:", otp); 
  };

  return (
    <div className="flex flex-col rounded-2xl gap-10 bg-white w-auto h-auto p-10 items-center justify-center shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-lato text-[40px] text-primary-default text-center font-bold">
          {step === 1 && "Forgot Password"}
          {step === 2 && "OTP Verification"}
        </h1>
        <span className="font-lato text-lg text-primary-default text-center font-normal">
          {step === 1 && "Please enter your email to continue"}
          {step === 2 && (
            <>
              Please check OTP that we sent to: <br />
              la**********gmail.com
            </>
          )}
        </span>
      </div>

      {/* form */}
      <form className="flex flex-col w-full" id="signupForm" name="signupForm" onSubmit={handleSubmit}>
        {/* Email */}

        {step === 1 && (
          <div className="flex flex-col justify-center">
            <div className="min-h-[89px]">
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
                className={`rounded-xl border w-full h-[46px] py-2 px-2 
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
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-row gap-[11px] justify-center">
            <OTPInput length={6} onComplete={handleOTPComplete} />
          </div>
        )}

        {/* buttons */}
        <div className="w-full flex flex-col gap-5 mt-8">
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
            onClick={() => {
              setStep(step + 1);
            }}
          >
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}
