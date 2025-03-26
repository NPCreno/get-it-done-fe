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
      <div className="flex-1 p-6 transition-all duration-300">{children}</div>
    </div>
  );
}
