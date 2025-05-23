"use client";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function LandingPage() {
  const router = useRouter();
  // UseStates
  const [activeCard, setActiveCard] = useState<string>("login");
  const [signedUp, setIsSignedUp] = useState<boolean>(false);
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
  }, [router]);

  useEffect(() => {
    if (activeCard === "signedUp") {
      setIsSignedUp(true);
    }
  }, [activeCard]);

  return !signedUp ? (
    <div className="flex flex-row">
      {/* left side */}
      <div className="min-w-[50vw] min-h-screen bg-gradient-to-t from-primary-300 to-white flex flex-col justify-center items-center">
        {activeCard === "login" && <Login onChangeView={setActiveCard}></Login>}
        {activeCard === "signup" && (
          <Signup onChangeView={setActiveCard}></Signup>
        )}
        {activeCard === "forgotPassword" && <ForgotPassword onChangeView={setActiveCard}></ForgotPassword>}
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
          <Image
            src="/people-meeting.jpg"
            width={460}
            height={460}
            alt="people-meeting"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center bg-gradient-to-t from-primary-default to-primary-200 h-screen ">
      {/* center card */}
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col gap-9 items-center">
          <h1 className="font-rancho text-[64px] text-white text-center">
            Congratulations
          </h1>
          <span className="font-lato text-3xl text-white text-center mt-[20px] w-[190px]">
            You&apos;re all set to get things done
          </span>
          <Image
            src="/svgs/checkmark-circle-outline.svg"
            className="mt-[50px]"
            width={150}
            height={150}
            alt="checkmark-circle-outline"
          />
          <a
            type="button"
            href="/dashboard"
            className="rounded-3xl bg-white font-bold font-poppins h-[46px] text-primary-default flex items-center justify-center mt-[50px] w-[276px]"
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  );
}
