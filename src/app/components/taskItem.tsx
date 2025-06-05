import { useFormState } from "../context/FormProvider";
import { ITask } from "../interface/ITask";

export default function TaskItem({
  task,
  handleUpdateTask,
}: {
  task: ITask;
  handleUpdateTask: () => void;
}) {

  const { setSelectedTaskData } = useFormState();
  return (
    <div className="flex flex-row w-full h-[42px] px-5 py-[11px] justify-between rounded-[10px] hover:bg-[#FAFAFA] cursor-pointer" 
    onClick={() => {
      setSelectedTaskData(task);
      handleUpdateTask()
    }}>
      <div className="flex flex-row gap-5 items-center">
        <div className="border-[2px] border-solid rounded-[10px] border-primary-200 w-5 h-5 flex items-center justify-center cursor-pointer">
          <input
            id="checkTask"
            type="checkbox"
            className="appearance-none w-full h-full checked:bg-primary-200 checked:border-white checked:border-solid 
                    border-[2px] rounded-[10px] relative cursor-pointer"
          />
        </div>
        <span className="font-lato text-[13px] text-text font-bold">
          {task.title}  
        </span>
      </div>
      <div className="flex flex-row gap-5 items-center">
        <div className={`flex ${task.project_title !="" ? "bg-[#D4D4D4]" : ""} font-lato text-[13px] text-text font-bold rounded-[10px] px-2 h-[25px] items-center justify-center`}>
          {task.project_title}
        </div>
        <div
          className={`rounded-[10px] w-[10px] h-[10px] ${
            task.status === "Complete" ? "bg-green-600" : "bg-warn"
          }`}
        ></div>
      </div>
    </div>
  );
}
