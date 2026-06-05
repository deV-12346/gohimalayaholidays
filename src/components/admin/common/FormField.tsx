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
}

export default function FormField({
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
  return (
    <div className="space-y-1.5 w-full">
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {textarea ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          {...register(name)}
          className="
            w-full
            rounded-lg
            border
            border-gray-200
            bg-white
            text-sm
            text-gray-900
            placeholder:text-gray-400
            focus:border-orange-400
            focus:ring-2
            focus:ring-orange-100
            min-h-[120px]
          "
        />
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          accept={accept}
          multiple={multiple}
          {...register(name)}
          className="
            h-11
            w-full
            rounded-lg
            border
            border-gray-200
            bg-white
            text-sm
            text-gray-900
            placeholder:text-gray-400
            focus:border-orange-400
            focus:ring-2
            focus:ring-orange-100
          "
        />
      )}

      {error && (
        <p className="text-xs text-red-500">
          {typeof error === "string"
            ? error
            : String(error.message || "Invalid input")}
        </p>
      )}
    </div>
  );
}