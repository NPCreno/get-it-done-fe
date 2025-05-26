import React from 'react';
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
  dueDate: Date;
  setDueDate: (dueDate: Date) => void;
  priority: string;
  setPriority: (priority: string) => void;
}

export default function AddProjectModal({ isOpen, onClose, projectTitle, setProjectTitle, projectDescription, setProjectDescription, dueDate, setDueDate, priority, setPriority }: AddProjectModalProps) {
  if (!isOpen) return null;

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
            value={projectTitle} 
            onChange={(e) => setProjectTitle(e.target.value)} 
            isLabelVisible={true}
        />

        <InputBox 
            type="textarea"
            label="Description" 
            placeholder="Enter description (optional)" 
            value={projectDescription} 
            onChange={(e) => setProjectDescription(e.target.value)} 
            isLabelVisible={true}
        />
        
        <div className="flex flex-row gap-5">
            <InputBox 
                type="date"
                label="Due Date" 
                value={dueDate.toISOString()} 
                onChange={(e) => setDueDate(new Date(e.target.value))} 
                isLabelVisible={true}
                placeholder="Select due date"
            />
            <InputBox 
                type="dropdown"
                label="Priority" 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                isLabelVisible={true}
                placeholder="Select priority"
                dropdownptions={[ "Low", "Medium", "High"]}
            />
        </div>

        <div className="flex flex-row justify-end gap-4 w-full">
            <div className="w-full"></div>
            <div className="flex flex-row gap-[10px]">
                <button className="border border-primary-200 rounded-[5px] flex justify-center items-center text-primary-default font-lato text-xs p-[10px]">Cancel</button>
                <button className="bg-primary-default rounded-[5px] flex justify-center items-center text-white font-lato text-xs p-[10px]">Create</button>
            </div>
        </div>
      </div>
    </div>
  );
}
