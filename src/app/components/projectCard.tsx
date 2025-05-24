import Image from "next/image";

export default function ProjectCard({
  title,
  description,
  due_date,
  tasks,
}: {
  title: string;
  description: string;
  due_date: Date;
  tasks: number;
}) {
  return (
    <div
      className={`p-5 flex flex-col gap-5 justify-start items-start bg-white rounded-[10px] max-w-[316px] w-[316px] h-auto
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left fade-in-left-delay-1`}
    >
      {/*header */}
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-row gap-5">
          <Image src="/svgs/folder-outline.svg" alt="folder-outline" width={30} height={30} />
          <h1 className="text-text text-base font-bold font-lato">
            {title}
          </h1>
        </div>

        <div className="flex flex-row hover:cursor-pointer min-w-[60px]">
          <Image src="/svgs/add-outline-yellow.svg" alt="add-outline-yellow" width={15} height={15} />
          <h1 className="text-primary-default text-[11px] font-bold font-lato">
            Add Task
          </h1>
        </div>
      </div>

      {/* Description */}
      <span className="text-text text-[11px] font-lato w-full">
        {description}
      </span>

      {/* Due and tasks */}
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-row">
          <div className="text-text text-[11px] font-bold font-lato rounded-[5px] bg-background px-[5px] h-5 flex items-center">
          Due {new Date(due_date).toLocaleDateString()}
          </div>
        </div>

        <h1 className="text-text text-[11px] font-bold font-lato">
          {tasks} tasks
        </h1>
      </div>
    </div>
  );
}
