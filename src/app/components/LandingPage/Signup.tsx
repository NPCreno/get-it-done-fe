import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function Signup() {
  return (
    <div className="flex flex-col rounded-2xl gap-10 bg-white w-[430px] h-[695px] pl-16 pr-16 items-center justify-center shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-lato text-[40px] text-primary-default text-center font-bold h-16">
          Welcome Back!
        </h1>
        <span className="font-lato text-lg text-primary-default text-center font-normal h-6">
          Enter to start getting things done
        </span>
      </div>

      {/* form */}
      <div className="flex flex-col gap-8">
        <div className="flex-col"></div>
        <div className=""></div>
      </div>

      <div className=""></div>

      <div className=""></div>
    </div>
  );
}
