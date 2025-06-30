"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { signUpSchema } from "@/app/schemas/signUpSchema";
import { createUser, loginEmail } from "../api/userRequests";
import InputBox from "./inputBox";

interface SignupFormValues {
  username: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  tier: string;
}

export default function Signup({
  onChangeView,
}: {
  onChangeView: (view: "signedUp" | "login") => void;
}) {
  // UseStates
  
  const [isPasswordMatched, setIsPasswordMatched] = useState(false); 
  console.log(isPasswordMatched)
  const {
    validateForm,
    values,
    errors,
    handleSubmit,
    setSubmitting,
    setFieldValue,
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
    onSubmit: async (values: SignupFormValues) => {
      setSubmitting(false);
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: SignupFormValues) => {
    const validationErrors = await validateForm();

    // Allow submission if there are no errors OR the only error is usernameOrEmail
    if (
      Object.keys(validationErrors).length === 0 ||
      (Object.keys(validationErrors).length === 1 &&
        validationErrors.username)
    ) {
      await signUp(values);
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
    const { data } = await loginEmail(email, password);

    if (data) {
      document.cookie = `access_token=${data.access_token}; path=/; secure; SameSite=Strict`; // Store in cookie
      onChangeView("signedUp");
    }
  }

  const signUp = async (values: SignupFormValues) => {
    try {
      const { confirmPassword, ...payload } = values; // Remove confirmPassword value in payload
      console.log("confirmPassword:", confirmPassword) //for linting purposes
      const response = await createUser(payload);
      if (response?.error) {
        console.error("Error:", response.error);
          } else {
            await autoLogin();
          }
        }
    catch (error) {
      console.log("Signup Error:", error);
    }
  } 


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
          <InputBox 
            type="text"
            label="Full Name" 
            placeholder="Enter your Full Name" 
            value={{name: values.fullname}} 
            onChange={(e) => setFieldValue("fullname", e.target.value)} 
            isLabelVisible={true}
            error={errors.fullname}
            isLanding={true}
          />

          {/* Username */}
          <InputBox 
            type="text"
            label="Username" 
            placeholder="Enter your Username" 
            value={{name: values.username}} 
            onChange={(e) => setFieldValue("username", e.target.value)} 
            isLabelVisible={true}
            error={errors.username}
            isLanding={true}
          />

          {/* Email */}
          <InputBox 
            type="email"
            label="Email" 
            placeholder="Enter your Email" 
            value={{name: values.email}} 
            onChange={(e) => setFieldValue("email", e.target.value)} 
            isLabelVisible={true}
            error={errors.email}
            isLanding={true}
          />

          {/* Password */}
          <InputBox 
            type="password"
            label="Password" 
            placeholder="Enter your Password" 
            value={{name: values.password}} 
            onChange={(e) => setFieldValue("password", e.target.value)} 
            isLabelVisible={true}
            error={errors.password}
            isLanding={true}
          />

          {/* Confirm Password */}
          <InputBox 
            type="password"
            label="Confirm Password" 
            placeholder="Confirm your Password" 
            value={{name: values.confirmPassword}} 
            onChange={(e) => setFieldValue("confirmPassword", e.target.value)} 
            isLabelVisible={true}
            error={errors.confirmPassword}
            isLanding={true}
          />
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
