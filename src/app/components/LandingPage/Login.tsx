"use client";
import React from "react";
import { useFormik } from "formik";
import { userSchema } from "@/app/schemas/userSchema";

export default function Login() {
  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    handleChange,
    isValid,
    setSubmitting,
  } = useFormik({
    initialValues: {},
    enableReinitialize: true,
    validationSchema: userSchema,
    onSubmit: async (values: any) => {
      setSubmitting(false);
      onHandleFormSubmit(values);
    },
  });

  const onHandleFormSubmit = async (data: any) => {
    try {
    } catch (error) {
      // alert("Oops! Something went wrong. Please try again "+ {error});
    }
  };

  return (
    <div className="flex flex-col rounded-2xl gap-10 bg-white w-[430px] h-[695px] pl-16 pr-16 items-center justify-center shadow-2xl">
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
      <form className="flex flex-col" id="signupForm" name="signupForm">
        <div className="flex flex-col justify-center gap-5">
          {/* Email */}
          <div className="">
            <label
              htmlFor="emailUsername"
              className="text-primary-default text-base font-normal font-lato "
            >
              Email or Username
            </label>
            <input
              type="text"
              id="emailUsername"
              className="rounded-xl border border-[#E0E0E0] w-full h-10 py-2 px-5 
                        focus:border-primary-default focus:ring-1 focus:ring-primary-default 
                        outline-none transition-all duration-200"
              placeholder="Enter email or username"
            />
          </div>

          {/* Password */}
          <div className="">
            <label
              htmlFor="password"
              className="text-primary-default text-base font-normal font-lato"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="rounded-xl border border-[#E0E0E0] w-full h-10 py-2 px-5 
                        focus:border-primary-default focus:ring-1 focus:ring-primary-default 
                        outline-none transition-all duration-200"
              placeholder="Enter password"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-between">
          {/* remember password */}
          <div className="flex flex-row">
            <div className="border-[2px] border-solid rounded-[5px] border-primary-default w-5 h-5 cursor-pointer"></div>
            <span className="font-lato text-xs text-primary-default ml-2 font-bold">
              Remember me
            </span>
          </div>

          {/* forgot password */}
          <a
            href="/forgotPassword"
            className="font-lato text-xs text-primary-default ml-2 font-bold"
          >
            Forgot Password?
          </a>
        </div>

        {/* buttons */}
        <div className="w-full flex flex-col gap-5 mt-8">
          <button className="rounded-3xl bg-primary-default font-bold font-poppins h-10 text-white">
            Login
          </button>
          <button className="rounded-3xl bg-white border-solid border-[1px] border-primary-default font-bold font-poppins h-10 text-primary-default">
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
        <button className="h-12 w-12 border-[1px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <img src="/fb-logo.png" alt="fb-logo" className="h-6 w-6" />
        </button>
        <button className="h-12 w-12 border-[1px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <img src="/google-logo.png" alt="google-logo" className="h-6 w-6" />
        </button>
        <button className="h-12 w-12 border-[1px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <img src="/apple-logo.png" alt="apple-logo" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
