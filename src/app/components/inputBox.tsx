import React from "react";
import { DatePicker } from "./datePicker";
import { CustomDropdownMenu } from "./dropdown";
interface InputBoxProps {
  label: string;
  placeholder: string;
  value: {
    name: string;
    color?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: "text" | "textarea" | "date" | "dropdown";
  error?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLabelVisible?: boolean;
  dropdownptions?: {
    name: string;
    color?: string;
  }[];
}

export default function InputBox({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  disabled,
  onBlur,
  isLabelVisible = true,
  dropdownptions,
}: InputBoxProps) {
  return (
    <div className="w-full">
      <div className={`${error ? "shake" : ""}`}>
        {isLabelVisible && (
          <label
            htmlFor={label}
            className={`text-base font-normal font-lato ${
              error ? "text-error-default" : "text-text"
            }`}
          >
            {label}
          </label>
        )}
      </div>

      {type === "text" ? (
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          value={value.name ?? ""}
          onChange={onChange}
          type="text"
          id={label}
          onBlur={onBlur}
          className={`rounded-md border w-full h-[40px] py-2 px-2
            outline-none transition-all duration-200 text-text
            ${error ? "focus:ring-error border-error" : "focus:ring-text focus:ring-2 border-[#E0E0E0]"}
            disabled:opacity-50 disabled:cursor-not-allowed`}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : type === "textarea" ? (
        <textarea
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          value={value.name ?? ""}
          onChange={onChange}
          id={label}
          onBlur={onBlur}
          className={`resize-y rounded-md border w-full min-h-[70px] max-h-[200px] py-2 px-2
            outline-none transition-all duration-200 text-text
            ${error ? "focus:ring-error border-error" : "focus:ring-text focus:ring-2 border-[#E0E0E0]"}
            disabled:opacity-50 disabled:cursor-not-allowed`}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : type === "date" ? (
        <DatePicker
          date={value.name ? new Date(value.name) : undefined}
          setDate={(date: Date) => {
            const syntheticEvent = {
              target: { value: date.toISOString() },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }}
        />
      ) : type === "dropdown" ? (
        <CustomDropdownMenu 
        options={dropdownptions ?? []} 
        selectedOption={value} 
        setSelectedOption={(option: {name: string, color?: string}) => onChange({ target: { value: option.name } } as React.ChangeEvent<HTMLInputElement>)} />
      ) : (
        <></>
      )}

      {error && (
        <span className="text-error-default font-lato text-xs">{error}</span>
      )}
    </div>
  );
}
