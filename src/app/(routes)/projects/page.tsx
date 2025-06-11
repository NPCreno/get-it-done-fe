"use client";
import MainLayout from "@/app/components/MainLayout";
import ProjectCard from "../../components/projectCard";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";
import { useFormState } from "@/app/context/FormProvider";
import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  getProjectsForUser,
  getUser,
  getTasksByProject,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "@/app/api/api";
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

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

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
                onClick={() => {
                  setIsAddProjectModalOpen(true);
                  clearValueAndErrors();
                }}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 25"
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
                New Project
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            {projectData.length > 0 ? (
              projectData.map((project, index) => (
                <ProjectCard
                  key={index}
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
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-text text-[13px] font-lato">
                  No projects found
                </p>
              </div>
            )}
          </div>
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
