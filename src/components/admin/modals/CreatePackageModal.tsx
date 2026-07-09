"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FormField from "../common/FormField";
import { packageSchema, PackageType } from "@/schema/package.schema";
import { useCreatePackageMutation } from "@/services/packages/packageApi";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import DynamicInputFields from "../common/DynamicInputField";

export default function CreatePackageModal() {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: destinationsData } = useGetDestinationsQuery();
  const [createPackage, { isLoading }] = useCreatePackageMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm<PackageType>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      destinationId: "",
      title: "",
      description: "",
      price: "",
      duration: "",
      slots: "",
      includedService: [""],
      excludedService: [""],
      packageImages: [],
      placesCovered: [""],
      itinerary: [{
        day: 1,
        description: "",
      }]
    },
  });

  const { fields: placesFields, append: appendPlace, remove: removePlace, } = useFieldArray({ control, name : "placesCovered" as any, });
  const { fields: includesFields, append: appendIncludeServices, remove: removeIncludeServices, } = useFieldArray({ control, name: "includedService" as any, });
  const { fields: excludesFields, append: appendExcludeServices, remove: removeExcludeServices, } = useFieldArray({ control, name: "excludedService" as any, });
  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary, } = useFieldArray({ control, name: "itinerary" as any, });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      setImagePreviews(fileArray.map((f) => URL.createObjectURL(f)));
      setValue("packageImages", fileArray, { shouldValidate: true });
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };
  
  console.log("errror",errors)
  console.log(getValues());
  
  const onSubmit = async (data: PackageType) => {
    try {
      if (!data.destinationId) {
        toast.error("Please select destination");
        return;
      }
      if (selectedFiles.length === 0) {
        toast.error("Please upload images");
        return;
      }
      const formData = new FormData();
      formData.append("destinationId", data.destinationId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price",String(data.price));
      formData.append("duration",String(data.duration));
      formData.append("slots",String(data.slots));
      getValues().includedService.filter((service)=>service.trim())
      .forEach((s)=>formData.append("includedService",s))
      getValues().excludedService.filter((service)=>service.trim())
      .forEach((s)=>formData.append("excludedService",s))
      getValues().placesCovered.filter((place)=>place.trim())
      .forEach((p)=>formData.append("placesCovered",p))
      getValues().placesCovered.filter((place)=>place.trim())
      .forEach((p)=>formData.append("placesCovered",p))
      getValues().itinerary.forEach((p)=>formData.append("itinerary",JSON.stringify(p)))
      selectedFiles.forEach((file) => {
        formData.append("packageImages", file);
      });
      const result = await createPackage(formData).unwrap();
      toast.success(result.message);
      reset();
      setImagePreviews([]);
      setSelectedFiles([]);
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleClose = () => {
    reset();
    setImagePreviews([]);
    setSelectedFiles([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
          <Plus className="h-5 w-5" />
          Add Package
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-300 bg-white text-black sm:max-w-[700px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">Create Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
          <div className="space-y-2">
            <Label className="text-gray-700 text-sm font-medium">Destination</Label>
            <Select value={getValues().destinationId} onValueChange={(val)=>{
                setValue("destinationId", val, { shouldValidate: true });  
            }}>
              <SelectTrigger className="w-full h-12 rounded-xl border border-zinc-300 bg-white/10 px-4 text-sm text-black transition-all duration-200 focus:visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:border-orange-500">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="border border-zinc-300 bg-white text-black">
                {destinationsData?.destinations?.map((destination: any) => (
                  <SelectItem key={destination._id} value={destination._id} className="focus:bg-gray-100 focus:text-black">
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
            <Label className="text-gray-700 text-sm font-medium">Package Images</Label>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImagesChange}
              className="hidden"
              id="packageImages"
            />
            <label
              htmlFor="packageImages"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-zinc-300 bg-white/10 p-8 transition-all duration-200 hover:border-orange-500 hover:bg-gray-50"
            >
              <Upload className="h-10 w-10 text-zinc-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">Upload Images</p>
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl border border-zinc-300">
                    <div className="relative h-32 w-full">
                      <Image src={preview} alt="preview" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-all hover:bg-red-600"
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
              className="flex-1 h-12 rounded-xl border border-zinc-300 bg-white text-gray-7700 hover:bg-gray-50 font-medium transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 font-medium shadow-sm transition-all"
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