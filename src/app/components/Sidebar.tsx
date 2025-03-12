"use client";

import { JSX, useState } from "react";
import { FiMenu, FiX, FiHome, FiGrid, FiBell, FiUser } from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-gray-900 text-white p-4 fixed">
        <h1 className="text-xl font-bold mb-6">App Tracker</h1>
        <nav className="flex flex-col space-y-4">
          <SidebarLink href="/dashboard" icon={<FiHome />} text="Dashboard" />
          <SidebarLink href="/projects" icon={<FiGrid />} text="Projects" />
          <SidebarLink
            href="/notifications"
            icon={<FiBell />}
            text="Notifications"
          />
          <SidebarLink href="/settings" icon={<FiUser />} text="Settings" />
        </nav>
      </aside>

      {/* Sidebar for small screens */}
      <div className="md:hidden flex items-center p-4 bg-gray-900 text-white">
        <button onClick={toggleSidebar} className="text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <aside className="md:hidden fixed inset-0 bg-gray-900 text-white w-64 h-screen p-4 z-50">
          <button onClick={toggleSidebar} className="text-2xl mb-6">
            <FiX />
          </button>
          <nav className="flex flex-col space-y-4">
            <SidebarLink href="/dashboard" icon={<FiHome />} text="Dashboard" />
            <SidebarLink href="/projects" icon={<FiGrid />} text="Projects" />
            <SidebarLink
              href="/notifications"
              icon={<FiBell />}
              text="Notifications"
            />
            <SidebarLink href="/settings" icon={<FiUser />} text="Settings" />
          </nav>
        </aside>
      )}
    </>
  );
}

function SidebarLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: JSX.Element;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 text-lg hover:bg-gray-800 p-2 rounded"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
