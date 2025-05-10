import MainLayout from "@/app/components/MainLayout";
import ProjectCard from "../../components/projectCard";

export default function ProjectsPage() {
  const projectData = [
    {
      projName: "Project 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      due: new Date("2025-01-23"),
      tasks: 5,
    },
    {
      projName: "Project 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      due: new Date("2025-02-23"),
      tasks: 3,
    },
    {
      projName: "Project 3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      due: new Date("2025-03-23"),
      tasks: 7,
    },
    {
      projName: "Project 4",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      due: new Date("2025-04-23"),
      tasks: 2,
    },
    {
      projName: "Project 5",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      due: new Date("2025-05-23"),
      tasks: 4,
    },
  ];
  return (
    <MainLayout>
      <div className="main flex justify-center ju w-full">
        {/* Main Page */}
        <div className="inside flex flex-col gap-5 max-w-[1440px] w-full px-4 md:px-8 lg:px-12 mx-auto">
          <div className="flex justify-between">
            {/* Left header */}
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold text-primary-default fade-in select-none">
                Projects
              </h1>
              <p className="font-lato text-[13px] text-text fade-in-delay select-none">
                Organize your tasks into projects
              </p>
            </div>

            <div className="flex flex-row gap-[10px] items-end">
              <button
                className="px-5 py-[5px] flex flex-row gap-[5px] text-white font-lato bg-primary-default rounded-[10px] 
        hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300"
              >
                <img src="/add-outline-white.png" alt="add task" />
                New Project
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            {projectData.map((project, index) => (
              <ProjectCard
                key={index}
                projName={project.projName}
                description={project.description}
                due={project.due}
                tasks={project.tasks}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
