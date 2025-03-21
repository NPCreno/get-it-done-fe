import MainLayout from "@/app/components/MainLayout";

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="main flex justify-center ju w-full">
        {/* Main Page */}
        <div className="inside w-[1440px]">
          <div className="flex justify-between">
            {/* Left header */}
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold text-primary-default">
                Projects
              </h1>
              <p className="font-lato text-[13px] text-text">
                Organize your tasks into projects
              </p>
            </div>

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
        </div>
      </div>
    </MainLayout>
  );
}
