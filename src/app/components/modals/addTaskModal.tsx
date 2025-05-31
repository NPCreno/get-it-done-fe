import React, { useEffect } from 'react';
import Image from 'next/image';
import InputBox from '../inputBox';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: any;
  handleCreateTask: (values: any) => void;
  project: any;
}

interface CustomChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    name: string;
    value: string;
    project_id: string;
    color: string;
  };
}

export default function AddTaskModal({ 
  isOpen, 
  onClose, 
  formik,
  handleCreateTask,
  project
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

  const projectOptions = project.map((option: any) => ({
    name: option.title,
    project_id: option.project_id,
    color: option.color,
  }));

  const clearAllData = () => {
    formik.setFieldValue("title", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("priority", "");
    formik.setFieldValue("project", "");
    formik.setFieldValue("status", "");
    formik.setFieldValue("due_date", new Date());
    formik.setFieldValue("isRecurring", false);
    formik.setFieldValue("repeat_every", "");
    formik.setFieldValue("repeat_days", []);
    formik.setFieldValue("start_date", new Date());
    formik.setFieldValue("end_date", new Date());
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
            value={{name: formik.values.title}} 
            onChange={(e) => formik.setFieldValue("title", e.target.value)} 
            isLabelVisible={true}
            error={formik.errors.title}
        />

        <InputBox 
            type="textarea"
            label="Description" 
            placeholder="Enter description (optional)" 
            value={{name: formik.values.description}} 
            onChange={(e) => formik.setFieldValue("description", e.target.value)} 
            isLabelVisible={true}
            error={formik.errors.description}
        />
        
        <div className="flex flex-row gap-5">
            <InputBox 
                type="dropdown"
                label="Priority" 
                value={{name: formik.values.priority}} 
                onChange={(e) => {
                  formik.setFieldValue("priority", e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select priority"
                dropdownptions={priorityOptions}
                error={formik.errors.priority}
            />
            <InputBox 
                type="dropdown"
                label="Project" 
                value={{name: formik.values.project_title, color: formik.values.project_color, project_id: formik.values.project_id}} 
                onChange={(e) => {
                  const customEvent = e as unknown as CustomChangeEvent;
                  formik.setFieldValue("project_title", customEvent.target.name);
                  formik.setFieldValue("project_color", customEvent.target.value);
                  formik.setFieldValue("project_id", customEvent.target.project_id); 
                }}
                isLabelVisible={true}
                placeholder="Select project"
                dropdownptions={projectOptions}
                error={formik.errors.project}
            />
        </div>

        <div className="flex flex-row gap-5">
            <InputBox 
                type="dropdown"
                label="Status" 
                value={{name: formik.values.status}} 
                onChange={(e) => {
                  formik.setFieldValue("status", e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select status"
                dropdownptions={statusOptions}
                error={formik.errors.status}
            />
            <InputBox 
                type="datewithtime"
                label="Due Date" 
                value={{ name: formik.values.due_date ? formik.values.due_date.toISOString() : "" }} 
                onChange={(e) => formik.setFieldValue("due_date", new Date(e.target.value))} 
                isLabelVisible={true}
                placeholder="Select due date"
                error={formik.errors.due_date}
                customClass="translate-x-[150px] translate-y-[-170px]"
            />
        </div>

        <div className="flex flex-row w-full justify-center">
            <button className={`flex justify-center items-center text-primary-default 
                font-lato font-bold text-[13px] p-[10px] ${formik.values.isRecurring ? "bg-primary-default text-white rounded-sm" : ""}`} 
                onClick={() => formik.setFieldValue("isRecurring", !formik.values.isRecurring)}>
                Recurring
            </button>
        </div>

        {formik.values.isRecurring && (
            <>
                <div className="flex flex-row gap-5">
                    <InputBox 
                        type="dropdown"
                        label="Repeat Every" 
                        value={{name: formik.values.repeat_every}} 
                        onChange={(e) => {
                        formik.setFieldValue("repeat_every", e.target.name);
                        }} 
                        isLabelVisible={true}
                        placeholder="Select repeat every"
                        dropdownptions={repeatEveryOptions}
                        error={formik.errors.repeat_every}
                    />
                    <InputBox 
                        type="weekdayselector"
                        label="Repeat Days" 
                        value={{ name: formik.values.repeat_days.join(",") }} 
                        onChange={(e) => formik.setFieldValue("repeat_days", e.target.name.split(","))} 
                        isLabelVisible={true}
                        placeholder="Select repeat days"
                        error={formik.errors.repeat_days}
                        disabled={formik.values.repeat_every !== "Week"}
                    />
                </div>

                <div className="flex flex-row gap-5">
                <InputBox 
                    type="date"
                    label="Start Date" 
                    value={{name: formik.values.start_date ? formik.values.start_date.toISOString() : ""}} 
                    onChange={(e) => {
                    formik.setFieldValue("start_date", new Date(e.target.value));
                    }} 
                    isLabelVisible={true}
                    placeholder="Select start date"
                    error={formik.errors.start_date}
                />
                <InputBox 
                    type="date"
                    label="End Date" 
                    value={{ name: formik.values.end_date ? formik.values.end_date.toISOString() : "" }} 
                    onChange={(e) => formik.setFieldValue("end_date", new Date(e.target.value))} 
                    isLabelVisible={true}
                    placeholder="Select end date (optional)"
                    error={formik.errors.end_date}
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
                text-xs p-[10px]" onClick={() => handleCreateTask(formik.values)}>Create</button>
            </div>
        </div>
      </div>
    </div>
  );
}
