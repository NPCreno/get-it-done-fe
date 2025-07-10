import { updateTaskStatus } from "../api/taskRequests";
import { useFormState } from "../context/FormProvider";
import { ITask } from "../interface/ITask";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TaskItemProps {
  task: ITask;
  handleUpdateTask: () => void;
  taskUpdateStatus?: (message: string, status: string) => void;
}

export function TaskItem({ 
  task, 
  handleUpdateTask, 
  taskUpdateStatus 
}: TaskItemProps) {
  const { setSelectedTaskData } = useFormState();
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isUpdatingRef = useRef(false);
  
  const handleCheckToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent multiple clicks while updating
    if (isUpdatingRef.current) {
      console.log("Update in progress, ignoring click");
      return;
    }
    
    try {
      // Set updating state immediately
      isUpdatingRef.current = true;
      setIsUpdating(true);
      console.log("Starting task update...");
      
      const audio = new Audio('/soundfx/3.mp3');
      audio.play();
      
      const newStatus = task.status === "Complete" ? "Pending" : "Complete";
      
      // Update UI optimistically
      setOptimisticStatus(newStatus);
      taskUpdateStatus?.(`Updating task status to ${newStatus}...`, newStatus);
      
      // Make the API call
      const response = await updateTaskStatus(task.task_id, newStatus);
      
      if (response.status !== "success") {
        throw new Error(response.message || 'Failed to update task status');
      }
      
      console.log("Task update successful");
      // Parent component will handle the success state
      
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert optimistic update on error
      setOptimisticStatus(null);
      taskUpdateStatus?.(error instanceof Error ? error.message : 'Failed to update task status', task.status);
    } finally {
      // Always set updating to false when done
      isUpdatingRef.current = false;
      setIsUpdating(false);
      console.log("Update completed, isUpdating set to false");
    }
  };

  const currentStatus = optimisticStatus || task.status;
  const isComplete = currentStatus === "Complete";

  // Debug effect for tracking isUpdating state changes
  useEffect(() => {
    console.log("isUpdating state changed to:", isUpdating);
  }, [isUpdating]);

  return (
    <div 
      className={`flex flex-row w-full h-[42px] items-center justify-between rounded-[10px] hover:bg-[#FAFAFA] cursor-pointer gap-5 pr-5 pl-5 ${isUpdating ? 'opacity-70' : ''}`}
      onClick={() => {
        setSelectedTaskData(task);
        handleUpdateTask();
      }}
    >
      <div className="flex flex-row gap-5 items-center">
        <div 
          className="group w-6 h-6 relative"
          
        >
          <input
            id={`checkTask-${task.task_id}`}
            type="checkbox"
            onClick={handleCheckToggle}
            checked={isComplete}
            disabled={isUpdating}
            readOnly
            className="peer appearance-none w-full h-full cursor-pointer"
          />
          <div className="absolute inset-0 rounded-full border-[2px] border-solid border-gray-300 peer-checked:border-0 group-hover:border-0 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 peer-checked:opacity-100 pointer-events-none">
            <Image
              src="/svgs/checkmark-circle-green.svg"
              alt="Check"
              width={26}
              height={26}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-row gap-5 items-center flex-grow w-full justify-end">
        <div className="flex flex-row justify-between w-full">
          <span className={`font-lato text-4 text-text ${isComplete ? 'line-through' : ''}`}>
            {task.title}
          </span>
          <div className="flex flex-row gap-2 items-center">
            {task.project_title && (
              <div className="bg-[#D4D4D4] font-lato text-[13px] text-text font-bold rounded-[10px] px-2 h-[25px] flex items-center justify-center">
                {task.project_title}
              </div>
            )}
            <div 
              className={`rounded-[10px] w-[10px] h-[10px] ${isComplete ? 'bg-green-600' : 'bg-[#FFC087]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}