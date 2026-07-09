"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function TagInput({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
  error,
  required,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !inputValue && values.length > 0) {
      removeTag(values.length - 1);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      <div
        className={cn(
          "min-h-[44px] rounded-md border border-white/10 bg-white/5 p-2 flex flex-wrap gap-2 items-center",
          error && "border-red-500/50"
        )}
      >
        {values.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 text-xs font-medium text-cyan-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="ml-0.5 text-cyan-400 hover:text-white transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <div className="flex flex-1 items-center gap-1 min-w-[120px]">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-7 border-0 bg-transparent p-0 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
