import React from 'react';
import Image from 'next/image';
import InputBox from '../inputBox';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: FormErrors;
  formik: FormikType;
  handleCreateProject: (values: FormValues) => void;
}

interface FormValues {
  title: string;
  description: string;
  color: string;
  colorLabel: string;
  due_date: Date | null;
  user_id: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  color?: string;
  colorLabel?: string;
  due_date?: string;
}

interface FormikType {
  values: FormValues;
  errors: FormErrors;
  setFieldValue: (field: keyof FormValues, value: FormValues[keyof FormValues]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function AddProjectModal({ 
  isOpen, 
  onClose, 
  formik,
  errors,
  handleCreateProject,
}: AddProjectModalProps) {
  if (!isOpen) return null;

  const dropdownOptions = [
    { name: "Lavender", color: "#E6E6FA" },  
    { name: "Mint", color: "#B5EAD7" },      
    { name: "Peach", color: "#FFDAB9" },     
    { name: "Sky", color: "#A0D8EF" },       
    { name: "Lemon", color: "#FFFACD" },     
    { name: "Rose", color: "#FADADD" },      
    { name: "Mauve", color: "#E0B0FF" },     
    { name: "Baby Blue", color: "#BDE0FE" }, 
    { name: "Coral", color: "#FFB5A7" },     
    { name: "Seafoam", color: "#C3FBD8" },   
  ];
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleEscapeKey);
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="modal-popup bg-white w-[500px] h-auto rounded-[10px] p-5 shadow-lg flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-text text-[20px] font-bold font-lato">Create New Project</h1>
                <Image src="/svgs/close.svg" alt="close" width={20} height={20} onClick={onClose} className="cursor-pointer"/>
            </div>
            <h2 className="text-[#676767] text-sm font-lato">Add a new project to organize your tasks.</h2>
        </div>

        <InputBox 
            type="text"
            label="Project Title" 
            placeholder="Enter Project title" 
            value={{name: formik.values.title}} 
            onChange={(e) => formik.setFieldValue("title", e.target.value)} 
            isLabelVisible={true}
            error={errors.title}
        />

        <InputBox 
            type="textarea"
            label="Description" 
            placeholder="Enter description (optional)" 
            value={{name: formik.values.description}} 
            onChange={(e) => formik.setFieldValue("description", e.target.value)} 
            isLabelVisible={true}
            error={errors.description}
        />
        
        <div className="flex flex-row gap-5">
            <InputBox 
                type="dropdown"
                label="Color" 
                value={{name: formik.values.colorLabel, color: formik.values.color}} 
                onChange={(e) => {
                  formik.setFieldValue("color", e.target.value);
                  formik.setFieldValue("colorLabel", e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select color"
                dropdownptions={dropdownOptions}
                error={errors.color}
                customClass="translate-x-[150px] translate-y-[-228px]"
            />
            <InputBox 
                type="datewithtime"
                label="Due Date" 
                value={{ name: formik.values.due_date ? formik.values.due_date.toISOString() : "" }} 
                onChange={(e) => formik.setFieldValue("due_date", new Date(e.target.value))} 
                isLabelVisible={true}
                placeholder="Select due date (optional)"
                error={errors.due_date}
                customClass="translate-x-[150px] translate-y-[-228px]"
            />
        </div>
        <div className="flex flex-row justify-end gap-4 w-full">
            <div className="w-full"></div>
            <div className="flex flex-row gap-[10px]">
                <button className="border border-primary-200 rounded-[5px] flex justify-center items-center text-primary-default 
                font-lato text-xs p-[10px]" onClick={onClose}>Cancel</button>
                <button className="bg-primary-default rounded-[5px] flex justify-center items-center text-white font-lato 
                text-xs p-[10px]" onClick={() => handleCreateProject(formik.values)}>Create</button>
            </div>
        </div>
      </div>
    </div>
  );
}
