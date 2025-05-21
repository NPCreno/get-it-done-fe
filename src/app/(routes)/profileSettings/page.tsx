"use client"
import { getUser, updateUser } from "@/app/api/api";
import MainLayout from "@/app/components/MainLayout";
import ToggleSwitch from "@/app/components/toggleSwitch";
import { updateUserSchema } from "@/app/schemas/updateUserSchema";
import { useFormik, FormikErrors } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState } from "@/app/context/FormProvider";
import { Toast } from "@/app/components/toast";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";

interface profileSettingsFormValues {
  fullname: string;
  username: string;
  password: string;
  theme: string;
  enableNotifications: boolean;
  soundFx: boolean;
}

export default function ProfileSettingsPage() {
  const { user, setUser } = useFormState();
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "", className: "" });
  const [isExiting, setIsExiting] = useState(false);
  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    handleChange,
    setSubmitting,
    handleBlur,
  } = useFormik({
    initialValues: {
      fullname: user ? user.fullname : "",
      username: user ? user.username : "",
      password: "",
      theme: "",
      enableNotifications: false,
      soundFx: false,
    },
    enableReinitialize: true,
    validationSchema: updateUserSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values: profileSettingsFormValues) => {
      setSubmitting(false);
      handleSubmitForm(values);
    }
  });
  

  const handleSubmitForm = async (values: profileSettingsFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();

    if (Object.keys(validationErrors).length === 0) {
      await update(values)
    }
    setSubmitting(false);
  };

  const update = async (values: profileSettingsFormValues) => {
    try {
      if(!user){
        console.error("No User data found");
        return
      }

      const updateData = {
        ...values,
        enableNotifications: values.enableNotifications.toString(),
        soundFx: values.soundFx.toString()
      };

      const response = await updateUser(user.user_id, updateData);
      
      if (response) {
        setToastMessage({
          title: "Profile Settings Saved",
          description: "Your preferences have been saved",
          className: "text-green-600",
        });
      
        setShowToast(true);
        setIsExiting(false);
      
        setTimeout(() => {
          setIsExiting(true); // Start exit animation
          setTimeout(() => {
            setShowToast(false); // Remove after animation completes
          }, 400); // Must match the toastOut animation duration
        }, 10000); // Toast display duration
      }
    } catch (error) {
      if (error instanceof Error) {
        setToastMessage({
          title: "Something Went Wrong",
          description: error.message,
          className: "text-error-default",
        });
      } else {
        setToastMessage({
          title: "Something Went Wrong",
          description: "An unknown error occurred",
          className: "text-error-default",
        });
      }
      setShowToast(true);
      setIsExiting(false);
      
      setTimeout(() => {
        setIsExiting(true); // Start exit animation
        setTimeout(() => {
          setShowToast(false); // Remove after animation completes
        }, 400); // Must match the toastOut animation duration
      }, 10000); // Toast display duration
    }
  };
        
  const handleToastClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowToast(false);
    }, 400);
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If no user, try getting one from cookies
        if (!user) {
          const token = getAccessTokenFromCookies();
          if (!token) {
            console.error("No access_token found in cookies");
            return;
          }
  
          const parsedUser = parseJwt(token);
          if (!parsedUser || !parsedUser.user_id) {
            console.error("Failed to parse user or missing user_id in token");
            return;
          }
  
          setUser(parsedUser);
          return;
        }
       
        const response = await getUser(user.user_id);  // If user exists, fetch updated info
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <MainLayout>
      {showToast && (
        <div className={`fixed bottom-4 right-4 z-50 ${isExiting ? "toast-exit" : "toast-enter"}`}>
          <Toast {...toastMessage} onClose={handleToastClose} />
        </div>
      )}
      <div className="main flex justify-center w-full">
        {/* Main Page */}
        <div className="inside max-w-[1440px] w-full mx-auto gap-5 flex flex-col">
          <div className="flex justify-between">
            {/* Left header */}
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold text-primary-default fade-in select-none">
                Profile Settings
              </h1>
              <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                Manage Your Profile & Preferences
              </p>
            </div>
          </div>

           <form className="flex flex-row gap-5" id="profileSettings" name="profileSettings" onSubmit={handleSubmit}>
            {/* left side */}
            <div className="flex flex-col gap-5 min-w-[934px] h-full">
              {/* Profile Information */}
              <div className="flex flex-col rounded-[10px] bg-white p-5">
                {/* profile information header */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-5 ">
                      <Image
                        src={'/svgs/user.svg'}
                        width={24}
                        height={24}
                        alt={'user icon'}
                        className="fade-in-delay"
                      />  

                      <p className="font-lato text-2xl text-primary-default fade-in-delay select-none">
                       Profile Information
                      </p>
                    </div>
                    <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                      Update your personal information
                    </p>
                  </div>

                  <div className="flex flex-row justify-center items-center gap-4">
                    <Image
                      src={'/svgs/settings.svg'}
                      width={24}
                      height={24}
                      alt={'user icon'}
                      className="fade-in-delay"
                    />
                    <p className="font-lato text-base font-bold text-primary-default fade-in-delay hover:cursor-pointer" onClick={()=>{
                      setIsEditEnabled(true)}}>
                      Edit
                    </p>
                  </div>
                </div>

                <div className="mt-5 fade-in-delay" >
                  {/* fullname input */}
                  <div className="min-h-[95px]">
                    <div className={` ${errors.fullname ? "shake" : ""}`}>
                      <label
                        htmlFor="fullname"
                        className={`text-base font-normal font-lato ${
                          errors.fullname ? "text-error-default" : "text-text"
                        }`}
                      >
                        Full name
                      </label>
                    </div>
                    <input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      value={values.fullname ?? ""}
                      onChange={handleChange}
                      type="text"
                      id="fullname"
                      onBlur={handleBlur}
                      className={`rounded-xl border  w-full h-[46px] py-2 px-5 ${isEditEnabled ? " bg-white" : "bg-background"}
                                outline-none transition-all duration-200 
                                text-text ${
                                  errors.fullname
                                    ? "focus:ring-error border-error"
                                    : "focus:ring-text focus:ring-2  border-[#E0E0E0]"
                                }`}
                      placeholder="Enter your Full name"
                      disabled={!isEditEnabled}
                    />
                    {errors.fullname && (
                      <span className="text-error-default font-lato text-xs top-0">
                        {errors.fullname as string}
                      </span>
                    )}
                  </div>

                  {/* username input */}
                  <div className="min-h-[95px]">
                    <div className={` ${errors.username ? "shake" : ""}`}>
                      <label
                        htmlFor="username"
                        className={`text-base font-normal font-lato ${
                          errors.username ? "text-error-default " : "text-text"
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
                      type="text"
                      id="username"
                      onBlur={handleBlur}
                      className={`rounded-xl border  w-full h-[46px] py-2 px-5 ${isEditEnabled ? " bg-white" : "bg-background"}
                                outline-none transition-all duration-200 
                                text-text ${
                                  errors.username
                                    ? "focus:ring-error border-error"
                                    : "focus:ring-text focus:ring-2  border-[#E0E0E0]"
                                }`}
                      placeholder="Enter your email address"
                      disabled={!isEditEnabled}
                    />
                    {errors.username && (
                      <span className="text-error-default font-lato text-xs top-0">
                        {errors.username as string}
                      </span>
                    )}
                  </div>

                  {/* password input */}
                  <div className="min-h-[95px]">
                    <div className={` ${errors.password ? "shake" : ""}`}>
                      <label
                        htmlFor="password"
                        className={`text-base font-normal font-lato ${
                          errors.password ? "text-error-default " : "text-text"
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
                      className={`rounded-xl border  w-full h-[46px] py-2 px-5 ${isEditEnabled ? " bg-white" : "bg-background"}
                                outline-none transition-all duration-200 
                                text-text ${
                                  errors.password
                                    ? "focus:ring-error border-error"
                                    : "focus:ring-text focus:ring-2  border-[#E0E0E0]"
                                }`}
                      placeholder="Enter your password"
                      disabled={!isEditEnabled}
                    />
                    {errors.password && (
                      <span className="text-error-default font-lato text-xs top-0">
                        {errors.password as string}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* General Settings*/}
              <div className="flex flex-col rounded-[10px] bg-white p-5 gap-[10px]">
                {/* profile information header */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-5 ">
                      <Image
                        src={'/svgs/bell.svg'}
                        width={24}
                        height={24}
                        alt={'user icon'}
                        className="fade-in-delay"
                      />  

                      <p className="font-lato text-2xl text-primary-default fade-in-delay select-none">
                       Notifications
                      </p>
                    </div>
                    <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                      Configure notification preferences
                    </p>
                  </div>
                </div>

                <div className="mt-5 fade-in-delay" >
                  {/* Enable notifications */}
                  <div className="flex flex-row justify-between h-20 border-b border-border">
                    <div className="flex flex-col justify-center">
                      <p className="font-lato text-2xl text-primary-default fade-in-delay select-none">
                        Enable notifications
                      </p>
                      <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                        Recieve notifications for tasks and reminders
                      </p>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-4">
                      <ToggleSwitch
                        name="enableNotifications"
                        value={values.enableNotifications}
                        onChange={setFieldValue}
                        onLabel="Enabled"
                        offLabel="Disabled"
                        className="fade-in-delay"
                      />
                    </div>
                  </div>

                  {/*  */}
                  <div className="flex flex-row justify-between h-20">
                    <div className="flex flex-col justify-center">
                      <p className="font-lato text-2xl text-primary-default fade-in-delay select-none">
                        Sound Effects
                      </p>
                      <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                        Play sound when completing tasks
                      </p>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-4">
                      <ToggleSwitch
                        name="soundFx"
                        value={values.soundFx}
                        onChange={setFieldValue}
                        onLabel="Enabled"
                        offLabel="Disabled"
                        className="fade-in-delay"
                      />
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="flex flex-col gap-5 min-w-[350px] fade-in-delay-2">
              <div className="flex flex-col gap-5 p-5 bg-white rounded-[10px]">
                {/* Appearance header */}
                <div className="flex-flex-col">
                  <p className="font-lato text-2xl text-primary-default fade-in-delay select-none">
                    Appearance
                  </p>
                  <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                    Customize how Task Tracker looks
                  </p>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-5">
                    <Image
                      src={'/svgs/sun.svg'}
                      width={24}
                      height={24}
                      alt={'Sun icon'}
                      className="fade-in-delay"
                    />  

                    <p className="font-lato text-base font-bold text-text fade-in-delay select-none">
                      Dark Mode
                    </p>
                  </div>
                    <ToggleSwitch
                      name="theme"
                      value={values.theme === "dark"}
                      onChange={(name, value) => setFieldValue(name, value ? "dark" : "light")}
                      onLabel="Dark"
                      offLabel="Light"
                      className="fade-in-delay"
                    />
                </div>

              </div>

              <button type="submit" className="rounded-[10px] bg-primary-default flex flex-row justify-center items-center h-10 gap-5
              hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300
              ">
                <Image
                  src={'/svgs/save.svg'}
                  width={24}
                  height={24}
                  alt={'Sun icon'}
                  className="fade-in-delay"
                /> 
                <span className="font-lato text-lg font-bold text-white ">
                  Save Settings
                </span>
              </button>

              <button type="button" className="rounded-[10px] bg-error-300 flex flex-row justify-center items-center h-10 gap-5
              hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300
              ">
                <Image
                  src={'/svgs/log-out.svg'}
                  width={24}
                  height={24}
                  alt={'Sun icon'}
                  className="fade-in-delay"
                /> 
                <span className="font-lato text-lg font-bold text-white ">
                  Log out
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
