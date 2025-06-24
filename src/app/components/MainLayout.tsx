"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import HamburgerButton from "./HamburgerButton";
import { useFormState } from "@/app/context/FormProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarWidth, setSidebarWidth, isMobileSidebarOpen, closeMobileSidebar } = useFormState();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile sidebar when clicking on main content
  const handleMainContentClick = () => {
    if (isMobile && isMobileSidebarOpen) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div 
        className={`hidden md:block hover:w-[146px] w-[80px] p-5 h-screen transition-all duration-300`}
        style={{ width: `${sidebarWidth + 20}px` }}
        onMouseEnter={() => setSidebarWidth(146)}
        onMouseLeave={() => setSidebarWidth(60)}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-300 h-screen overflow-auto"
        onClick={handleMainContentClick}
      >
        {/* Hamburger Button - Only visible on mobile */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <HamburgerButton />
        </div>
        
        <div className="h-full flex flex-col overflow-auto pt-16 md:pt-0">
          <div className="p-4 md:p-6 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
