"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
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

export default function CreateDestinationModal() {
  const [open, setOpen] = useState(false);
  const [popularPlaces, setPopularPlaces] = useState<string[]>([""]);
  const [placeErrors, setPlaceErrors] = useState<boolean[]>([false]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createDestination, { isLoading }] = useCreateDestinationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(destinationSchema.omit({ image: true })),
    defaultValues: {
      popularPlaces: [""],
    },
  });

  const addPlace = () => {
    const updated = [...popularPlaces, ""];
    setPopularPlaces(updated);
    setPlaceErrors([...placeErrors, false]);
    setValue("popularPlaces", updated);
  };
  
  const removePlace = (index: number) => {
    const updated = popularPlaces.filter((_, i) => i !== index);
    const updatedErrors = placeErrors.filter((_, i) => i !== index);
    setPopularPlaces(updated);
    setPlaceErrors(updatedErrors);
    setValue("popularPlaces", updated);
  };
  
  const updatePlace = (index: number, value: string) => {
    const updated = [...popularPlaces];
    updated[index] = value;
    setPopularPlaces(updated);
    setValue("popularPlaces", updated);

    if (value.trim()) {
      const updatedErrors = [...placeErrors];
      updatedErrors[index] = false;
      setPlaceErrors(updatedErrors);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, JPEG, and WEBP images are allowed");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    const fileInput = document.querySelector<HTMLInputElement>('input[name="image"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };
    console.log(errors)
  const onSubmit = async (data: any) => {
    try {
      // Validate popular places dynamically
      let hasError = false;
      const newErrors = popularPlaces.map((place) => {
        if (!place.trim()) {
          hasError = true;
          return true;
        }
        return false;
      });

      if (hasError) {
        setPlaceErrors(newErrors);
        toast.error("Please fill all the popular places fields");
        return;
      }

      if (!selectedFile) {
        toast.error("Please select an image");
        return;
      }

      const validPlaces = popularPlaces.filter(p => p.trim());
      if (validPlaces.length === 0) {
        toast.error("Please add at least one popular place");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("destinationLocation", data.destinationLocation);
      formData.append("image", selectedFile);
      formData.append("popularPlaces", JSON.stringify(validPlaces));

      console.log("Submitting destination with:", {
        title: data.title,
        description: data.description,
        destinationLocation: data.destinationLocation,
        image: selectedFile.name,
        popularPlaces: validPlaces
      });

      const result = await createDestination(formData).unwrap();
      toast.success(result.message || "Destination created successfully");
      
      // Reset form
      reset();
      setPopularPlaces([""]);
      setPlaceErrors([false]);
      setImagePreview(null);
      setSelectedFile(null);
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating destination:", error);
      
      // Show specific validation errors
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create destination");
      }
    }
  };
   console.log("set erro",placeErrors)
  const handleClose = () => {
    reset();
    setPopularPlaces([""]);
    setPlaceErrors([false]);
    setImagePreview(null);
    setSelectedFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
          <Plus className="h-5 w-5" />
          Add Destination
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white text-gray-900 sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Create Destination</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-900">
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
          
          {/* Image Upload with Preview */}
          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">
              Image <span className="text-red-500">*</span>
            </Label>
            
            {!imagePreview ? (
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  id="destination-image"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="destination-image"
                  className="flex cursor-pointer text-gray-900 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-cyan-500 hover:bg-gray-100/50"
                >
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Click to upload image
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG, WEBP (Max 5MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-6 top-6 rounded-full bg-red-500 p-2 text-white transition-all hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-2 text-sm font-medium text-gray-600">
                  {selectedFile?.name}
                </p>
              </div>
            )}
          </div>

          {/* Popular Places */}
          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">
              Popular Places <span className="text-red-500">*</span>
            </Label>
            {popularPlaces.map((place, index) => (
              <div key={index} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    value={place}
                    onChange={(e) => updatePlace(index, e.target.value)}
                    placeholder={`Place ${index + 1}`}
                    className={`bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
                      ${placeErrors[index] 
                        ? "border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500" 
                        : "border-zinc-300 focus-visible:ring-orange-500/30 focus-visible:border-orange-500"
                      }`}
                  />
                  {popularPlaces.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removePlace(index)}
                      className="border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {placeErrors[index] && (
                  <p className="text-xs font-medium text-red-500">
                    This place field cannot be empty
                  </p>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addPlace}
              className="w-full border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
            >
              <Plus className="mr-2 h-4 w-4 text-gray-500" />
              Add Place
            </Button>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 font-medium shadow-sm"
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