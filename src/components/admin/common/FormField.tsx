"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  accept?: string;
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
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-zinc-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {textarea ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          {...register(name)}
          className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-cyan-500/50"
        />
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          accept={accept}
          {...register(name)}
          className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-cyan-500/50"
        />
      )}
      {error && (
        <p className="text-sm text-red-400">{error.message}</p>
      )}
    </div>
  );
}
