
export default function ProjectCard({
  title,
  description,
  due_date,
  tasks,
  onClick,
}: {
  title: string;
  description: string;
  due_date: Date;
  tasks: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-5 flex flex-col gap-5 justify-start items-start bg-white rounded-[10px] max-w-[316px] w-[316px] h-auto
      hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left fade-in-left-delay-1 cursor-pointer`}
    >
      {/*header */}
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-row gap-5">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.8649 11.2722H27.9734M25.6423 25.2589H4.19601C3.57776 25.2589 2.98484 25.0133 2.54767 24.5762C2.1105 24.139 1.8649 23.5461 1.8649 22.9278V7.07623C1.8649 6.45798 2.1105 5.86505 2.54767 5.42789C2.98484 4.99072 3.57776 4.74512 4.19601 4.74512H8.61872C9.07899 4.74513 9.52896 4.8814 9.91191 5.13674L11.5344 6.21838C11.9173 6.47373 12.3673 6.61 12.8275 6.61001H25.6423C26.2605 6.61001 26.8534 6.85561 27.2906 7.29278C27.7278 7.72995 27.9734 8.32287 27.9734 8.94112V22.9278C27.9734 23.5461 27.7278 24.139 27.2906 24.5762C26.8534 25.0133 26.2605 25.2589 25.6423 25.2589Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <h1 className="text-text text-base font-bold font-lato">
            {title}
          </h1>
        </div>

        <div className="flex flex-row hover:cursor-pointer min-w-[60px]">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7188 7.49951H3.28134M7.50009 3.28076V11.7183V3.28076Z" stroke="#FEAD03" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
          <div className={`text-text text-[11px] font-bold font-lato rounded-[5px] ${due_date ? "bg-background" : ""} px-[5px] h-5 flex items-center`}>
          {due_date ? "Due " + new Date(due_date).toLocaleDateString() : ""}
          </div>
        </div>

        <h1 className="text-text text-[11px] font-bold font-lato">
          {tasks} tasks
        </h1>
      </div>
    </div>
  );
}
