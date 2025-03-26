"use client";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
export default function LandingPage() {
  const router = useRouter();
  // UseStates
  const [activeCard, setActiveCard] = useState<string>("login");
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex flex-row">
      {/* left side */}
      <div className="min-w-[50vw] min-h-screen bg-gradient-to-t from-primary-300 to-white flex flex-col justify-center items-center">
        {activeCard === "login" && <Login onChangeView={setActiveCard}></Login>}
        {activeCard === "signup" && <Signup></Signup>}
        {activeCard === "forgotPassword" && <ForgotPassword></ForgotPassword>}
        {/* ForgotPassword */}
      </div>
      {/* right side */}
      <div className="min-w-[50vw] min-h-screen bg-white flex flex-col justify-center items-center">
        <div className="flex flex-col gap-9 items-center">
          <h1 className="font-rancho text-8xl text-primary-default text-center">
            Get it Done!
          </h1>
          <span className="font-lato text-2xl text-primary-default text-center">
            Stay organized, boost productivity, and achieve your goals.
          </span>
          <img src="/people-meeting.jpg" className="h-[460px] w-[460px]" />
        </div>
      </div>
    </div>
  );
}
