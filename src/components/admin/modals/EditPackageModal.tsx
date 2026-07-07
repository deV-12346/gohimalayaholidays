"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, X, Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FormField from "../common/FormField";
import { editPackageSchema, PackageType } from "@/schema/package.schema";
import { useUpdatePackageMutation } from "@/services/packages/packageApi";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import DynamicInputFields from "../common/DynamicInputField";
import type { Package } from "@/services/packages/packageApi"; // adjust if your type name differs

interface EditPackageModalProps {
  packageData: Package;
}

export default function EditPackageModal({ packageData }: EditPackageModalProps) {
  const [open, setOpen] = useState(false);
  console.log("packageData",packageData)
  // existing images already on the server (Cloudinary URLs, etc.)
  const [existingImages, setExistingImages] = useState<{secure_url:string}[]>(
    packageData?.packageImages?.map((img: any) => img.url ?? img) || []
  );
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const { data: destinationsData } = useGetDestinationsQuery();
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<PackageType>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: {
      destinationId: packageData?.destinationId?._id ?? "--",
      title: packageData?.title ?? "--",
      description: packageData?.description ?? "--",
      price: String(packageData?.price),
      duration: String(packageData?.duration),
      slots: String(packageData?.slots),
      includedService: packageData?.includedService?.length ? packageData?.includedService : [""],
      excludedService: packageData?.excludedService?.length ? packageData?.excludedService : [""],
      packageImages: [], // only NEW files live here; existing images tracked separately
      placesCovered: packageData?.placesCovered?.length ? packageData?.placesCovered : [""],
      itinerary: packageData?.itinerary ?? {day:1,description:""}
    },
  });

  // reactive destinationId value for the Select — getValues() would NOT re-render the UI on change
  const destinationId = useWatch({ control, name: "destinationId" });

  const { fields: itineraryFields } = useFieldArray({ control, name: "itinerary" as any });
  console.log("errors",errors)
  // re-sync form + local image state whenever modal opens or packageData changes
  useEffect(() => {
    if (open) {
      reset({
        destinationId: packageData.destinationId._id,
        title: packageData.title,
        description: packageData.description,
        price: String(packageData.price),
        duration: String(packageData.duration),
        slots: String(packageData.slots),
        includedService: packageData.includedService?.length ? packageData.includedService : [""],
        excludedService: packageData.excludedService?.length ? packageData.excludedService : [""],
        packageImages: [],
        placesCovered: packageData.placesCovered?.length ? packageData.placesCovered : [""],
        itinerary: packageData.itinerary?.length
          ? packageData.itinerary
          : [{ day: 1, description: "" }],
      });

      setExistingImages(packageData.packageImages?.map((img: any) => img.url ?? img) || []);
      setRemovedExistingImages([]);
      setNewImagePreviews([]);
      setNewFiles([]);
    }
  }, [open, packageData, reset]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewFiles((prev) => [...prev, ...fileArray]);
      setNewImagePreviews((prev) => [
        ...prev,
        ...fileArray.map((f) => URL.createObjectURL(f)),
      ]);
      setValue("packageImages", [...newFiles, ...fileArray], { shouldValidate: true });
    }
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img.secure_url !== url));
    setRemovedExistingImages((prev) => [...prev, url]);
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedFiles);
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setValue("packageImages", updatedFiles, { shouldValidate: true });
  };
  console.log("error",errors)
  console.log(existingImages,"existing images")
  const onSubmit = async (data: PackageType) => {
    console.log("data",data)
    try {
      if (!data.destinationId) {
        toast.error("Please select destination");
        return;
      }
      if (existingImages.length === 0 && newFiles.length === 0) {
        toast.error("Please keep or upload at least one image");
        return;
      }

      const formData = new FormData();
      formData.append("packageId", packageData._id);
      formData.append("destinationId", data.destinationId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("duration", String(data.duration));
      formData.append("slots", String(data.slots));

      getValues()
        .includedService.filter((s) => s.trim())
        .forEach((s) => formData.append("includedService", s));

      getValues()
        .excludedService.filter((s) => s.trim())
        .forEach((s) => formData.append("excludedService", s));

      getValues()
        .placesCovered.filter((p) => p.trim())
        .forEach((p) => formData.append("placesCovered", p));

      getValues().itinerary.forEach((it) =>
        formData.append("itinerary", JSON.stringify(it))
      );

      // tell backend which existing images survived / were removed
      existingImages.forEach((url) => formData.append("existingImages", url.secure_url));
      removedExistingImages.forEach((url) => formData.append("removedImages", url));

      // new files to upload
      newFiles.forEach((file) => formData.append("packageImages", file));

      const result = await updatePackage(formData).unwrap();
      toast.success(result.message || "Package updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleClose = () => {
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
            <Label>Destination</Label>
            <Select
              value={destinationId}
              onValueChange={(val) => setValue("destinationId", val, { shouldValidate: true })}
            >
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0b1120] text-white border-zinc-300">
                {destinationsData?.destinations?.map((destination: any) => (
                  <SelectItem key={destination._id} value={destination._id}>
                    {destination.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinationId && (
              <p className="text-xs font-medium text-red-500">
                {String(errors.destinationId.message)}
              </p>
            )}
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

          <div className="space-y-2">
            <Label>Package Images</Label>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {existingImages.map((img) => (
                  <div key={img.secure_url} className="relative overflow-hidden rounded-2xl border border-white/10">
                    <div className="relative h-32 w-full">
                      <Image src={img.secure_url} alt="existing" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.secure_url)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImagesChange}
              className="hidden"
              id="packageImagesEdit"
            />
            <label
              htmlFor="packageImagesEdit"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-8"
            >
              <Upload className="h-10 w-10 text-zinc-500" />
              <p className="mt-2 text-sm text-zinc-400">Add More Images</p>
            </label>

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative overflow-hidden rounded-2xl border border-white/10">
                    <div className="relative h-32 w-full">
                      <Image src={preview} alt="new preview" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DynamicInputFields
            control={control}
            register={register}
            name="includedService"
            label="Included Services"
            placeholder="Include Service"
            errors={errors}
          />

          <DynamicInputFields
            control={control}
            register={register}
            name="excludedService"
            label="Excluded Services"
            placeholder="Exclude Service"
            errors={errors}
          />

          <DynamicInputFields
            control={control}
            register={register}
            name="placesCovered"
            label="Places Covered"
            errors={errors}
            placeholder="Place"
          />

          <DynamicInputFields
            control={control}
            register={register}
            name="itinerary"
            label="Days Description"
            placeholder="Days Description"
            errors={errors}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
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