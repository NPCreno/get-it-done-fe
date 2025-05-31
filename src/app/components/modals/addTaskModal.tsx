import React, { useEffect } from 'react';
import Image from 'next/image';
import InputBox from '../inputBox';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  setTaskTitle: (taskTitle: string) => void;
  taskDescription: string;
  setTaskDescription: (taskDescription: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  dueDate: Date | null;
  setDueDate: (dueDate: Date) => void;
  errors: any;
  handleCreateTask: () => void;
  projectOptions: any;
  setProject: (project: string) => void;
  status: string;
  setStatus: (status: string) => void;
  isRecurring: boolean;
  setIsRecurring: (isRecurring: boolean) => void;
  repeatEvery: string;
  setRepeatEvery: (repeatEvery: string) => void;
  repeatDays: string[];
  setRepeatDays: (repeatDays: string[]) => void;
  startDate: Date | null;
  setStartDate: (startDate: Date) => void;
  endDate: Date | null;
  setEndDate: (endDate: Date) => void;
}

export default function AddTaskModal({ 
  isOpen, 
  onClose, 
  taskTitle, 
  setTaskTitle, 
  taskDescription, 
  setTaskDescription, 
  dueDate, 
  setDueDate, 
  errors,
  handleCreateTask,
  priority,
  setPriority,
  projectOptions,
  setProject,
  status,
  setStatus,
  isRecurring,
  setIsRecurring,
  repeatEvery,
  setRepeatEvery,
  repeatDays,
  setRepeatDays,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: AddTaskModalProps) {
  if (!isOpen) return null;
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const priorityOptions = [
    { name: "Low", color: "#219EBC" },
    { name: "Medium", color: "#FF7A25" },
    { name: "High", color: "#FE6E6B" },
  ];

  const statusOptions = [
    { name: "Pending", color: "#219EBC" },
    { name: "Completed", color: "#53D86A" },
  ];

  const repeatEveryOptions = [
    { name: "Day"},
    { name: "Week"},
    { name: "Month"},
  ];

  const clearAllData = () => {
    setTaskTitle("");
    setTaskDescription("");
    setPriority("");
    setProject("");
    setStatus("");
    setDueDate(new Date()); 
    setIsRecurring(false);
    setRepeatEvery("");
    setRepeatDays([]);
    setStartDate(new Date());
    setEndDate(new Date());
  }

  window.addEventListener('keydown', handleEscapeKey);
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="modal-popup bg-white w-[550px] h-auto rounded-[10px] p-5 shadow-lg flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-text text-[20px] font-bold font-lato">Add New Task</h1>
                <Image src="/svgs/close.svg" alt="close" width={20} height={20} onClick={onClose} className="cursor-pointer"/>
            </div>
            <h2 className="text-[#676767] text-sm font-lato">Create a new task to track your work</h2>
        </div>

        <InputBox 
            type="text"
            label="Task Title" 
            placeholder="Enter Task title" 
            value={{name: taskTitle}} 
            onChange={(e) => setTaskTitle(e.target.value)} 
            isLabelVisible={true}
            error={errors.title}
        />

        <InputBox 
            type="textarea"
            label="Description" 
            placeholder="Enter description (optional)" 
            value={{name: taskDescription}} 
            onChange={(e) => setTaskDescription(e.target.value)} 
            isLabelVisible={true}
            error={errors.description}
        />
        
        <div className="flex flex-row gap-5">
            <InputBox 
                type="dropdown"
                label="Priority" 
                value={{name: priority}} 
                onChange={(e) => {
                  setPriority(e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select priority"
                dropdownptions={priorityOptions}
                error={errors.priority}
            />
            <InputBox 
                type="dropdown"
                label="Project" 
                value={{name: "Project"}} 
                onChange={(e) => {
                  setProject(e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select project"
                dropdownptions={projectOptions}
                error={errors.project}
            />
        </div>

        <div className="flex flex-row gap-5">
            <InputBox 
                type="dropdown"
                label="Status" 
                value={{name: status}} 
                onChange={(e) => {
                  setStatus(e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select status"
                dropdownptions={statusOptions}
                error={errors.status}
            />
            <InputBox 
                type="datewithtime"
                label="Due Date" 
                value={{ name: dueDate ? dueDate.toISOString() : "" }} 
                onChange={(e) => setDueDate(new Date(e.target.value))} 
                isLabelVisible={true}
                placeholder="Select due date"
                error={errors.due_date}
                customClass="translate-x-[150px] translate-y-[-170px]"
            />
        </div>

        <div className="flex flex-row w-full justify-center">
            <button className={`flex justify-center items-center text-primary-default 
                font-lato font-bold text-[13px] p-[10px] ${isRecurring ? "bg-primary-default text-white rounded-sm" : ""}`} 
                onClick={() => setIsRecurring(!isRecurring)}>
                Recurring
            </button>
        </div>

        {isRecurring && (
            <>
                <div className="flex flex-row gap-5">
                    <InputBox 
                        type="dropdown"
                        label="Repeat Every" 
                        value={{name: repeatEvery}} 
                        onChange={(e) => {
                        setRepeatEvery(e.target.name);
                        }} 
                        isLabelVisible={true}
                        placeholder="Select repeat every"
                        dropdownptions={repeatEveryOptions}
                        error={errors.repeat_every}
                    />
                    <InputBox 
                        type="weekdayselector"
                        label="Repeat Days" 
                        value={{ name: repeatDays.join(",") }} 
                        onChange={(e) => setRepeatDays(e.target.name.split(","))} 
                        isLabelVisible={true}
                        placeholder="Select repeat days"
                        error={errors.repeat_days}
                        disabled={repeatEvery !== "Week"}
                    />
                </div>

                <div className="flex flex-row gap-5">
                <InputBox 
                    type="date"
                    label="Start Date" 
                    value={{name: startDate ? startDate.toISOString() : ""}} 
                    onChange={(e) => {
                    setStartDate(new Date(e.target.value));
                    }} 
                    isLabelVisible={true}
                    placeholder="Select start date"
                    error={errors.start_date}
                />
                <InputBox 
                    type="date"
                    label="End Date" 
                    value={{ name: endDate ? endDate.toISOString() : "" }} 
                    onChange={(e) => setEndDate(new Date(e.target.value))} 
                    isLabelVisible={true}
                    placeholder="Select end date (optional)"
                    error={errors.end_date}
                />
                </div>
            </>
        )}
        
        <div className="flex flex-row justify-end gap-4 w-full">
            <div className="w-full"></div>
            <div className="flex flex-row gap-[10px]">
                <button className="border border-primary-200 rounded-[5px] flex justify-center items-center text-primary-default 
                font-lato text-xs p-[10px]" onClick={onClose}>Cancel</button>
                <button className="bg-primary-default rounded-[5px] flex justify-center items-center text-white font-lato 
                text-xs p-[10px]" onClick={handleCreateTask}>Create</button>
            </div>
        </div>
      </div>
    </div>
  );
}
