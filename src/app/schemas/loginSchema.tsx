import * as yup from "yup";

export const loginSchema = yup.object().shape({
  password: yup
    .string()
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
