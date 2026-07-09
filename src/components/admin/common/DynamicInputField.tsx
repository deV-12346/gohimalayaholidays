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
  errors?: FieldErrors<T>;
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
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

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
                  ? `flex items-start gap-2 rounded-xl border p-3 bg-white ${
                      dayError || descError ? "border-red-500" : "border-zinc-300"
                    }`
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
                      className={`w-full h-12 rounded-xl bg-white px-4 text-sm text-black placeholder:text-zinc-400 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                        dayError
                          ? "border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500"
                          : "border-zinc-300 focus-visible:ring-orange-500/30 focus-visible:border-orange-500"
                      }`}
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
                      className={`w-full h-12 rounded-xl bg-white px-4 text-sm text-black placeholder:text-zinc-400 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                        descError
                          ? "border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500"
                          : "border-zinc-300 focus-visible:ring-orange-500/30 focus-visible:border-orange-500"
                      }`}
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
                    className={`w-full h-12 rounded-xl bg-white px-4 text-sm text-black placeholder:text-zinc-400 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                      plainError
                        ? "border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500"
                        : "border-zinc-300 focus-visible:ring-orange-500/30 focus-visible:border-orange-500"
                    }`}
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
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-12 w-12 rounded-xl border border-zinc-300 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shrink-0"
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
        className="w-full h-12 rounded-xl border border-zinc-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
      >
        <Plus className="mr-2 h-4 w-4 text-gray-500" />
        Add {label}
      </Button>
    </div>
  );
};

export default DynamicInputFields;