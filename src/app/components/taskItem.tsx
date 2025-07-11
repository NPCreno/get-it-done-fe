import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { updateTaskStatus } from "../api/taskRequests";
import { useFormState } from "../context/FormProvider";
import { ITask } from "../interface/ITask";

interface TaskItemProps {
  task: ITask;
  handleUpdateTask: () => void;
  taskUpdateStatus?: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export function TaskItem({ 
  task, 
  handleUpdateTask, 
  taskUpdateStatus 
}: TaskItemProps) {
  const { setSelectedTaskData } = useFormState();
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const updateInProgress = useRef<boolean>(false);
  
  const currentStatus = optimisticStatus || task.status;
  const isComplete = currentStatus === "Complete";
  const isCurrentlyUpdating = isUpdating || updateInProgress.current;

  const handleCheckToggle = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    
    if (isCurrentlyUpdating) {
      console.log('Update already in progress, ignoring click');
      return;
    }

    try {
      // Set updating state optimistically
      updateInProgress.current = true;
      setIsUpdating(true);
      
      const newStatus = task.status === "Complete" ? "Pending" : "Complete";
      const statusText = newStatus === "Complete" ? "completed" : "marked as pending";
      
      // Play sound effect
      const audio = new Audio('/soundfx/3.mp3');
      audio.play().catch(error => console.warn('Audio playback failed:', error));
      
      // Show updating message
      taskUpdateStatus?.("Updating task status...", 'info');
      
      // Optimistic UI update
      setOptimisticStatus(newStatus);
      
      // Make API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await Promise.race([
          updateTaskStatus(task.task_id, newStatus),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out. Please try again.')), 10000)
          )
        ]) as { status: string; message?: string };
        
        if (response.status !== "success") {
          throw new Error(response.message || 'Failed to update task status');
        }
        
        // Show success message
        taskUpdateStatus?.(`Task ${statusText} successfully!`, 'success');
        
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticStatus(null);
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
      
    } catch (error) {
      console.error("Error updating task status:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      taskUpdateStatus?.(errorMessage, 'error');
    } finally {
      // Always clean up the updating state
      updateInProgress.current = false;
      setIsUpdating(false);
    }
  }, [task.status, task.task_id, taskUpdateStatus, isCurrentlyUpdating]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      updateInProgress.current = false;
    };
  }, []);

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
            onChange={handleCheckToggle}
            onClick={e => e.stopPropagation()}
            checked={isComplete}
            disabled={isCurrentlyUpdating}
            aria-label={isComplete ? 'Mark task as pending' : 'Mark task as complete'}
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