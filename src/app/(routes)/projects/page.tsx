"use client";
import MainLayout from "@/app/components/MainLayout";
import ProjectCard from "../../components/projectCard";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";
import { useFormState } from "@/app/context/FormProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUser } from "@/app/api/userRequests";
import {
  getTasksByProject,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "@/app/api/taskRequests";
import {
  getProjectsForUser,
  createProject,
} from "@/app/api/projectsRequests";
import AddProjectModal from "@/app/components/modals/addProjectModal";
import { FormikErrors, useFormik } from "formik";
import { createProjectSchema } from "@/app/schemas/createProjectSchema";
import { Toast } from "@/app/components/toast";
import ViewProjectModal from "@/app/components/modals/viewProject";
import { IProject } from "@/app/interface/IProject";
import { CreateProjectDto } from "@/app/interface/dto/create-project-dto";
import { ICreateProjectResponse } from "@/app/interface/responses/ICreateProjectResponse";
import { ITask } from "@/app/interface/ITask";
import { CreateTaskDto } from "@/app/interface/dto/create-task-dto";
import { createTaskSchema } from "@/app/schemas/createTaskSchema";
import TaskModal from "@/app/components/modals/taskModal";
import { UpdateTaskDto } from "@/app/interface/dto/update-task-dto";
import { ITaskResponse } from "@/app/interface/responses/ITaskResponse";
import { IUser } from "@/app/interface/IUser";
import LoadingPage from "@/app/components/loader";

interface projectOrTaskFormValues {
  title: string;
  description: string;
  due_date: Date | null;
  colorLabel: string;
  color: string;
  user_id: string;
  project_id: string;
  project_title: string;
  project_color: string;
  priority: string;
  status: string;
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

export default function ProjectsPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const { selectedTaskData } = useFormState();
  const [isDoneFetchingUser, setIsDoneFetchingUser] = useState(false);
  const [projectData, setProjectData] = useState<IProject[]>([]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isViewProjectModalOpen, setIsViewProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    className: "",
  });
  const [isExitingToast, setIsExitingToast] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [projectOptions, setProjectOptions] = useState<IProject[]>([]);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [updateTasksData, setUpdateTasksData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setIsPageLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const isFirstLoad = useRef(true);
  const [refreshPage, setRefreshPage] = useState(false)
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
      colorLabel: "",
      color: "",
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
      project: "",
    }),
    [user?.user_id]
  );

  const {
    validateForm,
    setFieldValue,
    values,
    setErrors,
    errors,
    handleSubmit,
    handleChange,
    setSubmitting,
    setFieldError,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: selectedProject ? createTaskSchema : createProjectSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (!user) return;
      const withUser = {
        ...values,
        user_id: user.user_id,
        due_date: values.due_date || null,
      };
      handleSubmitForm(withUser as projectOrTaskFormValues);
    },
  });

  const handleSubmitForm = async (values: projectOrTaskFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();
    console.log("validationErrors: ", validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      await createProj(values);
    }
    setSubmitting(false);
  };

  const createProj = async (values: projectOrTaskFormValues) => {
    try {
      setIsLoading(true);
      if (!user) {
        console.error("No User data found");
        return;
      }
      const response: ICreateProjectResponse = await createProject(
        values as CreateProjectDto
      );
      if (response.status === "success") {
        setIsLoading(false);
        setRefreshPage(!refreshPage)
        setIsAddProjectModalOpen(false);
        setToastMessage({
          title: "Project Created",
          description: "Your new project has been created successfully",
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
          setProjectData(projects.data);
          return;
        } else {
          setProjectData([]);
        }
      };
      fetchProjects();
    }
  }, [user, isAddProjectModalOpen, isTaskModalOpen]);

  const clearValueAndErrors = () => {
    setErrors({});
    setFieldValue("title", "");
    setFieldValue("description", "");
    setFieldValue("due_date", null);
    setFieldValue("colorLabel", "");
    setFieldValue("color", "");
  };

  useEffect(() => {
    const fetchTasksByProj = async () => {
      if (selectedProject) {
        try {
          const startDate = new Date().toISOString();
          const endDate = new Date(
            new Date().setDate(new Date().getDate() + 1)
          ).toISOString(); //tomorrow
          const tasks = await getTasksByProject(
            selectedProject?.project_id ?? "",
            startDate,
            endDate
          );
          if (tasks) {
            setTasks(tasks);
          } else {
            setTasks([]);
          }
        } catch (error) {
          setTasks([]);
          console.error("Failed to fetch tasks by project:", error);
        }
      }
    };
    fetchTasksByProj();
  }, [selectedProject, updateTasksData]);

  useEffect(() => {
    if (!isTaskModalOpen && !isViewProjectModalOpen) {
      setSelectedProject(null);
    }
  }, [isViewProjectModalOpen, isTaskModalOpen]);

  const handleCreateTask = async (values: projectOrTaskFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      await createTask(values);
    }
    setSubmitting(false);
  };

  const handleUpdateTask = async (values: projectOrTaskFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      await updateTask(values);
    }
    setSubmitting(false);
  };

  const createTask = async (values: projectOrTaskFormValues) => {
    try {
      if (!user) {
        console.error("No User data found");
        return;
      }
      const payload: CreateTaskDto = {
        title: values.title,
        description: values.description,
        due_date: values.due_date || undefined,
        user_id: user.user_id,
        project_id: selectedProject
          ? selectedProject.project_id
          : values.project_id,
        priority: values.priority || undefined,
        isRecurring: values.isRecurring || false,
        repeat_every: values.repeat_every || undefined,
        repeat_days: values.repeat_days || undefined,
        start_date: values.start_date || undefined,
        end_date: values.end_date || undefined,
        status: values.status || "Pending",
      };
      const response: ITaskResponse = await createTaskApi(payload);
      if (response.status === "success") {
        clearValueAndErrors();
        setUpdateTasksData(!updateTasksData);
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
      } else {
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

  const updateTask = async (values: projectOrTaskFormValues) => {
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
        clearValueAndErrors();
        setUpdateTasksData(!updateTasksData);
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

  const deleteTask = async (taskId: string) => {
    try {
      const response: ITaskResponse = await deleteTaskApi(taskId);
      if (response.status === "success") {
        clearValueAndErrors();
        setUpdateTasksData(!updateTasksData);
        setIsTaskModalOpen(false);
        setToastMessage({
          title: "Task Deleted",
          description:
            response.message || "Your task has been deleted successfully",
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
    const mappedTask: projectOrTaskFormValues = {
      title: task.title,
      description: task.description,
      due_date: task.due_date ?? null,
      colorLabel: "",
      color: "",
      user_id: user?.user_id ?? "",
      project_id: task.project_id,
      project_title: task.project_title ?? "",
      project_color: "",
      priority: task.priority,
      status: task.status,
      isRecurring: false,
      repeat_every: "",
      repeat_days: [],
      start_date: null,
      end_date: null,
      project: "",
      task_id: task.task_id,
    };

    await updateTask(mappedTask);
  };

  const clearAllData = () => {
    setFieldValue("title", "");
    setFieldValue("description", "");
    setFieldValue("due_date", null);
    setFieldValue("colorLabel", "");
    setFieldValue("color", "");
    setFieldError("title", "");
    setFieldError("description", "");
    setFieldError("due_date", "");
    setFieldError("colorLabel", "");
    setFieldError("color", "");
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  useEffect(() => {
      const fetchProjects = async () => {
        if (!user) return;
        // Only show loading spinner for first load
        if (isFirstLoad.current) {
          setIsPageLoading(true);
        }
        
        const projects = await getProjectsForUser(user.user_id);
        if (projects?.status === "success") {
          if (isFirstLoad.current) {
            setIsPageLoading(false);
            isFirstLoad.current = false;
          }
          setProjectOptions(projects.data);
          return;
        } else {
          if (isFirstLoad.current) {
            setIsPageLoading(false);
            isFirstLoad.current = false;
          }
          setProjectOptions([]);
        }

      };
      fetchProjects();
  }, [user, isTaskModalOpen, refreshPage]);

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
      <div className="main flex justify-center ju w-full">
        {/* Main Page */}
        <div className="inside flex flex-col gap-5 max-w-[1440px] w-full mx-auto">

        {showLoader && (
          <div className={`transition-opacity duration-500 ${!pageLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <LoadingPage />
          </div>
        )}

        {(projectOptions.length !=0 && !pageLoading) && (
          <>
            <div className="flex justify-between">
              {/* Left header */}
              <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary-default rounded-full"></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 fade-in select-none">
                  Projects
                  </h1>
                  <p className="font-lato text-sm text-gray-500 fade-in-delay select-none mt-1">
                  Organize your tasks into projects
                  </p>
                </div>
              </div>
            </div>

              <div className="flex flex-row gap-[10px] items-end">
                <button
                  className="px-4 py-[5px] flex flex-row gap-4 text-white font-lato bg-primary-default rounded-[10px] 
                            hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300 ml-3"
                  onClick={() => {
                    setIsAddProjectModalOpen(true);
                    clearValueAndErrors();
                  }}
                >
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.0234375" y="0.523438" width="23.9531" height="23.9531" stroke="white" stroke-width="0.046875"/>
                  <path d="M3 9.50147V6.12646C3 5.62918 3.19754 5.15227 3.54917 4.80064C3.90081 4.44901 4.37772 4.25146 4.875 4.25146H8.43234C8.80256 4.25147 9.16448 4.36108 9.4725 4.56646L10.7775 5.43646C11.0855 5.64185 11.4474 5.75146 11.8177 5.75146H19.125C19.6223 5.75146 20.0992 5.94901 20.4508 6.30064C20.8025 6.65227 21 7.12918 21 7.62647V9.50147" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22.4954 11.122L21.7351 18.8774C21.7351 19.3742 21.538 19.8506 21.1871 20.2021C20.8362 20.5536 20.3601 20.7516 19.8634 20.7524H4.1368C3.64009 20.7516 3.16402 20.5536 2.8131 20.2021C2.46218 19.8506 2.26508 19.3742 2.26508 18.8774L1.50477 11.122C1.48827 10.9156 1.51468 10.708 1.58234 10.5123C1.65001 10.3166 1.75745 10.137 1.89792 9.98489C2.03838 9.83275 2.20882 9.71135 2.39851 9.62832C2.5882 9.54529 2.79302 9.50243 3.00008 9.50244H21.0048C21.2114 9.50308 21.4158 9.54641 21.6049 9.62973C21.794 9.71304 21.9639 9.83454 22.1038 9.98661C22.2438 10.1387 22.3508 10.318 22.4182 10.5134C22.4856 10.7088 22.5119 10.916 22.4954 11.122V11.122Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="12" x2="12" y2="18" stroke="white" stroke-width="2"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke="white" stroke-width="2"/>
                  </svg>

                  <span className="min-w-[87px]">New Project</span>
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-2">
              {projectData.length > 0 ? (
                projectData.map((project, index) => {
                  // Calculate animation delay based on index (staggered effect)
                  const delay = Math.min(index * 0.1, 0.5); // Cap at 0.5s max delay
                  const animationClass = `fade-in${index > 0 ? `-delay-${Math.min(index, 4)}` : ''}`;
                  
                  return (
                    <div key={index} className={animationClass}>
                      <ProjectCard
                        project={project}
                        onClick={() => {
                          setSelectedProject(project);
                          setIsViewProjectModalOpen(true);
                        }}
                        onAddTaskClick={() => {
                          setSelectedProject(project);
                          setIsTaskModalOpen(true);
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-text text-[13px] font-lato">
                    No projects found
                  </p>
                </div>
              )}
            </div>
          </>
        )}
          
        {(projectOptions.length ===0 && !pageLoading) &&(
          <>
            <div className="w-full h-full flex items-start justify-center mt-12">
              <div className="flex flex-col gap-5 items-center max-w-[352px] justify-start">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="fade-in">
                <path d="M12.5 37.5063V23.4438C12.5 21.3718 13.3231 19.3847 14.7882 17.9196C16.2534 16.4544 18.2405 15.6313 20.3125 15.6313H35.1348C36.6773 15.6314 38.1853 16.0881 39.4687 16.9438L44.9062 20.5688C46.1897 21.4246 47.6977 21.8813 49.2402 21.8813H79.6875C81.7595 21.8813 83.7466 22.7044 85.2118 24.1696C86.6769 25.6347 87.5 27.6218 87.5 29.6938V37.5063" stroke="#FEAD03" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M93.7308 44.2578L90.5628 76.5723C90.5628 78.6419 89.7416 80.627 88.2795 82.0917C86.8173 83.5564 84.8337 84.3811 82.764 84.3848H17.2367C15.167 84.3811 13.1834 83.5564 11.7212 82.0917C10.2591 80.627 9.43784 78.6419 9.43785 76.5723L6.26988 44.2578C6.20112 43.3978 6.31118 42.5329 6.5931 41.7175C6.87503 40.9021 7.32272 40.1539 7.90799 39.52C8.49326 38.8861 9.20343 38.3802 9.99379 38.0343C10.7842 37.6883 11.6376 37.5097 12.5003 37.5098H87.5199C88.381 37.5124 89.2323 37.693 90.0203 38.0401C90.8084 38.3873 91.5162 38.8935 92.0993 39.5271C92.6825 40.1607 93.1284 40.908 93.4092 41.7221C93.6899 42.5361 93.7994 43.3994 93.7308 44.2578V44.2578Z" stroke="#FEAD03" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.5 37.5063V23.4438C12.5 21.3718 13.3231 19.3847 14.7882 17.9196C16.2534 16.4544 18.2405 15.6313 20.3125 15.6313H35.1348C36.6773 15.6314 38.1853 16.0881 39.4687 16.9438L44.9062 20.5688C46.1897 21.4246 47.6977 21.8813 49.2402 21.8813H79.6875C81.7595 21.8813 83.7466 22.7044 85.2118 24.1696C86.6769 25.6347 87.5 27.6218 87.5 29.6938V37.5063" stroke="#FEAD03" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M93.7308 44.2578L90.5628 76.5723C90.5628 78.6419 89.7416 80.627 88.2795 82.0917C86.8173 83.5564 84.8337 84.3811 82.764 84.3848H17.2367C15.167 84.3811 13.1834 83.5564 11.7212 82.0917C10.2591 80.627 9.43784 78.6419 9.43785 76.5723L6.26988 44.2578C6.20112 43.3978 6.31118 42.5329 6.5931 41.7175C6.87503 40.9021 7.32272 40.1539 7.90799 39.52C8.49326 38.8861 9.20343 38.3802 9.99379 38.0343C10.7842 37.6883 11.6376 37.5097 12.5003 37.5098H87.5199C88.381 37.5124 89.2323 37.693 90.0203 38.0401C90.8084 38.3873 91.5162 38.8935 92.0993 39.5271C92.6825 40.1607 93.1284 40.908 93.4092 41.7221C93.6899 42.5361 93.7994 43.3994 93.7308 44.2578V44.2578Z" stroke="#FEAD03" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M50 47V75.5" stroke="#FEAD03" stroke-width="7"/>
                <path d="M36 61C46.5442 61 52.4558 61 63 61" stroke="#FEAD03" stroke-width="7"/>
                </svg>

                <h1 className="font-lato text-2xl text-primary-default font-bold fade-in-delay text-center">
                  No Projects Yet ✨
                </h1>
                <span className="font-lato text-base text-text text-center fade-in-delay-2">
                  Create your first project to organize your tasks and boost your productivity.
                </span>
                <button
                  className="px-5 py-[5px] w-full flex flex-row gap-[5px] items-center justify-center text-white font-lato bg-primary-default rounded-[10px] 
                    hover:shadow-[0px_4px_10.9px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-300 fade-in-delay-3"
                  onClick={() => {
                    setIsAddProjectModalOpen(true);
                    clearAllData();
                  }}
                >
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.0234375" y="0.523438" width="23.9531" height="23.9531" stroke="white" stroke-width="0.046875"/>
                  <path d="M3 9.50147V6.12646C3 5.62918 3.19754 5.15227 3.54917 4.80064C3.90081 4.44901 4.37772 4.25146 4.875 4.25146H8.43234C8.80256 4.25147 9.16448 4.36108 9.4725 4.56646L10.7775 5.43646C11.0855 5.64185 11.4474 5.75146 11.8177 5.75146H19.125C19.6223 5.75146 20.0992 5.94901 20.4508 6.30064C20.8025 6.65227 21 7.12918 21 7.62647V9.50147" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22.4954 11.122L21.7351 18.8774C21.7351 19.3742 21.538 19.8506 21.1871 20.2021C20.8362 20.5536 20.3601 20.7516 19.8634 20.7524H4.1368C3.64009 20.7516 3.16402 20.5536 2.8131 20.2021C2.46218 19.8506 2.26508 19.3742 2.26508 18.8774L1.50477 11.122C1.48827 10.9156 1.51468 10.708 1.58234 10.5123C1.65001 10.3166 1.75745 10.137 1.89792 9.98489C2.03838 9.83275 2.20882 9.71135 2.39851 9.62832C2.5882 9.54529 2.79302 9.50243 3.00008 9.50244H21.0048C21.2114 9.50308 21.4158 9.54641 21.6049 9.62973C21.794 9.71304 21.9639 9.83454 22.1038 9.98661C22.2438 10.1387 22.3508 10.318 22.4182 10.5134C22.4856 10.7088 22.5119 10.916 22.4954 11.122V11.122Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="12" x2="12" y2="18" stroke="white" stroke-width="2"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke="white" stroke-width="2"/>
                  </svg>
                  Add Your First Project
                </button>
              </div>
            </div>
          </>
        )}
        </div>
      </div>

      {isAddProjectModalOpen && (
        <AddProjectModal
          errors={errors}
          isOpen={isAddProjectModalOpen}
          onClose={() => setIsAddProjectModalOpen(false)}
          formik={{ values, errors, handleChange, setFieldValue }}
          handleCreateProject={() => handleSubmit()}
        />
      )}

      {isViewProjectModalOpen && (
        <ViewProjectModal
          onClose={() => setIsViewProjectModalOpen(false)}
          project={
            selectedProject ?? {
              title: "",
              description: "",
              due_date: new Date(),
              tasks: 0,
            }
          }
          handleCreateTask={() => {
            setIsViewProjectModalOpen(false);
            setIsTaskModalOpen(true);
            setIsUpdateTask(false);
          }}
          tasks={tasks ? tasks : []}
          handleUpdateTask={() => {
            setIsViewProjectModalOpen(false);
            setIsTaskModalOpen(true);
            setIsUpdateTask(true);
          }}
          handleTaskStatus={(task: ITask) => handleTaskStatus(task)}
          handleDeleteTask={(taskId: string) => handleDeleteTask(taskId)}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          onClose={() => setIsTaskModalOpen(false)}
          formik={{
            values: values as projectOrTaskFormValues,
            errors: errors as FormErrors,
            handleChange,
            setFieldValue,
            setFieldError,
          }}
          handleCreateTask={() =>
            handleCreateTask(values as projectOrTaskFormValues)
          }
          project={projectOptions}
          preselectedProject={selectedProject}
          isUpdate={isUpdateTask}
          handleUpdateTask={() =>
            handleUpdateTask(values as projectOrTaskFormValues)
          }
          isLoading={isLoading}
        />
      )}
    </MainLayout>
  );
}
