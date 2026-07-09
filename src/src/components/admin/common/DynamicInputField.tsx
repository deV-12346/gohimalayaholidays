"use client";

import {
  Control,
  FieldValues,
  Path,
  useFieldArray,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface DynamicInputFieldsProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  name: "includedService" | "excludedService" | "placesCovered" | "itinerary";
  label: string;
  placeholder: string;
  errors?: FieldErrors<T>; // <-- add this
}

const DynamicInputFields = <T extends FieldValues>({
  control,
  register,
  name,
  label,
  placeholder,
  errors,
}: DynamicInputFieldsProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const isItinerary = name === "itinerary";

  // helper to safely pull nested error for a given field/index
  const getFieldError = (index: number, subField?: "day" | "description") => {
    const fieldErrors = (errors as any)?.[name];
    if (!fieldErrors) return undefined;
    const entry = fieldErrors[index];
    if (!entry) return undefined;
    return subField ? entry[subField] : entry;
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-white">{label}</Label>

      {fields.map((field, index) => {
        const dayError = isItinerary ? getFieldError(index, "day") : undefined;
        const descError = isItinerary
          ? getFieldError(index, "description")
          : undefined;
        const plainError = !isItinerary ? getFieldError(index) : undefined;

        return (
          <div key={field.id} className="space-y-1">
            <div
              className={
                isItinerary
                  ? "flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
                  : "flex items-center gap-2"
              }
            >
              {isItinerary ? (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <div className="sm:w-24">
                    <Input
                      type="number"
                      {...register(`${name}.${index}.day` as Path<T>, {
                        valueAsNumber: true,
                      })}
                      placeholder="Day"
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-400 focus-visible:ring-cyan-500 w-full"
                    />
                    {dayError && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {String(dayError.message)}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      {...register(`${name}.${index}.description` as Path<T>)}
                      placeholder={`${placeholder} ${index + 1}`}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-400 focus-visible:ring-cyan-500 w-full"
                    />
                    {descError && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {String(descError.message)}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <Input
                    {...register(`${name}.${index}` as Path<T>)}
                    placeholder={`${placeholder} ${index + 1}`}
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-400 focus-visible:ring-cyan-500 w-full"
                  />
                  {plainError && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {String(plainError.message)}
                    </p>
                  )}
                </div>
              )}

              {fields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="shrink-0 bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append(
            (isItinerary
              ? { day: fields.length + 1, description: "" }
              : "") as any
          )
        }
        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add {label}
      </Button>
    </div>
  );
};

export default DynamicInputFields;