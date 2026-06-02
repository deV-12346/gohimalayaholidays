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

import {
  useCreatePackageMutation,
} from "@/services/packages/packageApi";

import {
  useGetDestinationsQuery,
} from "@/services/destinations/destinationApi";

export default function CreatePackageModal() {

  const [open, setOpen] =
    useState(false);

  const [
    selectedDestination,
    setSelectedDestination,
  ] = useState("");

  const [
    includedServices,
    setIncludedServices,
  ] = useState<string[]>([""]);

  const [
    excludedServices,
    setExcludedServices,
  ] = useState<string[]>([""]);

  const [
    imagePreviews,
    setImagePreviews,
  ] = useState<string[]>([]);

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState<File[]>([]);

  const {
    data: destinationsData,
  } = useGetDestinationsQuery();

  const [
    createPackage,
    { isLoading },
  ] = useCreatePackageMutation();

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

    defaultValues: {
      includedService: [""],
      excludedService: [""],
    },
  });

  const addService = (
    type: "included" | "excluded"
  ) => {

    if (type === "included") {

      const updated = [
        ...includedServices,
        "",
      ];

      setIncludedServices(updated);

      setValue(
        "includedService",
        updated,
        {
          shouldValidate: true,
        }
      );

    } else {

      const updated = [
        ...excludedServices,
        "",
      ];

      setExcludedServices(updated);

      setValue(
        "excludedService",
        updated,
        {
          shouldValidate: true,
        }
      );
    }
  };

  const removeService = (
    type: "included" | "excluded",
    index: number
  ) => {

    if (type === "included") {

      const updated =
        includedServices.filter(
          (_, i) => i !== index
        );

      setIncludedServices(updated);

      setValue(
        "includedService",
        updated,
        {
          shouldValidate: true,
        }
      );

    } else {

      const updated =
        excludedServices.filter(
          (_, i) => i !== index
        );

      setExcludedServices(updated);

      setValue(
        "excludedService",
        updated,
        {
          shouldValidate: true,
        }
      );
    }
  };

  const updateService = (
    type: "included" | "excluded",
    index: number,
    value: string
  ) => {

    if (type === "included") {

      const updated = [
        ...includedServices,
      ];

      updated[index] = value;

      setIncludedServices(updated);

      setValue(
        "includedService",
        updated,
        {
          shouldValidate: true,
        }
      );

    } else {

      const updated = [
        ...excludedServices,
      ];

      updated[index] = value;

      setExcludedServices(updated);

      setValue(
        "excludedService",
        updated,
        {
          shouldValidate: true,
        }
      );
    }
  };

  const handleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = e.target.files;

    if (files) {

      const fileArray =
        Array.from(files);

      const validFiles: File[] = [];

      const previews: string[] = [];

      fileArray.forEach((file) => {

        validFiles.push(file);

        previews.push(
          URL.createObjectURL(file)
        );
      });

      setSelectedFiles(validFiles);

      setImagePreviews(previews);
    }
  };

  const removeImage = (
    index: number
  ) => {

    setSelectedFiles(
      selectedFiles.filter(
        (_, i) => i !== index
      )
    );

    setImagePreviews(
      imagePreviews.filter(
        (_, i) => i !== index
      )
    );
  };

  console.log(errors);

  const onSubmit =
   async (data: any) => {

    try {

      if (!selectedDestination) {

        toast.error(
          "Please select destination"
        );

        return;
      }

      if (
        selectedFiles.length === 0
      ) {

        toast.error(
          "Please upload images"
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "destinationId",
        selectedDestination
      );

      formData.append(
        "title",
        data.title
      );

      formData.append(
        "description",
        data.description
      );

      formData.append(
        "price",
        data.price
      );

      formData.append(
        "duration",
        data.duration
      );

      formData.append(
        "slots",
        data.slots
      );

      formData.append(
        "includedService",

        JSON.stringify(
          includedServices.filter(
            (s) => s.trim()
          )
        )
      );

      formData.append(
        "excludedService",

        JSON.stringify(
          excludedServices.filter(
            (s) => s.trim()
          )
        )
      );

      selectedFiles.forEach(
        (file) => {

          formData.append(
            "packageImages",
            file
          );
        }
      );

      const result =
       await createPackage(
        formData
       ).unwrap();

      toast.success(
        result.message
      );

      reset();

      setSelectedDestination("");

      setIncludedServices([""]);

      setExcludedServices([""]);

      setImagePreviews([]);

      setSelectedFiles([]);

      setOpen(false);

    } catch (error: any) {

      toast.error(
        error?.data?.message ||
        "Something went wrong"
      );
    }
  };

  const handleClose = () => {

    reset();

    setSelectedDestination("");

    setIncludedServices([""]);

    setExcludedServices([""]);

    setImagePreviews([]);

    setSelectedFiles([]);

    setOpen(false);
  };

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>

        <button
          className="
          flex
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          transition-all
          hover:scale-[1.02]
        "
        >

          <Plus className="h-5 w-5" />

          Add Package

        </button>

      </DialogTrigger>

      <DialogContent
        className="
        max-h-[90vh]
        overflow-y-auto
        border-white/10
        bg-[#0b1120]
        text-white
        sm:max-w-[700px]
      "
      >

        <DialogHeader>

          <DialogTitle
            className="
            text-2xl
            font-bold
          "
          >

            Create Package

          </DialogTitle>

        </DialogHeader>

        <form
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }
          className="space-y-4"
        >

          <div className="space-y-2">

            <Label>
              Destination
            </Label>

            <Select
              value={
                selectedDestination
              }
              onValueChange={
                setSelectedDestination
              }
            >

              <SelectTrigger
                className="
                border-white/10
                bg-white/5
                text-white
              "
              >

                <SelectValue
                  placeholder="Select destination"
                />

              </SelectTrigger>

              <SelectContent
                className="
                border-white/10
                bg-[#0b1120]
                text-white
              "
              >

                {destinationsData?.destinations?.map(
                  (destination: any) => (

                    <SelectItem
                      key={destination._id}
                      value={destination._id}
                    >

                      {destination.title}

                    </SelectItem>

                  )
                )}

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
            error={
              errors.description
            }
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

            <Label>
              Package Images
            </Label>

            <input
              type="file"
              multiple
              accept="
              image/png,
              image/jpeg,
              image/jpg,
              image/webp
              "
              onChange={
                handleImagesChange
              }
              className="
              hidden
            "
              id="packageImages"
            />

            <label
              htmlFor="packageImages"
              className="
              flex
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-white/10
              bg-white/5
              p-8
            "
            >

              <Upload
                className="
                h-10
                w-10
                text-zinc-500
              "
              />

              <p
                className="
                mt-2
                text-sm
                text-zinc-400
              "
              >
                Upload Images
              </p>

            </label>

            {imagePreviews.length > 0 && (

              <div
                className="
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-3
              "
              >

                {imagePreviews.map(
                  (
                    preview,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                    "
                    >

                      <div
                        className="
                        relative
                        h-32
                        w-full
                      "
                      >

                        <Image
                          src={preview}
                          alt="preview"
                          fill
                          className="object-cover"
                        />

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="
                        absolute
                        right-2
                        top-2
                        rounded-full
                        bg-red-500
                        p-1
                        text-white
                      "
                      >

                        <X className="h-4 w-4" />

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          <div className="space-y-3">

            <Label>
              Included Services
            </Label>

            {includedServices.map(
              (
                service,
                index
              ) => (

                <div
                  key={index}
                  className="
                  flex
                  gap-2
                "
                >

                  <Input
                    value={service}
                    onChange={(e)=>

                      updateService(
                        "included",
                        index,
                        e.target.value
                      )

                    }
                    placeholder={`Included Service ${index + 1}`}
                    className="
                    border-white/10
                    bg-white/5
                    text-white
                  "
                  />

                  {includedServices.length > 1 && (

                    <Button
                      type="button"
                      onClick={()=>

                        removeService(
                          "included",
                          index
                        )

                      }
                    >

                      <X className="h-4 w-4" />

                    </Button>

                  )}

                </div>

              )
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addService(
                  "included"
                )
              }
              className="
              w-full
              border-white/10
              bg-white/5
              text-white
              hover:bg-white/10
              hover:text-white
            "
            >

              <Plus className="mr-2 h-4 w-4" />

              Add Included Service

            </Button>

          </div>

          <div className="space-y-3">

            <Label>
              Excluded Services
            </Label>

            {excludedServices.map(
              (
                service,
                index
              ) => (

                <div
                  key={index}
                  className="
                  flex
                  gap-2
                "
                >

                  <Input
                    value={service}
                    onChange={(e)=>

                      updateService(
                        "excluded",
                        index,
                        e.target.value
                      )

                    }
                    placeholder={`Excluded Service ${index + 1}`}
                    className="
                    border-white/10
                    bg-white/5
                    text-white
                  "
                  />

                  {excludedServices.length > 1 && (

                    <Button
                      type="button"
                      onClick={()=>

                        removeService(
                          "excluded",
                          index
                        )

                      }
                    >

                      <X className="h-4 w-4" />

                    </Button>

                  )}

                </div>

              )
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                addService(
                  "excluded"
                )
              }
              className="
              w-full
              border-white/10
              bg-white/5
              text-white
              hover:bg-white/10
              hover:text-white
            "
            >

              <Plus className="mr-2 h-4 w-4" />

              Add Excluded Service

            </Button>

          </div>

          <div
            className="
            flex
            gap-3
            pt-4
          "
          >

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="
              flex-1
              border-white/10
              bg-white/5
              text-white
              hover:bg-white/10
              hover:text-white
            "
            >

              Cancel

            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="
              flex-1
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
            "
            >

              {isLoading ? (

                <>

                  <Loader2
                    className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                  />

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