import React from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-row">
      <div className="min-w-[50vw] min-h-screen bg-gradient-to-t from-primary-default to-white flex flex-col justify-center items-center"></div>
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
