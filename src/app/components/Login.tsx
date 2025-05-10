"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "@/app/schemas/loginSchema";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
export default function Login({
  onChangeView,
}: {
  onChangeView: (view: "signup" | "forgotPassword") => void;
}) {
  const router = useRouter();

  // UseStates
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    setFieldError,
  } = useFormik({
    initialValues: { rememberMe: false },
    enableReinitialize: true,
    validationSchema: loginSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values: any) => {
      setSubmitting(false);
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: any) => {
    setIsSubmitted(true); // Mark as submitted
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      await login();
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      let emailToLogin = values.usernameOrEmail;

      // Check if the input is a username
      if (!values.usernameOrEmail.includes("@")) {
        // Query the profiles table to find the email associated with the username
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", values.usernameOrEmail)
          .single();

        if (error) {
          setIsLoading(false);
          console.log("Error finding username:", error);
          return; // Handle error if username doesn't exist
        }

        if (data) {
          emailToLogin = data.email; // Use the email associated with the username
        }
      }

      // Now use the email (whether it was entered as email or resolved from username)
      const { error, data } = await supabase.auth.signInWithPassword({
        email: emailToLogin,
        password: values.password,
      });

      if (data.session != null) {
        setIsLoading(false);
        router.push("/dashboard");
      } 
      
      else {
        setFieldError("usernameOrEmail", "Invalid login credentials");
        setFieldError("password", "Invalid login credentials");
        setIsLoading(false);
      }

      router.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
      console.log("Error during login:", error);
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
      <form className="flex flex-col w-full" id="loginForm" name="loginForm">
        <div className="flex flex-col justify-center">
          {/* Username or Email */}
          <div className="min-h-[89px]">
            <div className={` ${errors.usernameOrEmail ? "shake" : ""}`}>
              <label
                htmlFor="usernameOrEmail"
                className={`text-base font-normal font-lato ${
                  errors.usernameOrEmail
                    ? "text-error "
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
              value={values.usernameOrEmail || values.email}
              onChange={handleChange}
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              onBlur={handleBlur}
              className={`rounded-xl border  w-full h-10 py-2 px-2 
                outline-none transition-all duration-200 
                text-primary-default ${
                  errors.usernameOrEmail
                    ? "focus:ring-error border-error"
                    : "focus:ring-primary-default focus:ring-2  border-[#E0E0E0]"
                }`}
              placeholder="Enter email or username"
            />
            {errors.usernameOrEmail && (
              <span className="text-error font-lato text-xs top-0">
                {errors.usernameOrEmail as string}
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
                  handleSubmit();
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
              placeholder="Enter password"
            />
            {errors.password && (
              <span className="text-error font-lato text-xs top-0">
                {errors.password as string}
              </span>
            )}
          </div>
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

        {/* buttons */}
        <div className="w-full flex flex-col gap-5 mt-8">
          <button
            type="button"
            onClick={() => handleSubmitForm(values)}
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
          <img src="/fb-logo.png" alt="fb-logo" className="h-6 w-6" />
        </button>
        <button className="h-12 w-12 border-[2px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <img src="/google-logo.png" alt="google-logo" className="h-6 w-6" />
        </button>
        <button className="h-12 w-12 border-[2px] border-solid border-primary-default rounded-[50px] flex items-center justify-center">
          <img src="/apple-logo.png" alt="apple-logo" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
