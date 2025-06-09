import * as yup from "yup";

export const loginSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),

  usernameOrEmail: yup
    .string()
    .test(
      "is-username-or-email",
      "Must be a valid username or email",
      (value) => {
        if (!value) return false;
        const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(value);
        const isValidEmail = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        return isValidUsername || isValidEmail;
      }
    ),
});
