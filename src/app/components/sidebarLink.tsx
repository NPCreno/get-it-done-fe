import { useState, useEffect } from "react";
import { useFormState } from "../context/FormProvider";
import Link from "next/link";
import Image from "next/image";
export default function SidebarLink({
  href,
  icon,
  iconHover,
  text,
}: {
  href: string;
  icon: string;
  iconHover: string;
  text: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const { isSidebarOpen } =
    useFormState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPage(window.location.pathname);
    }
  }, []);

  const isActive = currentPage === href; // Check if this link matches the current page

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-[10px] h-[35px] w-[35px] justify-start 
        group-hover:w-[126px] transition-all duration-300 linkbtn 
        ${
          isActive || isHovered
            ? "bg-primary-default shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)]"
            : "hover:bg-primary-default"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={isActive || isHovered ? iconHover : icon}
        alt={text}
        width={20}
        height={20}
        className="ml-2 transition-opacity duration-300"
      />
      <span
        className={`font-bold font-lato text-[13px] transition-opacity duration-300
            ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}
            ${isActive || isHovered ? "text-white" : "text-primary-default"}
          `}
      >
        {text}
      </span>
    </Link>
  );
}
