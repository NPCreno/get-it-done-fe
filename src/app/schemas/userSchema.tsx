import * as yup from "yup";

export const userSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(3, "Fullname must be at least 3 characters long")
    .max(50, "Fullname must be at most 50 characters long")
    .required("Fullname is required"),

  username: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    )
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
    )
    .required("Username or Email is required"),
});
