import * as yup from "yup";

export const updateUserSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(3, "Fullname must be at least 3 characters long")
    .max(50, "Fullname must be at most 50 characters long"),

  username: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  password: yup
    .string()
    .test(
      "password-conditional-validation",
      "Password must be 6-20 characters and contain at least one number",
      (value) => {
        if (!value) return true; // Skip validation if password is empty
        return (
          value.length >= 6 &&
          value.length <= 20 &&
          /[0-9]/.test(value)
        );
      }
    ),
});
