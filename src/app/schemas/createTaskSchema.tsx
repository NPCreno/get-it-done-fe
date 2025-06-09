import * as yup from "yup";

export const createTaskSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, "Title must be at least 2 characters long")
    .required("Title is required"),

  description: yup
    .string()
    .min(2, "Description must be at least 2 characters long")
    .optional(),

  priority: yup
    .string()
    .required("Priority is required"),

  status: yup
    .string()
    .required("Status is required"),

  isRecurring: yup
    .boolean()
    .required(), // include this field in the schema to base conditions on

  repeat_every: yup
    .string()
    .when("isRecurring", {
      is: true,
      then: (schema) => schema.required("Repeat every is required"),
      otherwise: (schema) => schema.optional(),
    }),

  repeat_days: yup
    .array()
    .of(yup.string())
    .when(["isRecurring", "repeat_every"], {
      is: (isRecurring: boolean, repeatEvery: string) =>
        isRecurring && repeatEvery === "Weekly",
      then: (schema) => schema.min(1, "Please select at least one day").required("Repeat days are required"),
      otherwise: (schema) => schema.optional(),
    }),

  start_date: yup
    .date()
    .when("isRecurring", {
      is: true,
      then: (schema) => schema.required("Start date is required"),
      otherwise: (schema) => schema.required("Start date is required"),
    }),
});
