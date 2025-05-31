"use client"
import MainLayout from "@/app/components/MainLayout";
import ProjectCard from "../../components/projectCard";
import Image from "next/image";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";
import { useFormState } from "@/app/context/FormProvider";
import { useEffect, useMemo, useState } from "react";
import { createProject, getProjectsForUser, getUser } from "@/app/api/api";
import AddProjectModal from "@/app/components/modals/addProjectModal";
import { FormikErrors, useFormik } from "formik";
import { createProjectSchema } from "@/app/schemas/createProjectSchema";
import { Toast } from "@/app/components/toast";
import ViewProjectModal from "@/app/components/modals/viewProject";
import { IProject } from "@/app/interface/IProject";
import { IResponse } from "@/app/interface/IResponse";
import { CreateProjectDto } from "@/app/interface/dto/create-project-dto";

interface projectFormValues {
  title: string;
  description: string;
  due_date?: Date | null;
  colorLabel: string;
  color: string;
  user_id: string;
}

export default function ProjectsPage() {
  const { user, setUser } = useFormState();
  const [isDoneFetchingUser, setIsDoneFetchingUser] = useState(false);
  const [projectData, setProjectData] = useState<IProject[]>([]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isViewProjectModalOpen, setIsViewProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  console.log("isAddTaskModalOpen: ", isAddTaskModalOpen);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "", className: "" });
  const [isExitingToast, setIsExitingToast] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const handleToastClose = () => {
    setIsExitingToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 400);
  };

  const initialValues = useMemo(() => ({
    title: "",
    description: "",
    due_date: null,
    colorLabel: "",
    color: "",
    user_id: user?.user_id ?? "",
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
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createProjectSchema,
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

  const handleSubmitForm = async (values: projectFormValues) => {
    const validationErrors: FormikErrors<typeof values> = await validateForm();

    if (Object.keys(validationErrors).length === 0) {
      await createProj(values)
    }
    setSubmitting(false);
  };

  const createProj = async (values: projectFormValues) => {
    try {
      if(!user){
        console.error("No User data found");
        return
      }

      const response: IResponse = await createProject(values as CreateProjectDto);
      console.log("response: ", response);
      if (response.status === "success") {
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
      if(isDoneFetchingUser) return;
      else{
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
        if (projects?.message && projects.message.includes("No projects found")) {
          setProjectData([]);
        }else{
          setProjectData(projects);
        }
      };
      fetchProjects();
    }
  }, [user, isAddProjectModalOpen]);

  const clearValueAndErrors = () => {
    setErrors({});
    setFieldValue("title", "");
    setFieldValue("description", "");
    setFieldValue("due_date", null);
    setFieldValue("colorLabel", "");
    setFieldValue("color", "");
  }

  return (
    <MainLayout>
      {showToast && (
        <div className={`fixed bottom-4 right-4 z-50 ${isExitingToast ? "toast-exit" : "toast-enter"}`}>
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
                <Image 
                src="/svgs/add-outline-white.svg" 
                alt="add task" 
                width={25} 
                height={25}
                className="mt-[2px]"
                />
                New Project
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            {projectData.length > 0 ? projectData.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                due_date={project.due_date}
                tasks={project.tasks ? project.tasks : 0}
                onClick={() => {
                  setSelectedProject(project);
                  setIsViewProjectModalOpen(true);
                }}
              />
            )) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-text text-[13px] font-lato">No projects found</p>
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
          isOpen={isViewProjectModalOpen}
          onClose={() => setIsViewProjectModalOpen(false)}
          project={selectedProject ?? {
            title: "",
            description: "",
            due_date: new Date(),
            tasks: 0
          }}
          handleCreateTask={() => {
            setIsViewProjectModalOpen(false)
            setIsAddTaskModalOpen(true);
          }}
        />
      )}
    </MainLayout>
  );
}
