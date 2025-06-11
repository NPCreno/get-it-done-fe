"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { IUser } from "../interface/IUser";
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
  isSidebarOpen: boolean; // Example universal state
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>; // Setter function
  isLoading: boolean; // Another global state (e.g., loading spinner)
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [sidebarWidth, setSidebarWidth] = useState(60);
  const [selectedTaskData, setSelectedTaskData] = useState<ITask | null>(null);

  return (
    <FormContext.Provider
      value={{
        formState,
        setFormState,
        isSidebarOpen,
        setIsSidebarOpen,
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
