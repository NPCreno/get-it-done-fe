"use client"
import MainLayout from "@/app/components/MainLayout";
import ProjectCard from "../../components/projectCard";
import Image from "next/image";
import { getAccessTokenFromCookies, parseJwt } from "@/app/utils/utils";
import { useFormState } from "@/app/context/FormProvider";
import { useEffect, useMemo, useState } from "react";
import { createProject, getProjectsForUser, getUser, updateUser } from "@/app/api/api";
import AddProjectModal from "@/app/components/modals/addProjectModal";
import { FormikErrors, useFormik } from "formik";
import { createProjectSchema } from "@/app/schemas/createProjectSchema";
interface Project {
  title: string;
  description: string;
  due_date: Date;
  tasks?: number;
}

interface projectFormValues {
  title: string;
  description: string;
  due_date: Date;
  color: string;
  user_id: string;
}

export default function ProjectsPage() {
  const { user, setUser } = useFormState();
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "", className: "" });
  const [isExitingToast, setIsExitingToast] = useState(false);

  const initialValues = useMemo(() => ({
    title: "",
    description: "",
    due_date: new Date(),
    color: "",
    user_id: user?.user_id ?? "",
  }), [user?.user_id]);

  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    handleChange,
    setSubmitting,
    handleBlur,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createProjectSchema,
    validateOnChange: false, // Disable real-time validation
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (!user) return;
      const withUser = { ...values, user_id: user.user_id };
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
      const response = await createProject(values);
      if (response) {
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
          const projects = await getProjectsForUser(user.user_id);
          setProjectData(projects);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <MainLayout>
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
                onClick={() => setIsAddProjectModalOpen(true)}
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
            {projectData.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                due_date={project.due_date}
                tasks={project.tasks ? project.tasks : 0}
              />
            ))}
          </div>
        </div>
      </div>

      {isAddProjectModalOpen && (
        <AddProjectModal
          isOpen={isAddProjectModalOpen}
          onClose={() => setIsAddProjectModalOpen(false)}
          projectTitle={values.title}
          setProjectTitle={(projectTitle: string) => setFieldValue("title", projectTitle)}
          projectDescription={values.description}
          setProjectDescription={(projectDescription: string) => setFieldValue("description", projectDescription)}
          dueDate={values.due_date}
          setDueDate={(dueDate: Date) => setFieldValue("due_date", dueDate)}
          color={values.color}
          setColor={(color: string) => setFieldValue("color", color)}
        />
      )}
    </MainLayout>
  );
}
