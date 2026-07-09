"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UseFormRegister,
  FieldError,
  Merge,
  FieldErrorsImpl,
} from "react-hook-form";

interface FormFieldProps {
  showBorder?:boolean;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  isEnquiryModal?:Boolean
}

export default function FormField({
  isEnquiryModal=false,
  showBorder=false,
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  required = false,
  textarea = false,
  rows = 4,
  accept,
  multiple = false,
}: FormFieldProps) {
  const fieldStyles = `
    w-full
    rounded-xl
    ${showBorder ? "border border-zinc-300" : "border border-transparent"}
    bg-white/10
    px-4
    text-sm
    text-white
    placeholder:text-zinc-400
    transition-all
    duration-200
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-orange-500/30
    focus-visible:border-orange-500
    disabled:cursor-not-allowed
    disabled:opacity-50
  `;

  return (
    <div className="w-full space-y-2">
      <Label
        htmlFor={name}
        className={`${isEnquiryModal ?  "text-gray-700 " :  "text-white "} text-sm font-medium`}
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      {textarea ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          {...register(name)}
          className={`${fieldStyles} min-h-[120px] py-3`}
        />
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          accept={accept}
          multiple={multiple}
          {...register(name)}
          className={`${fieldStyles} h-12`}
        />
      )}

      {error && (
        <p className="text-xs font-medium text-red-500">
          {typeof error === "string"
            ? error
            : String(error.message || "Invalid input")}
        </p>
      )}
    </div>
  );
}