"use client";

import { useState } from "react";
import { FiMenu, FiX} from "react-icons/fi";
import { useFormState } from "@/app/context/FormProvider";
import SidebarLink from "./sidebarLink";
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { sidebarWidth, setSidebarWidth, isSidebarOpen, setIsSidebarOpen } =
    useFormState();

  return (
    <>
      {/* Sidebar for large screens */}
      <aside
        className="hidden md:flex flex-col h-full py-5 px-[10px] bg-white text-black rounded-[10px] items-start group transition-all duration-300"
        style={{ width: `${sidebarWidth}px` }} // Use global state for width
        onMouseEnter={() => {
          setSidebarWidth(146);
          setIsSidebarOpen(true);
        }}
        onMouseLeave={() => {
          setSidebarWidth(60);
          setIsSidebarOpen(false);
        }}
      >
        <div className="flex flex-row fixed gap-[10px] max-h-[30px] group-hover:ml-0 ml-1">
          <Image
            src="/svgs/checkmark.svg"
            width={30}
            height={30}
            alt="get it done"
          />

          <h1
            className={`text-2xl text-primary-default font-rancho transition-opacity duration-300 
            ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            Get it Done!
          </h1>
        </div>

        <nav className="flex flex-col gap-5 mt-[60px]">
          <SidebarLink
            href="/dashboard"
            icon="/dashboard-yellow.png"
            iconHover="/dashboard-white.png"
            text="Dashboard"
          />
          <SidebarLink
            href="/projects"
            icon="/projects-yellow.png"
            iconHover="/projects-white.png"
            text="Projects"
          />
          <SidebarLink
            href="/notifications"
            icon="/notifs-yellow.png"
            iconHover="/notifs-white.png"
            text="Notifications"
          />
          <SidebarLink
            href="/profileSettings"
            icon="/profile-yellow.png"
            iconHover="/profile-white.png"
            text="Profile"
          />
        </nav>
      </aside>

      {/* Sidebar for small screens */}
      <div className="md:hidden flex items-center p-4 bg-gray-900 text-white">
        <button onClick={toggleSidebar} className="text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </>
  );
}
