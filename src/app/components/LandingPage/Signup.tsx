"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useFormik } from "formik";
import { userSchema } from "@/app/schemas/userSchema";

export default function Signup() {
  const {
    validateForm,
    setFieldValue,
    values,
    errors,
    handleSubmit,
    handleChange,
    isValid,
    setSubmitting,
  } = useFormik({
    initialValues: {},
    enableReinitialize: true,
    validationSchema: userSchema,
    onSubmit: async (values: any) => {
      setSubmitting(false);
      onHandleFormSubmit(values);
    },
  });

  const onHandleFormSubmit = async (data: any) => {
    try {
    } catch (error) {
      // alert("Oops! Something went wrong. Please try again "+ {error});
    }
  };

  return <></>;
}
