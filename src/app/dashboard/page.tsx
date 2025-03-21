import MainLayout from "@/app/components/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="main flex justify-center w-full gap-5">
        {/* Main Page */}
        <div className="inside max-w-[1440px] w-full px-4 md:px-8 lg:px-12 mx-auto gap-5 flex flex-col">
          {/* Header */}
          <div className="flex justify-between">
            {/* Left header */}
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold text-primary-default fade-in select-none">
                Dashboard
              </h1>
              <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                Track your tasks and monitor your progress
              </p>
            </div>
            {/* Right header */}
            <div className="flex flex-row gap-[10px] items-end">
              <button
                className="text-text text-[13px] px-5 bg-white rounded-[10px] h-[35px] flex flex-row items-center 
              hover:shadow-[0px_2px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300"
              >
                Start Pomodoro
                <img
                  src="/pomodoro-timer.png"
                  className="max-h-5 max-w-5 ml-[10px]"
                />
              </button>

              <button
                className="flex h-[35px] w-[35px] bg-white rounded-[10px] hover:shadow-[0px_2px_10.9px_0px_rgba(0,_0,_0,_0.25)] 
              transition-all duration-300 justify-center items-center"
              >
                <img src="/search-grey.png" />
              </button>
            </div>
          </div>

          {/* first row cards */}
          <div className="flex flex-row gap-5 h-[100px] w-full fade-in-delay-2">
            <FirstRowCard
              icon="/list-outline.png"
              header="All Tasks"
              content="300"
              delay="fade-in-left-delay-1"
            />
            <FirstRowCard
              icon="/timer-outline.png"
              header="In Progress"
              content="15"
              delay="fade-in-left-delay-2"
            />
            <FirstRowCard
              icon="/folder-open-outline.png"
              header="All Projects"
              content="3"
              delay="fade-in-left-delay-3"
            />
            <FirstRowCard
              icon="/checkbox-outline.png"
              header="Completed"
              content="300"
              delay="fade-in-left-delay-4"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function FirstRowCard({
  icon,
  header,
  content,
  delay,
}: {
  icon: string;
  header: string;
  content: string;
  delay: string;
}) {
  return (
    <div
      className={`px-6 flex flex-row justify-start items-center gap-8 bg-white rounded-[10px] w-full 
    hover:shadow-[0px_2px_5.1px_-1px_rgba(0,0,0,0.25)] transition-all duration-300 fade-in-left ${delay}`}
    >
      <img src={icon} alt={header} />
      <div className="flex flex-col justify-start">
        <span className="text-[#838383] text-base font-bold font-lato">
          {header}
        </span>
        <span className="text-text text-[28px] font-lato">{content}</span>
      </div>
    </div>
  );
}
