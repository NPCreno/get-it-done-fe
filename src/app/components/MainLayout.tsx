"use client";
import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background">
      <div className="hover:w-[166px] w-[80px] p-5 h-screen transition-all duration-300">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 transition-all duration-300">{children}</div>
    </div>
  );
}
