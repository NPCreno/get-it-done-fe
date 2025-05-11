import MainLayout from "@/app/components/MainLayout";
import ChartCard from "../../components/chartCard";
import StatsCard from "../../components/statsCard";
import TaskItem from "../../components/taskItem";
export default function DashboardPage() {
  const tasks = [
    { task: "Finish FE-002", tag: "Design", status: "good" },
    { task: "Review FE-003", tag: "Review", status: "pending" },
    { task: "Start FE-004", tag: "Development", status: "good" },
  ];
  return (
    <MainLayout>
      <div className="main flex justify-center w-full gap-5  h-full">
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
            <StatsCard
              icon="/list-outline.png"
              header="All Tasks"
              content="300"
              delay="fade-in-left-delay-1"
            />
            <StatsCard
              icon="/timer-outline.png"
              header="In Progress"
              content="15"
              delay="fade-in-left-delay-2"
            />
            <StatsCard
              icon="/folder-open-outline.png"
              header="All Projects"
              content="3"
              delay="fade-in-left-delay-3"
            />
            <StatsCard
              icon="/checkbox-outline.png"
              header="Completed"
              content="300"
              delay="fade-in-left-delay-4"
            />
          </div>

          {/* Chart cards */}
          <div className="flex flex-row gap-5 h-[210px] w-full fade-in-delay-2">
            <ChartCard
              header="Task Completion Trend"
              delay="fade-in-left-delay-1"
            />
            <ChartCard
              header="Most Productive Hours"
              delay="fade-in-left-delay-2"
            />
            <ChartCard header="Daily Progress" delay="fade-in-left-delay-3" />
            <ChartCard
              header="Productivity Streak"
              delay="fade-in-left-delay-4"
            />
          </div>

          <div className="w-full p-5 flex flex-col bg-white rounded-[10px] fade-in-delay-2 flex-grow">
            {/* Header - Fixed */}
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-lato font-bold text-primary-default">
                Recent Tasks
              </h1>
              <button
                className="px-5 py-[5px] flex flex-row gap-[5px] text-white font-lato bg-primary-default rounded-[10px] 
        hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300"
              >
                <img src="/add-outline-white.png" alt="add task" />
                New Task
              </button>
            </div>

            {/* Scrollable Task List */}
            <div className="flex flex-col gap-[10px] mt-5 overflow-y-auto flex-grow basis-0">
              {/* Task Item */}
              {tasks.map((task, index) => (
                <TaskItem
                  key={index}
                  task={task.task}
                  tag={task.tag}
                  status={task.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
