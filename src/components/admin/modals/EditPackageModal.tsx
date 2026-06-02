"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, X, Upload, Plus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormField from "../common/FormField";
import { packageSchema } from "@/schema/package.schema";
import { useUpdatePackageMutation } from "@/services/packages/packageApi";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import type { Package } from "@/services/packages/packageApi";

interface EditPackageModalProps {
  pkg: Package;
}

export default function EditPackageModal({ pkg }: EditPackageModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [excludedServices, setExcludedServices] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { data: destinationsData } = useGetDestinationsQuery();
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(
      packageSchema.omit({
        packageImages: true,
        destinationId: true,
      })
    ),
  });

  useEffect(() => {
    if (open) {
      // Extract destinationId from pkg
      const destId = typeof pkg.destinationId === 'string' 
        ? pkg.destinationId 
        : pkg.destinationId._id;
      
      setSelectedDestination(destId);
      setValue("title", pkg.title);
      setValue("description", pkg.description);
      setValue("price", pkg.price);
      setValue("slots", pkg.slots);
      setValue("duration", pkg.duration);
      setIncludedServices(pkg.includedService || [""]);
      setExcludedServices(pkg.excludedService || [""]);
      
      // Set existing images as previews
      const existingPreviews = pkg.packageImages.map(img => img.secure_url);
      setImagePreviews(existingPreviews);
      setSelectedFiles([]);
    }
  }, [open, pkg, setValue]);

  const addService = (type: "included" | "excluded") => {
    if (type === "included") {
      const updated = [...includedServices, ""];
      setIncludedServices(updated);
      setValue("includedService", updated, { shouldValidate: true });
    } else {
      const updated = [...excludedServices, ""];
      setExcludedServices(updated);
      setValue("excludedService", updated, { shouldValidate: true });
    }
  };

  const removeService = (type: "included" | "excluded", index: number) => {
    if (type === "included") {
      if (includedServices.length > 1) {
        const updated = includedServices.filter((_, i) => i !== index);
        setIncludedServices(updated);
        setValue("includedService", updated, { shouldValidate: true });
      }
    } else {
      if (excludedServices.length > 1) {
        const updated = excludedServices.filter((_, i) => i !== index);
        setExcludedServices(updated);
        setValue("excludedService", updated, { shouldValidate: true });
      }
    }
  };

  const updateService = (type: "included" | "excluded", index: number, value: string) => {
    if (type === "included") {
      const updated = [...includedServices];
      updated[index] = value;
      setIncludedServices(updated);
      setValue("includedService", updated, { shouldValidate: true });
    } else {
      const updated = [...excludedServices];
      updated[index] = value;
      setExcludedServices(updated);
      setValue("excludedService", updated, { shouldValidate: true });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const previews: string[] = [];

      fileArray.forEach((file) => {
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
          toast.error("Only PNG, JPG, JPEG, and WEBP images are allowed");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      });

      setSelectedFiles(validFiles);
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const revertToOriginalImages = () => {
    setSelectedFiles([]);
    const existingPreviews = pkg.packageImages.map(img => img.secure_url);
    setImagePreviews(existingPreviews);
    const fileInput = document.querySelector<HTMLInputElement>('input[id="packageImages-edit"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (!selectedDestination) {
        toast.error("Please select destination");
        return;
      }

      const validIncluded = includedServices.filter(s => s.trim());
      const validExcluded = excludedServices.filter(s => s.trim());

      if (validIncluded.length === 0) {
        toast.error("Please add at least one included service");
        return;
      }

      const formData = new FormData();
      formData.append("packageId", pkg._id);
      formData.append("destinationId", selectedDestination);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("duration", data.duration);
      formData.append("slots", data.slots);
      formData.append("includedService", JSON.stringify(validIncluded));
      formData.append("excludedService", JSON.stringify(validExcluded));

      // Only append new images if user selected new files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("packageImages", file);
        });
      }

      const result = await updatePackage(formData).unwrap();
      toast.success(result.message || "Package updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update package");
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0b1120] text-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Package</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Destination <span className="text-red-400">*</span></Label>
            <Select value={selectedDestination} onValueChange={setSelectedDestination}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0b1120] text-white">
                {destinationsData?.destinations?.map((destination: any) => (
                  <SelectItem key={destination._id} value={destination._id}>
                    {destination.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            label="Title"
            name="title"
            placeholder="Enter package title"
            register={register}
            error={errors.title}
            required
          />

          <FormField
            label="Description"
            name="description"
            placeholder="Enter package description"
            register={register}
            error={errors.description}
            textarea
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Price"
              name="price"
              type="number"
              placeholder="5000"
              register={register}
              error={errors.price}
              required
            />
            <FormField
              label="Slots"
              name="slots"
              type="number"
              placeholder="20"
              register={register}
              error={errors.slots}
              required
            />
            <FormField
              label="Duration"
              name="duration"
              type="number"
              placeholder="5"
              register={register}
              error={errors.duration}
              required
            />
          </div>

          {/* Package Images */}
          <div className="space-y-2">
            <Label className="text-zinc-300">
              Package Images {selectedFiles.length === 0 && <span className="text-xs text-zinc-500">(optional - current images will be kept)</span>}
            </Label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative overflow-hidden rounded-2xl border border-white/10">
                    <div className="relative h-32 w-full">
                      <Image src={preview} alt="preview" fill className="object-cover" />
                    </div>
                    {selectedFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500/90 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImagesChange}
                  className="hidden"
                  id="packageImages-edit"
                />
                <label
                  htmlFor="packageImages-edit"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-400 transition-colors hover:border-cyan-500/50 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4" />
                  {selectedFiles.length > 0 ? `${selectedFiles.length} new images selected` : "Change images"}
                </label>
              </div>
              {selectedFiles.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={revertToOriginalImages}
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  Revert
                </Button>
              )}
            </div>
          </div>

          {/* Included Services */}
          <div className="space-y-3">
            <Label className="text-zinc-300">
              Included Services <span className="text-red-400">*</span>
            </Label>
            {includedServices.map((service, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={service}
                  onChange={(e) => updateService("included", index, e.target.value)}
                  placeholder={`Included Service ${index + 1}`}
                  className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                {includedServices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeService("included", index)}
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
              onClick={() => addService("included")}
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Included Service
            </Button>
          </div>

          {/* Excluded Services */}
          <div className="space-y-3">
            <Label className="text-zinc-300">Excluded Services</Label>
            {excludedServices.map((service, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={service}
                  onChange={(e) => updateService("excluded", index, e.target.value)}
                  placeholder={`Excluded Service ${index + 1}`}
                  className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
                {excludedServices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeService("excluded", index)}
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
              onClick={() => addService("excluded")}
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Excluded Service
            </Button>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
                  Updating...
                </>
              ) : (
                "Update Package"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
