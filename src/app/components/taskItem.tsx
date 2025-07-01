import { updateTaskStatus } from "../api/taskRequests";
import { useFormState } from "../context/FormProvider";
import { ITask } from "../interface/ITask";
import Image from "next/image";

export function TaskItem({
    task,
    handleUpdateTask,
    taskUpdateStatus,
  }: {
    task: ITask;
    handleUpdateTask: () => void;
    taskUpdateStatus?: (message: string, status: string) => void;
  }) {
    const { setSelectedTaskData } = useFormState();
    const handleCheckToggle = async () => {
      const audio = new Audio('/soundfx/3.mp3'); // path to your mp3 file
      audio.play();
      try {
        const response = await updateTaskStatus(task.task_id, task.status === "Complete" ? "Pending" : "Complete");
        if (response.status === "success") {
          taskUpdateStatus?.(response.message, task.status === "Complete" ? "Pending" : "Complete");
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    };
  
    return (
      <div className="flex flex-row w-full h-[42px] items-center justify-between rounded-[10px] hover:bg-[#FAFAFA] cursor-pointer gap-5 pr-5 pl-5">
        <div className="flex flex-row gap-5 items-center">
          <div className="group w-6 h-6 relative">
            <input
              id="checkTask"
              type="checkbox"
              checked={task.status === "Complete"}
              readOnly
              onClick={handleCheckToggle}
              className="peer appearance-none w-full h-full cursor-pointer"
            />
            <div
              className="absolute inset-0 rounded-full border-[2px] border-solid border-gray-300
                        peer-checked:border-0 group-hover:border-0 pointer-events-none"
            ></div>
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 
                            group-hover:opacity-100 peer-checked:opacity-100 pointer-events-none"
            >
              <Image
                src="/svgs/checkmark-circle-green.svg"
                alt="Check"
                width={26}
                height={26}
              />
            </div>
          </div>
        </div>
        <div
          className="flex flex-row gap-5 items-center flex-grow w-full justify-end"
          onClick={() => {
            setSelectedTaskData(task);
            handleUpdateTask();
          }}
        >
          <div className="flex flex-row justify-between w-full">
            <span
              className={`font-lato text-4 text-text ${
                task.status === "Complete" ? "line-through" : ""
              }`}
            >
              {task.title}
            </span>
            <div className="flex flex-row gap-2 items-center">
              <div
                className={`flex ${
                  task.project_title != null ? "bg-[#D4D4D4]" : "bg-[#ffffff]"
                } font-lato text-[13px] text-text font-bold rounded-[10px] px-2 h-[25px] items-center justify-center`}
              >
                {task.project_title}
              </div>
              <div
                className={`rounded-[10px] w-[10px] h-[10px] ${
                  task.status === "Complete" ? "bg-green-600" : "bg-[#FFC107]"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }