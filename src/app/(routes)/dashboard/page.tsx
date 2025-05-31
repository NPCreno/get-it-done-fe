"use client";
import MainLayout from "@/app/components/MainLayout";
import ChartCard from "../../components/chartCard";
import StatsCard from "../../components/statsCard";
import TaskItem from "../../components/taskItem";
import Image from "next/image";
import AddTaskModal from "@/app/components/modals/addTaskModal";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "@/app/context/FormProvider";
import { FormikErrors, useFormik } from "formik";
import { createTaskSchema } from "@/app/schemas/createTaskSchema";
import { getProjectsForUser, getUser } from "@/app/api/api";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";

interface taskFormValues {
  user_id: string;
  project_id: string;
  project_title: string;
  project_color: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date?: Date;
  isRecurring: boolean;
  repeat_every: string;
  repeat_days: string[];
  start_date: Date;
  end_date: Date | null;
}

export default function DashboardPage() {
  const { user, setUser } = useFormState();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "", className: "" });
  const [isExitingToast, setIsExitingToast] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);


  const initialValues = useMemo(() => ({
    title: "",
    description: "",
    due_date: null,
    user_id: user?.user_id ?? "",
    project_id: "",
    project_title: "",
    project_color: "",
    priority: "",
    status: "",
    isRecurring: false,
    repeat_every: "",
    repeat_days: [],
    start_date: new Date(),
    end_date: null,
  }), [user?.user_id]);

  const {
    validateForm,
    setFieldValue,
    values,
    setErrors,
    errors,
    handleSubmit,
    handleChange,
    setSubmitting,
    handleBlur,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createTaskSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (!user) return;
      const withUser = {
        ...values,
        user_id: user.user_id,
        due_date: values.due_date || undefined
      };
      handleSubmitForm(withUser);
    },
  });

  const handleSubmitForm = async (values: taskFormValues) => {
    console.log("values: ", values);
    const validationErrors: FormikErrors<typeof values> = await validateForm();

    if (Object.keys(validationErrors).length === 0) {
      await createTask(values)
    }
    setSubmitting(false);
  };


  const createTask = async (values: taskFormValues) => {
    try {
      if(!user){
        console.error("No User data found");
        return
      }
      // const response: any = await createTaskApi(values);
      // if (response.status === "success") {
      //   setIsTaskModalOpen(false);
      //   setToastMessage({
      //     title: "Task Created",
      //     description: "Your new task has been created successfully",
      //     className: "text-green-600",
      //   });
      
      //   setShowToast(true);
      //   setIsExitingToast(false);
      
      //   setTimeout(() => {
      //     setIsExitingToast(true); // Start exit animation
      //     setTimeout(() => {
      //       setShowToast(false); // Remove after animation completes
      //     }, 400); // Must match the toastOut animation duration
      //   }, 10000); // Toast display duration
      // }
    } catch (error) {
      if (error instanceof Error) {
        setToastMessage({
          title: "Something Went Wrong",
          description: error.message,
          className: "text-error-default",
        });
      } else {
        setToastMessage({
          title: "Something Went Wrong",
          description: "An unknown error occurred",
          className: "text-error-default",
        });
      }
      setShowToast(true);
      setIsExitingToast(false);
      setTimeout(() => {
        setIsExitingToast(true); // Start exit animation
        setTimeout(() => {
          setShowToast(false); // Remove after animation completes
        }, 400); // Must match the toastOut animation duration
      }, 10000); // Toast display duration
    }
  };
  
  const tasks = [
    { task: "Finish FE-002", tag: "Design", status: "good" },
    { task: "Review FE-003", tag: "Review", status: "pending" },
    { task: "Start FE-004", tag: "Development", status: "good" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) { // If no user, try getting one from cookies
          const token = getAccessTokenFromCookies();
          if (!token) {
            console.error("No access_token found in cookies");
            return;
          }
          const parsedUser = parseJwt(token).user;
          if (!parsedUser || !parsedUser.user_id) {
            console.error("Failed to parse user or missing user_id in token");
            return;
          }
          setUser(parsedUser);
          return;
        }
        // Only fetch updated user info if we have a user
        const response = await getUser(user.user_id);
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [isAddTaskModalOpen]);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        const projects = await getProjectsForUser(user.user_id);
        if (projects?.message && projects.message.includes("No projects found")) {
          setProjectOptions([]);
        }else{
          setProjectOptions(projects);
        }
      };
      fetchProjects();
    }
  }, [user, isAddTaskModalOpen]);

  return (
    <MainLayout>
      <div className="main flex justify-center w-full gap-5  h-full">
        {/* Main Page */}
        <div className="inside max-w-[1440px] w-full mx-auto gap-5 flex flex-col">
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
                <Image
                  src="/svgs/timer.svg"
                  className="ml-[10px]"
                  alt="pomodoro timer"
                  width={20}
                  height={20}
                />
              </button>

              <button
                className="flex h-[35px] w-[35px] bg-white rounded-[10px] hover:shadow-[0px_2px_10.9px_0px_rgba(0,_0,_0,_0.25)] 
              transition-all duration-300 justify-center items-center"
              >
                <Image src="/svgs/search-grey.svg" alt="search" width={15} height={15}/>
              </button>
            </div>
          </div>

          {/* first row cards */}
          <div className="flex flex-row gap-5 h-[100px] w-full fade-in-delay-2">
            <StatsCard
              icon="/svgs/list-outline.svg"
              header="All Tasks"
              content="300"
              delay="fade-in-left-delay-1"
            />
            <StatsCard
              icon="/svgs/timer-outline.svg"
              header="In Progress"
              content="15"
              delay="fade-in-left-delay-2"
            />
            <StatsCard
              icon="/svgs/folder-open-outline.svg"
              header="All Projects"
              content="3"
              delay="fade-in-left-delay-3"
            />
            <StatsCard
              icon="/svgs/checkbox-outline.svg"
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
                onClick={() => setIsAddTaskModalOpen(true)}
              >
                <Image 
                src="/svgs/add-outline-white.svg" 
                alt="add task" 
                width={25} 
                height={25}
                className="mt-[2px]"
                />
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

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        formik={{ values, errors, handleChange, setFieldValue }}
        handleCreateTask={handleSubmitForm}
        project={projectOptions}
      />

    </MainLayout>
  );
}
