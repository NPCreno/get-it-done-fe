"use client";
import MainLayout from "@/app/components/MainLayout";
import ChartCard from "../../components/chartCard";
import StatsCard from "../../components/statsCard";
import TaskModal from "@/app/components/modals/taskModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState } from "@/app/context/FormProvider";
import { FormikErrors, useFormik } from "formik";
import { createTaskSchema } from "@/app/schemas/createTaskSchema";
import {
  createTaskApi,
  getProjectsForUser,
  getUser,
  getTasksByUser,
  updateTaskApi,
  getDashboardData,
} from "@/app/api/api";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";
import { IProject } from "@/app/interface/IProject";
import { CreateTaskDto } from "@/app/interface/dto/create-task-dto";
import { Toast } from "@/app/components/toast";
import { ITask } from "@/app/interface/ITask";
import { UpdateTaskDto } from "@/app/interface/dto/update-task-dto";
import Image from "next/image";
import { ITaskResponse } from "@/app/interface/responses/ITaskResponse";
import { IUser } from "@/app/interface/IUser";
import LoadingPage from "@/app/components/loader";
import { IDashboardData } from "@/app/interface/IDashboardData";

interface taskFormValues {
  user_id: string;
  project_id?: string | null;
  project_title: string;
  project_color: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date?: Date | null;
  isRecurring: boolean;
  repeat_every: string;
  repeat_days: string[];
  start_date: Date | null;
  end_date: Date | null;
  project: string;
  task_id?: string;
}
interface FormErrors {
  title?: string;
  description?: string;
  priority?: string;
  project?: string;
  project_id?: string;
  project_title?: string;
  project_color?: string;
  status?: string;
  due_date?: string;
  isRecurring?: string;
  repeat_every?: string;
  repeat_days?: string[] | string;
  start_date?: string;
  end_date?: string;
  user_id?: string;
}

export default function DashboardPage() {
  const { selectedTaskData } = useFormState();
  const [user, setUser] = useState<IUser | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<IProject[]>([]);
  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    className: "",
  });
  const [isExitingToast, setIsExitingToast] = useState(false);
  const [isDoneFetchingUser, setIsDoneFetchingUser] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [dashboardData, setDashboardData] = useState<IDashboardData | undefined>();
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [updateTaskDashboard, setUpdateTaskDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setIsPageLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const isFirstLoad = useRef(true);
  const handleToastClose = () => {
    setIsExitingToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 400);
  };

  const initialValues = useMemo(
    () => ({
      title: "",
      description: "",
      due_date: null,
      user_id: user?.user_id ?? "",
      project_id: "",
      project_title: "",
      project_color: "",
      priority: "Low",
      status: "Pending",
      isRecurring: false,
      repeat_every: "",
      repeat_days: [],
      start_date: null,
      end_date: null,
      project: "",
    }),
    [user?.user_id]
  );

  const {
    validateForm,
    setFieldValue,
    setFieldError,
    values,
    errors,
    handleSubmit,
    handleChange,
    setSubmitting,
    setErrors,
    resetForm,
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
        due_date: values.due_date || undefined,
      };
      handleSubmitForm(withUser);
    },
  });

  const handleSubmitForm = async (values: taskFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();
    console.log("validationErrors: ", validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      await createTask(values);
    }
    setSubmitting(false);
  };

  const createTask = async (values: taskFormValues) => {
    try {
      setIsLoading(true);
      if (!user) {
        console.error("No User data found");
        return;
      }
      const payload: CreateTaskDto = {
        title: values.title,
        description: values.description,
        due_date: values.due_date || undefined,
        user_id: user.user_id,
        project_id: values.project_id || undefined,
        priority: values.priority || undefined,
        isRecurring: values.isRecurring || false,
        repeat_every: values.repeat_every || undefined,
        repeat_days: values.repeat_days || undefined,
        start_date: values.start_date || undefined,
        end_date: values.end_date || undefined,
        status: values.status || undefined,
      };
      const response: ITaskResponse = await createTaskApi(payload);
      if (response.status === "success") {
        setIsLoading(false);
        setUpdateTaskDashboard(!updateTaskDashboard);
        setIsTaskModalOpen(false);
        setToastMessage({
          title: "Task Created",
          description:
            response.message || "Your new task has been created successfully",
          className: "text-green-600",
        });

        setShowToast(true);
        setIsExitingToast(false);

        setTimeout(() => {
          setIsExitingToast(true); // Start exit animation
          setTimeout(() => {
            setShowToast(false); // Remove after animation completes
          }, 400); // Must match the toastOut animation duration
        }, 10000); // Toast display duration
      }
    } catch (error) {
      setIsLoading(false);
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
  useEffect(() => {
    const fetchUser = async () => {
      if (isDoneFetchingUser) return;
      else {
        try {
          if (!user) {
            // If no user, try getting one from cookies
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
            setIsDoneFetchingUser(true);
            setUser(parsedUser);
            return;
          }
          // Only fetch updated user info if we have a user
          const response = await getUser(user.user_id);
          if (response) {
            setIsDoneFetchingUser(true);
            setUser(response);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };
    fetchUser();
  }, [user, setUser, isDoneFetchingUser]);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        const projects = await getProjectsForUser(user.user_id);
        if (projects?.status === "success") {
          setProjectOptions(projects.data);
          return;
        } else {
          setProjectOptions([]);
        }
      };
      fetchProjects();
    }
  }, [user, isTaskModalOpen]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
  
      // Only show loading spinner for first load
      if (isFirstLoad.current) {
        setIsPageLoading(true);
      }
  
      const startDate = new Date().toISOString();
      const endDate = new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString();
  
      const fetchedTasks = await getTasksByUser(user.user_id, startDate, endDate);
      const fetchedDashboardData = await getDashboardData(user.user_id, startDate, endDate);
      debugger
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      } else {
        setTasks([]); // or keep previous state?
      }

      if(fetchedDashboardData.status === "success"){
        setDashboardData(fetchedDashboardData.data)
      }else{
        setDashboardData(undefined)
      }

      if (isFirstLoad.current) {
        setIsPageLoading(false);
        isFirstLoad.current = false;
      }
    };
  
    fetchTasks();
  }, [user, updateTaskDashboard, showToast]);

  useEffect(() => {
  if (isTaskModalOpen && !isUpdateTask) {
    resetForm({
      values: {
        ...initialValues,
        status: "Pending",
      },
    });
  }
}, [isTaskModalOpen, isUpdateTask, initialValues, resetForm]);

  const handleUpdateTask = async (values: taskFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      await updateTask(values);
    }
    setSubmitting(false);
  };

  const updateTask = async (values: taskFormValues) => {
    try {
      setIsLoading(true);
      if (!user) {
        console.error("No User data found");
        return;
      }
      const payload: UpdateTaskDto = {
        title: values.title,
        description: values.description,
        due_date: values.due_date || undefined,
        priority: values.priority || undefined,
        status: values.status || undefined,
        task_id: selectedTaskData ? selectedTaskData.task_id : values.task_id,
      };
      const response: ITaskResponse = await updateTaskApi(payload);
      if (response.status === "success") {
        setIsLoading(false);
        setUpdateTaskDashboard(!updateTaskDashboard);
        clearValueAndErrors();
        setIsTaskModalOpen(false);
        setToastMessage({
          title: "Task Updated",
          description:
            response.message || "Your task has been updated successfully",
          className: "text-green-600",
        });

        setShowToast(true);
        setIsExitingToast(false);

        setTimeout(() => {
          setIsExitingToast(true); // Start exit animation
          setTimeout(() => {
            setShowToast(false); // Remove after animation completes
          }, 400); // Must match the toastOut animation duration
        }, 10000); // Toast display duration
      } else {
        setIsLoading(false);
        clearValueAndErrors();
        setIsTaskModalOpen(false);
        setToastMessage({
          title: response.message,
          description: response?.error || "Something Went Wrong",
          className: "text-error-default",
        });

        setShowToast(true);
        setIsExitingToast(false);

        setTimeout(() => {
          setIsExitingToast(true); // Start exit animation
          setTimeout(() => {
            setShowToast(false); // Remove after animation completes
          }, 400); // Must match the toastOut animation duration
        }, 10000); // Toast display duration
      }
    } catch (error) {
      setIsLoading(false);
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

  const clearValueAndErrors = () => {
    setErrors({});
    setFieldValue("title", "");
    setFieldValue("description", "");
    setFieldValue("status", "");
    setFieldValue("priority", "");
    setFieldValue("due_date", "");
  };

  useEffect(() => {
    if (selectedTaskData) {
      setFieldValue("title", selectedTaskData?.title || "");
      setFieldValue("description", selectedTaskData?.description || "");
      setFieldValue("priority", selectedTaskData?.priority || "");
      setFieldValue("status", selectedTaskData?.status || "");
      setFieldValue("due_date", selectedTaskData?.due_date || null);
      setFieldValue("isRecurring", false);
    } else {
      return;
    }
  }, [selectedTaskData, setFieldValue]);

  const handleTaskStatus = async (task: ITask) => {
    await updateTask({
      ...task,
      user_id: user?.user_id || "",
      project_color: "",
      isRecurring: false,
      repeat_every: "",
      repeat_days: [],
      start_date: null,
      end_date: null,
      project: task.project_id,
      project_title: task.project_title || "",
    });
  };

  const clearAllData = () => {
    setFieldValue("title", "");
    setFieldValue("description", "");
    setFieldValue("priority", "");
    setFieldValue("project", "");
    setFieldValue("status", "");
    setFieldValue("due_date", null);
    setFieldValue("isRecurring", false);
    setFieldValue("repeat_every", "");
    setFieldValue("repeat_days", []);
    setFieldValue("start_date", null);
    setFieldValue("end_date", null);
    setFieldError("title", "");
    setFieldError("description", "");
    setFieldError("priority", "");
    setFieldError("project", "");
    setFieldError("status", "");
    setFieldError("due_date", "");
  };

  useEffect(() => {
    if (!pageLoading) {
      setTimeout(() => setShowLoader(false), 500); // Match transition duration
    }
  }, [pageLoading]);

  return (
    <MainLayout>
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 z-50 ${
            isExitingToast ? "toast-exit" : "toast-enter"
          }`}
        >
          <Toast {...toastMessage} onClose={handleToastClose} />
        </div>
      )}
      <div className="main flex justify-center w-full gap-5  h-full">
        {/* Main Page */}
        <div className="inside max-w-[1440px] w-full mx-auto gap-5 flex flex-col">

        {showLoader && (
          <div className={`transition-opacity duration-500 ${!pageLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <LoadingPage />
          </div>
        )}

        {(tasks.length !=0 && !pageLoading) &&(
         <>
         
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.6156 7.49915C4.79638 9.53097 3.77785 12.1549 3.74978 14.882C3.68064 21.1134 8.76834 26.2374 14.9998 26.2492C21.2224 26.2609 26.2498 21.2201 26.2498 14.9992C26.2498 8.87376 21.3543 3.88919 15.2635 3.74916C15.2292 3.74805 15.195 3.75387 15.163 3.76625C15.131 3.77863 15.1019 3.79733 15.0773 3.82122C15.0527 3.84512 15.0331 3.87372 15.0198 3.90533C15.0065 3.93694 14.9997 3.97091 14.9998 4.00521V8.9054"
                    stroke="#FEAD03"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.745 14.481H15.746C15.9144 14.6024 16.0355 14.7775 16.0897 14.9761L16.1083 15.063C16.1431 15.2679 16.1067 15.478 16.0057 15.6577L15.9579 15.7329C15.8386 15.9033 15.6649 16.0266 15.4667 16.0835L15.3807 16.104C15.1479 16.1469 14.908 16.0958 14.7118 15.9634C14.6695 15.9336 14.6294 15.9009 14.5927 15.8647L14.4872 15.7417L11.5594 11.5542L15.745 14.481Z"
                    fill="#666666"
                    stroke="#FEAD03"
                    stroke-width="2"
                  />
                </svg>
              </button>

              <button
                className="flex h-[35px] w-[35px] bg-white rounded-[10px] hover:shadow-[0px_2px_10.9px_0px_rgba(0,_0,_0,_0.25)] 
              transition-all duration-300 justify-center items-center"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5937 12.5381L9.95859 8.90234C10.5444 8.0973 10.8596 7.12707 10.8586 6.13144C10.8586 3.52549 8.73838 1.40527 6.13242 1.40527C3.52646 1.40527 1.40625 3.52549 1.40625 6.13144C1.40625 8.7374 3.52646 10.8576 6.13242 10.8576C7.12805 10.8586 8.09828 10.5434 8.90332 9.95762L12.5391 13.5928L13.5937 12.5381ZM6.13242 9.36494C5.49281 9.365 4.86755 9.17538 4.33571 8.82007C3.80388 8.46476 3.38935 7.95971 3.14455 7.3688C2.89976 6.77789 2.83569 6.12766 2.96046 5.50034C3.08523 4.87302 3.39322 4.29679 3.84549 3.84452C4.29777 3.39225 4.874 3.08425 5.50132 2.95949C6.12864 2.83472 6.77887 2.89878 7.36978 3.14358C7.96069 3.38837 8.46574 3.8029 8.82105 4.33474C9.17636 4.86658 9.36597 5.49184 9.36592 6.13144C9.36491 6.98871 9.02391 7.81058 8.41773 8.41676C7.81156 9.02294 6.98969 9.36393 6.13242 9.36494V9.36494Z"
                    fill="#666666"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* first row cards */}
          <div className="flex flex-row gap-5 h-[100px] w-full fade-in-delay-2">
            <StatsCard
              icon="/svgs/list-outline.svg"
              header="All Tasks"
              content={String(dashboardData ? dashboardData.all_tasks : 0)}
              delay="fade-in-left-delay-1"
            />
            <StatsCard
              icon="/svgs/timer-outline.svg"
              header="To Do"
              content={String(dashboardData ? dashboardData.pending_tasks : 0)}
              delay="fade-in-left-delay-2"
            />
            <StatsCard
              icon="/svgs/folder-open-outline.svg"
              header="All Projects"
              content={String(dashboardData ? dashboardData.all_projects : 0)}
              delay="fade-in-left-delay-3"
            />
            <StatsCard
              icon="/svgs/checkbox-outline.svg"
              header="Complete"
              content={String(dashboardData ? dashboardData.complete_tasks : 0)}
              delay="fade-in-left-delay-4"
            />
          </div>

          {/* Chart cards */}
          <div className="flex flex-row gap-5 h-[260px] w-full fade-in-delay-2">
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
                onClick={() => {
                  setIsTaskModalOpen(true);
                  clearAllData();
                  setIsUpdateTask(false);
                }}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7501 12.499H5.25012M12.0001 5.74902V19.249V5.74902Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                New Task
              </button>
            </div>

            {/* Scrollable Task List */}
            <div className="flex flex-col gap-[10px] mt-5 overflow-y-auto flex-grow basis-0">
              {/* Task Item */}
              {tasks.map((task, index) => (
                <TaskItem
                  key={index}
                  task={task}
                  handleUpdateTask={() => {
                    setIsTaskModalOpen(true);
                    setIsUpdateTask(true);
                  }}
                  handleTaskStatus={(task: ITask) => handleTaskStatus(task)}
                />
              ))}
            </div>
          </div>
          </>
        )}

        {(tasks.length ===0 && !pageLoading) &&(
          <>
            <div className="w-full h-full flex items-start justify-center mt-12">
              <div className="flex flex-col gap-5 items-center max-w-[352px] justify-start">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="fade-in">
                <path d="M87.5 50.0093C87.5 29.3062 70.7031 12.5093 50 12.5093C29.2969 12.5093 12.5 29.3062 12.5 50.0093C12.5 70.7124 29.2969 87.5093 50 87.5093C70.7031 87.5093 87.5 70.7124 87.5 50.0093Z" stroke="#FEAD03" stroke-width="7" stroke-miterlimit="10"/>
                <g filter="url(#filter0_d_1156_894)">
                <path d="M71.875 37.5054L50.0254 62.5054L40.6602 53.1304M37.4902 62.5054L28.125 53.1304M59.709 37.5054L49.6406 49.0288" stroke="#FEAD03" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
                </g>
                <defs>
                <filter id="filter0_d_1156_894" x="21.125" y="34.5054" width="57.75" height="39" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1156_894"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1156_894" result="shape"/>
                </filter>
                </defs>
                </svg>
                <h1 className="font-lato text-2xl text-primary-default font-bold fade-in-delay">
                  Welcome to Your Dashboard ✨
                </h1>
                <span className="font-lato text-base text-text text-center fade-in-delay-2">
                  Start organizing your life by creating your first task
                  Every great journey begins with a single step!
                </span>
                <button
                  className="px-5 py-[5px] w-full flex flex-row gap-[5px] items-center justify-center text-white font-lato bg-primary-default rounded-[10px] 
                    hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300 fade-in-delay-3"
                  onClick={() => {
                    setIsTaskModalOpen(true);
                    clearAllData();
                    setIsUpdateTask(false);
                  }}
                >
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7501 12.499H5.25012M12.0001 5.74902V19.249V5.74902Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Add Your First Task
                </button>
              </div>
            </div>
          </>
        )}

        </div>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          onClose={() => setIsTaskModalOpen(false)}
          formik={{
            values: values,
            errors: errors as FormErrors,
            handleChange,
            setFieldValue,
            setFieldError,
          }}
          handleCreateTask={() => handleSubmit()}
          project={projectOptions}
          isUpdate={isUpdateTask}
          handleUpdateTask={() => handleUpdateTask(values as taskFormValues)}
          isLoading={isLoading}
        />
      )}
    </MainLayout>
  );
}

function TaskItem({
  task,
  handleUpdateTask,
  handleTaskStatus,
}: {
  task: ITask;
  handleUpdateTask: () => void;
  handleTaskStatus: (task: ITask) => void;
}) {
  const { setSelectedTaskData } = useFormState();

  const handleCheckToggle = () => {
    const audio = new Audio('/soundfx/3.mp3'); // path to your mp3 file
    audio.play();
    const updatedTask = {
      ...task,
      status: task.status === "Complete" ? "Pending" : "Complete",
    };
    handleTaskStatus(updatedTask);
  };

  return (
    <div className="flex flex-row w-full h-[42px] py-[11px] justify-between rounded-[10px] hover:bg-[#FAFAFA] cursor-pointer gap-5 pr-5">
      <div className="flex flex-row gap-5 items-center">
        <div className="group w-5 h-5 relative">
          <input
            id="checkTask"
            type="checkbox"
            checked={task.status === "Complete"}
            readOnly
            onClick={handleCheckToggle}
            className="peer appearance-none w-full h-full cursor-pointer"
          />
          <div
            className="absolute inset-0 rounded-[10px] border-[2px] border-solid border-primary-200 
                      peer-checked:border-0 group-hover:border-0 pointer-events-none"
          ></div>
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 
                          group-hover:opacity-100 peer-checked:opacity-100 pointer-events-none"
          >
            <Image
              src="/svgs/checkmark-circle-yellow.svg"
              alt="Check"
              width={20}
              height={20}
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
