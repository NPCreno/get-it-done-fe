import React from 'react'

interface InputBoxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "textarea";
  error?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isLabelVisible?: boolean;
}

export default function InputBox({
  label,
  placeholder,
  value,
  onChange,
  type,
  error,
  disabled,
  onBlur,
  isLabelVisible = true,
}: InputBoxProps) {
  return (
    <div className="">
    <div className={` ${error ? "shake" : ""}`}>
      {isLabelVisible && (
        <label
          htmlFor="fullname"
          className={`text-base font-normal font-lato ${
            error ? "text-error-default" : "text-text"
          }`}
      >
        {label}
      </label>
      )}
    </div>
    <input
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      value={value ?? ""}
      onChange={onChange}
      type={type}
      id={label}
      onBlur={onBlur}
      className={`rounded-[10px] border  w-full h-[46px] py-2 px-5
                outline-none transition-all duration-200 
                text-text ${
                  error
                    ? "focus:ring-error border-error"
                    : "focus:ring-text focus:ring-2  border-[#E0E0E0]"
                }`}
      placeholder={placeholder}
      disabled={disabled}
    />
    {error && (
      <span className="text-error-default font-lato text-xs top-0">
        {error as string}
      </span>
    )}
  </div>
  )
}
