"use client";

import { JSX, useEffect, useState } from "react";
import { FiMenu, FiX, FiHome, FiGrid, FiBell, FiUser } from "react-icons/fi";
import { useFormState } from "@/app/context/FormProvider";
import SidebarLink from "./sidebarLink";

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
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.2499 15.0027C26.2499 8.79175 21.2108 3.75269 14.9999 3.75269C8.78894 3.75269 3.74988 8.79175 3.74988 15.0027C3.74988 21.2136 8.78894 26.2527 14.9999 26.2527C21.2108 26.2527 26.2499 21.2136 26.2499 15.0027Z"
              stroke="#FEAD03"
              stroke-width="2"
              stroke-miterlimit="10"
            />
            <g filter="url(#filter0_d_572_2027)">
              <path
                d="M21.5624 11.2517L15.0075 18.7517L12.1979 15.9392M11.2469 18.7517L8.43738 15.9392M17.9126 11.2517L14.8921 14.7087"
                stroke="#FEAD03"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                shape-rendering="crispEdges"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_572_2027"
                x="3.43738"
                y="10.2517"
                width="23.125"
                height="17.5"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_572_2027"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_572_2027"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>

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
