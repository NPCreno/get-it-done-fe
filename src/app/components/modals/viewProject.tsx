import React from 'react';
import { IProject } from '@/app/interface/IProject';
import { ITask } from '@/app/interface/ITask';
import { useFormState } from '@/app/context/FormProvider';
import Image from 'next/image';
interface ViewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject;
  handleCreateTask: () => void;
  tasks: ITask[];
  handleUpdateTask: () => void;
}

export default function ViewProjectModal({ 
  isOpen, 
  onClose, 
  project, 
  handleCreateTask,
  tasks,
  handleUpdateTask,
}: ViewProjectModalProps) {
 
  if (!isOpen) return null;
  
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
        className="modal-popup bg-white w-[550px] h-auto rounded-[10px] p-5 shadow-lg flex flex-col gap-5 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-text text-[20px] font-bold font-lato">{project.title}</h1>
                <button className="cursor-pointer" onClick={onClose}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 4.50098L4.5 11.501M11.5 11.501L4.5 4.50098L11.5 11.501Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
            </div>
            <h2 className="text-[#676767] text-sm font-lato">{project.description ? project.description : "View and manage tasks in this project"}</h2>
        </div>

        <div className="flex flex-col gap-[10px] max-h-[710px] min-h-[200px] overflow-y-auto scrollbar-hide">
          {tasks.length != 0 ? tasks.map((task) => (
            <TaskCard task={task} handleUpdateTask={handleUpdateTask} />
          )) : (
            <div className="h-full flex items-center justify-center flex-grow">
              <h1 className="text-text text-[20px] font-bold font-lato text-center">No tasks found</h1>
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between w-full  items-center">
              <button className="bg-primary-default rounded-[5px] flex justify-center items-center text-white font-lato 
                text-xs p-[10px]" onClick={handleCreateTask}>
                  <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7501 12.499H5.25012M12.0001 5.74902V19.249V5.74902Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  New Task
              </button>
              
              <button className="border border-primary-200 rounded-[5px] flex justify-center items-center text-primary-default 
              font-lato text-xs p-[10px]" onClick={onClose}>Cancel</button>
                
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: ITask;
  handleUpdateTask: () => void;
}

const TaskCard = ({ task, handleUpdateTask }: TaskCardProps) => {
  const {
    setSelectedTaskData,
  } = useFormState();
  const priorityColor = task.priority === "High" ? "bg-red-500" : task.priority === "Medium" ? "bg-accent-default" : "bg-secondary-default";
  const statusColor = task.status === "Pending" ? "bg-[#219EBC]" : task.status === "Complete" ? "bg-[#53D86A]" : "bg-red-200";
  const statusTextColor = task.status === "Pending" ? "text-[#0B4250]" : task.status === "Complete" ? "text-success-600" : "text-red-700";

  const handleRevertStatus = (task_id: string) => {
    console.log("Revert Status", task_id);
  }

  const handleCompleteTask = (task_id: string) => {
    console.log("Complete Task", task_id);
  }

  return (
    <div className="border border-[#E0E0E0] rounded-[10px] py-2 px-5 flex flex-row cursor-pointer" 
    onClick={() => {
      setSelectedTaskData(task)
      handleUpdateTask()
    }}>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-[10px] items-center">
          <div className={`w-[15px] h-[15px] rounded-full mr-4 ${task.status == "Complete" ? "bg-green-400" : priorityColor}`} 
          ></div>
          <div className="flex flex-col gap-[10px] justify-center items-center">
            <div className="flex flex-row gap-[10px]">
              <h1 className={`text-sm font-bold font-lato ${task.status == "Complete" ? "line-through text-[#828282]" : "text-text"}`}>{task.title}</h1>
              <div className={`${statusColor} flex items-center px-[6px] h-[20px] rounded-full ${statusTextColor} text-[11px] font-lato font-bold ${task.status == "Complete" ? "line-through" : ""}`}>
                {task.status}
              </div>
            </div>
            <h1 className="text-[#828282] text-xs font-bold font-lato">{task.description}</h1>
          </div>
        </div>

        {task.status != "Complete" ?(
          <div className="h-full flex items-center">
            <div className="border-[2px] border-solid rounded-[10px] border-primary-200 w-5 h-5 flex items-center justify-center cursor-pointer">
              <input
                id="checkTask"
                type="checkbox"
                className="appearance-none w-full h-full checked:bg-primary-200 checked:border-white checked:border-solid 
                        border-[2px] rounded-[10px] relative cursor-pointer"
                onClick={() => handleCompleteTask(task.task_id)}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center cursor-pointer" onClick={() => handleRevertStatus(task.task_id)}>
           <Image src="/svgs/refresh-circle-outline.svg" alt="Revert" width={20} height={20} />
          </div>
        )}

      </div>
    </div>
  )
}