import React, { useEffect } from 'react';
import Image from 'next/image';
import InputBox from '../inputBox';
import { CustomDropdownMenu } from '../dropdown';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  setProjectTitle: (projectTitle: string) => void;
  projectDescription: string;
  setProjectDescription: (projectDescription: string) => void;
  dueDate: Date | null;
  setDueDate: (dueDate: Date) => void;
  color: string;
  setColor: (color: string) => void;
  colorLabel: string;
  setColorLabel: (colorLabel: string) => void;
  errors: any;
  handleCreateProject: () => void;
}

export default function AddProjectModal({ 
  isOpen, 
  onClose, 
  projectTitle, 
  setProjectTitle, 
  projectDescription, 
  setProjectDescription, 
  dueDate, 
  setDueDate, 
  color, 
  setColor, 
  colorLabel, 
  setColorLabel,
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
            value={{name: projectTitle}} 
            onChange={(e) => setProjectTitle(e.target.value)} 
            isLabelVisible={true}
            error={errors.title}
        />

        <InputBox 
            type="textarea"
            label="Description" 
            placeholder="Enter description (optional)" 
            value={{name: projectDescription}} 
            onChange={(e) => setProjectDescription(e.target.value)} 
            isLabelVisible={true}
            error={errors.description}
        />
        
        <div className="flex flex-row gap-5">
            <InputBox 
                type="dropdown"
                label="Color" 
                value={{name: colorLabel, color: color}} 
                onChange={(e) => {
                  setColor(e.target.value);
                  setColorLabel(e.target.name);
                }} 
                isLabelVisible={true}
                placeholder="Select color"
                dropdownptions={dropdownOptions}
                error={errors.color}
            />
            <InputBox 
                type="date"
                label="Due Date" 
                value={{ name: dueDate ? dueDate.toISOString() : "" }} 
                onChange={(e) => setDueDate(new Date(e.target.value))} 
                isLabelVisible={true}
                placeholder="Select due date"
                error={errors.due_date}
            />
        </div>
        <div className="flex flex-row justify-end gap-4 w-full">
            <div className="w-full"></div>
            <div className="flex flex-row gap-[10px]">
                <button className="border border-primary-200 rounded-[5px] flex justify-center items-center text-primary-default 
                font-lato text-xs p-[10px]" onClick={onClose}>Cancel</button>
                <button className="bg-primary-default rounded-[5px] flex justify-center items-center text-white font-lato 
                text-xs p-[10px]" onClick={handleCreateProject}>Create</button>
            </div>
        </div>
      </div>
    </div>
  );
}
