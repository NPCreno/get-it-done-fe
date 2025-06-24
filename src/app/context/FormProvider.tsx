"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ITask } from "../interface/ITask";

// Define the types for form state and additional universal states
type FormStateType = {
  name: string;
  email: string;
  applicationStatus: string;
};

type UniversalStateType = {
  formState: FormStateType;
  setFormState: React.Dispatch<React.SetStateAction<FormStateType>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  selectedTaskData: ITask | null;
  setSelectedTaskData: React.Dispatch<React.SetStateAction<ITask | null>>;
};

// Create the context
const FormContext = createContext<UniversalStateType | null>(null);

// Create the Provider component
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<FormStateType>({
    name: "",
    email: "",
    applicationStatus: "pending",
  });

  // Additional universal states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(60);
  const [selectedTaskData, setSelectedTaskData] = useState<ITask | null>(null);

  // Mobile sidebar actions
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <FormContext.Provider
      value={{
        formState,
        setFormState,
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        isLoading,
        setIsLoading,
        sidebarWidth,
        setSidebarWidth,
        selectedTaskData,
        setSelectedTaskData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the global state
export const useFormState = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormState must be used within a FormProvider");
  }
  return context;
};
