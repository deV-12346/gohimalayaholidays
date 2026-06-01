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
import { useCreatePackageMutation } from "@/services/packages/packageApi";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import { z } from "zod";

type PackageFormData = z.infer<typeof packageSchema>;

export default function CreatePackageModal() {
  const [open, setOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [includedServices, setIncludedServices] = useState<string[]>([""]);
  const [excludedServices, setExcludedServices] = useState<string[]>([""]);
  
  const { data: destinationsData } = useGetDestinationsQuery();
  const [createPackage, { isLoading }] = useCreatePackageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
  });

  const addService = (type: "included" | "excluded") => {
    if (type === "included") setIncludedServices([...includedServices, ""]);
    else setExcludedServices([...excludedServices, ""]);
  };

  const removeService = (type: "included" | "excluded", index: number) => {
    if (type === "included") {
      setIncludedServices(includedServices.filter((_, i) => i !== index));
    } else {
      setExcludedServices(excludedServices.filter((_, i) => i !== index));
    }
  };

  const updateService = (type: "included" | "excluded", index: number, value: string) => {
    if (type === "included") {
      const updated = [...includedServices];
      updated[index] = value;
      setIncludedServices(updated);
    } else {
      const updated = [...excludedServices];
      updated[index] = value;
      setExcludedServices(updated);
    }
  };

  const onSubmit = async (data: PackageFormData) => {
    try {
      const formData = new FormData();
      formData.append("destinationId", selectedDestination);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("slots", data.slots.toString());
      formData.append("duration", data.duration.toString());

      includedServices.filter(s => s.trim()).forEach(service => {
        formData.append("includedService", service);
      });
      excludedServices.filter(s => s.trim()).forEach(service => {
        formData.append("excludedService", service);
      });

      if (data.packageImages && data.packageImages.length > 0) {
        Array.from(data.packageImages).forEach((file) => {
          formData.append("packageImages", file);
        });
      }

      const result = await createPackage(formData).unwrap();
      toast.success(result.message || "Package created successfully");
      reset();
      setSelectedDestination("");
      setIncludedServices([""]);
      setExcludedServices([""]);
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
          <Plus className="h-5 w-5" />
          Add Package
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0b1120] text-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Package</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">
              Destination <span className="text-red-400">*</span>
            </Label>
            <Select value={selectedDestination} onValueChange={setSelectedDestination}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0b1120] text-white">
                {destinationsData?.destinations.map((dest) => (
                  <SelectItem key={dest._id} value={dest._id}>
                    {dest.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            label="Package Title"
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
              label="Price (₹)"
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
              placeholder="10"
              register={register}
              error={errors.slots}
              required
            />
            <FormField
              label="Duration (days)"
              name="duration"
              type="number"
              placeholder="5"
              register={register}
              error={errors.duration}
              required
            />
          </div>
          <FormField
            label="Package Images"
            name="packageImages"
            type="file"
            accept="image/*"
            register={register}
            error={errors.packageImages}
            required
          />

          <div className="space-y-2">
            <Label className="text-zinc-300">Included Services</Label>
            {includedServices.map((service, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={service}
                  onChange={(e) => updateService("included", index, e.target.value)}
                  placeholder={`Service ${index + 1}`}
                  className="border-white/10 bg-white/5 text-white"
                />
                {includedServices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeService("included", index)}
                    className="border-white/10 bg-white/5 text-white"
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
              className="w-full border-white/10 bg-white/5 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Excluded Services</Label>
            {excludedServices.map((service, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={service}
                  onChange={(e) => updateService("excluded", index, e.target.value)}
                  placeholder={`Service ${index + 1}`}
                  className="border-white/10 bg-white/5 text-white"
                />
                {excludedServices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeService("excluded", index)}
                    className="border-white/10 bg-white/5 text-white"
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
              className="w-full border-white/10 bg-white/5 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-white/10 bg-white/5 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedDestination}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Package"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
