import * as yup from "yup";

export const createProjectSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, "Title must be at least 2 characters long")
    .required("Title is required"),

  description: yup
    .string()
    .min(2, "Description must be at least 2 characters long")
    .optional(),

  colorLabel: yup
    .string()
    .required("Color label is required"),

  color: yup
    .string()
    .required("Color is required")
});
