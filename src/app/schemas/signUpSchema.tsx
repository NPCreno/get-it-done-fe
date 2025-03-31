import * as yup from "yup";

export const signUpSchema = yup.object().shape({
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
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
