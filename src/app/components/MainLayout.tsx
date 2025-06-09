"use client";
import Sidebar from "./Sidebar";
import { useFormState } from "@/app/context/FormProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarWidth, setSidebarWidth } = useFormState();

  return (
    <div className="flex bg-background">
      <div
        className="hover:w-[166px] w-[80px] p-5 h-screen transition-all duration-300"
        style={{ width: `${sidebarWidth + 20}px` }} // Use global state for width
        onMouseEnter={() => setSidebarWidth(146)}
        onMouseLeave={() => setSidebarWidth(60)}
      >
        <Sidebar />
      </div>
      <div className="flex-1 transition-all duration-300 h-screen overflow-hidden">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
