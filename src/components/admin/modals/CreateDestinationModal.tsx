"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormField from "../common/FormField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { destinationSchema } from "@/schema/destination.model";
import { useCreateDestinationMutation } from "@/services/destinations/destinationApi";
import { z } from "zod";

type DestinationFormData = z.infer<typeof destinationSchema>;

export default function CreateDestinationModal() {
  const [open, setOpen] = useState(false);
  const [popularPlaces, setPopularPlaces] = useState<string[]>([""]);
  const [createDestination, { isLoading }] = useCreateDestinationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
  });

  const addPlace = () => setPopularPlaces([...popularPlaces, ""]);
  const removePlace = (index: number) => {
    const updated = popularPlaces.filter((_, i) => i !== index);
    setPopularPlaces(updated);
  };
  const updatePlace = (index: number, value: string) => {
    const updated = [...popularPlaces];
    updated[index] = value;
    setPopularPlaces(updated);
  };

  const onSubmit = async (data: DestinationFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("destinationLocation", data.destinationLocation);
      formData.append("image", data.image);
      formData.append("popularPlaces", JSON.stringify(popularPlaces.filter(p => p.trim())));

      const result = await createDestination(formData).unwrap();
      toast.success(result.message || "Destination created successfully");
      reset();
      setPopularPlaces([""]);
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create destination");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
          <Plus className="h-5 w-5" />
          Add Destination
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0b1120] text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Destination</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Title"
            name="title"
            placeholder="Enter destination title"
            register={register}
            error={errors.title}
            required
          />
          <FormField
            label="Description"
            name="description"
            placeholder="Enter destination description"
            register={register}
            error={errors.description}
            textarea
            required
          />
          <FormField
            label="Location"
            name="destinationLocation"
            placeholder="Enter location"
            register={register}
            error={errors.destinationLocation}
            required
          />
          <FormField
            label="Image"
            name="image"
            type="file"
            accept="image/*"
            register={register}
            error={errors.image}
            required
          />
          <div className="space-y-2">
            <Label className="text-zinc-300">
              Popular Places <span className="text-red-400">*</span>
            </Label>
            {popularPlaces.map((place, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={place}
                  onChange={(e) => updatePlace(index, e.target.value)}
                  placeholder={`Place ${index + 1}`}
                  className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                {popularPlaces.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePlace(index)}
                    className="border-white/10 bg-white/5 text-white hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addPlace}
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Place
            </Button>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
