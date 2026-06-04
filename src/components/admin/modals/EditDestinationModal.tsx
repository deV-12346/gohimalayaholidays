"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import FormField from "../common/FormField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { destinationSchema } from "@/schema/destination.model";
import { useUpdateDestinationMutation } from "@/services/destinations/destinationApi";
import type { Destination } from "@/services/destinations/destinationApi";

interface EditDestinationModalProps {
  destination: Destination;
}

export default function EditDestinationModal({
  destination,
}: EditDestinationModalProps) {
  const [open, setOpen] = useState(false);

  const [popularPlaces, setPopularPlaces] =
    useState<string[]>(
      destination.popularPlaces || [""]
    );

  const [imagePreview, setImagePreview] =
    useState<string | null>(
      destination.image
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [
    updateDestination,
    { isLoading },
  ] = useUpdateDestinationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(
      destinationSchema.omit({
        image: true,
      })
    ),

    defaultValues: {
      title: destination.title,
      description:
        destination.description,
      destinationLocation:
        destination.destinationLocation,
      popularPlaces:
        destination.popularPlaces ||
        [""],
    },
  });

  useEffect(() => {
    if (open) {
      setValue(
        "title",
        destination.title
      );

      setValue(
        "description",
        destination.description
      );

      setValue(
        "destinationLocation",
        destination.destinationLocation
      );

      setValue(
        "popularPlaces",
        destination.popularPlaces ||
          [""]
      );

      setPopularPlaces(
        destination.popularPlaces ||
          [""]
      );

      setImagePreview(
        destination.image
      );

      setSelectedFile(null);
    }
  }, [
    open,
    destination,
    setValue,
  ]);

  const addPlace = () => {
    const updated = [
      ...popularPlaces,
      "",
    ];

    setPopularPlaces(updated);

    setValue(
      "popularPlaces",
      updated
    );
  };

  const removePlace = (
    index: number
  ) => {
    if (popularPlaces.length > 1) {
      const updated =
        popularPlaces.filter(
          (_, i) => i !== index
        );

      setPopularPlaces(updated);

      setValue(
        "popularPlaces",
        updated
      );
    }
  };

  const updatePlace = (
    index: number,
    value: string
  ) => {
    const updated = [
      ...popularPlaces,
    ];

    updated[index] = value;

    setPopularPlaces(updated);

    setValue(
      "popularPlaces",
      updated
    );
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (
        !validTypes.includes(
          file.type
        )
      ) {
        toast.error(
          "Only PNG, JPG, JPEG, and WEBP images are allowed"
        );

        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        toast.error(
          "Image size should be less than 5MB"
        );

        return;
      }

      setSelectedFile(file);

      const reader =
        new FileReader();

      reader.onloadend = () => {
        setImagePreview(
          reader.result as string
        );
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);

    setImagePreview(
      destination.image
    );

    const fileInput =
      document.querySelector<HTMLInputElement>(
        'input[name="image-edit"]'
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  console.log(errors);

  const onSubmit = async (
    data: any
  ) => {
    try {
      const validPlaces =
        popularPlaces.filter((p) =>
          p.trim()
        );

      if (
        validPlaces.length === 0
      ) {
        toast.error(
          "Please add at least one popular place"
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "destinationId",
        destination._id
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
        "destinationLocation",
        data.destinationLocation
      );

      formData.append(
        "popularPlaces",
        JSON.stringify(
          validPlaces
        )
      );

      if (selectedFile) {
        formData.append(
          "image",
          selectedFile
        );
      }

      const result =
        await updateDestination(
          formData
        ).unwrap();

      toast.success(
        result.message ||
          "Destination updated successfully"
      );

      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to update destination"
      );
    }
  };

  const handleClose = () => {
    reset();

    setPopularPlaces(
      destination.popularPlaces ||
        [""]
    );

    setValue(
      "popularPlaces",
      destination.popularPlaces ||
        [""]
    );

    setImagePreview(
      destination.image
    );

    setSelectedFile(null);

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="
            border-blue-500/30
            bg-blue-500/10
            text-blue-400
            hover:bg-blue-500/20
          "
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          border-white/10
          bg-[#0b1120]
          text-white
          sm:max-w-[600px]
        "
      >
        <DialogHeader>
          <DialogTitle
            className="
              text-2xl
              font-bold
            "
          >
            Edit Destination
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
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
            error={
              errors.description
            }
            textarea
            required
          />

          <FormField
            label="Location"
            name="destinationLocation"
            placeholder="Enter location"
            register={register}
            error={
              errors.destinationLocation
            }
            required
          />

          <div className="space-y-2">
            <Label className="text-zinc-300">
              Image{" "}
              {!selectedFile && (
                <span
                  className="
                    text-xs
                    text-zinc-500
                  "
                >
                  (
                  optional -
                  current image
                  will be
                  kept)
                </span>
              )}
            </Label>

            <div
              className="
                relative
                rounded-lg
                border
                border-white/10
                bg-white/5
                p-4
              "
            >
              <div
                className="
                  relative
                  h-48
                  w-full
                  overflow-hidden
                  rounded-lg
                "
              >
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {selectedFile && (
                <button
                  type="button"
                  onClick={
                    removeImage
                  }
                  className="
                    absolute
                    right-6
                    top-6
                    rounded-full
                    bg-red-500/90
                    p-2
                    text-white
                    transition-all
                    hover:bg-red-600
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="mt-3">
                <input
                  type="file"
                  name="image-edit"
                  id="destination-image-edit"
                  accept="
                    image/png,
                    image/jpeg,
                    image/jpg,
                    image/webp
                  "
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />

                <label
                  htmlFor="destination-image-edit"
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-white/10
                    bg-white/5
                    p-2
                    text-sm
                    text-zinc-400
                    transition-colors
                    hover:border-cyan-500/50
                    hover:bg-white/10
                  "
                >
                  <Upload className="h-4 w-4" />

                  {selectedFile
                    ? selectedFile.name
                    : "Change image"}
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">
              Popular Places{" "}
              <span className="text-red-400">
                *
              </span>
            </Label>

            {popularPlaces.map(
              (
                place,
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
                    value={place}
                    onChange={(
                      e
                    ) =>
                      updatePlace(
                        index,
                        e.target
                          .value
                      )
                    }
                    placeholder={`Place ${
                      index + 1
                    }`}
                    className="
                      border-white/10
                      bg-white/5
                      text-white
                      placeholder:text-zinc-500
                    "
                  />

                  {popularPlaces.length >
                    1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        removePlace(
                          index
                        )
                      }
                      className="
                        border-white/10
                        bg-white/5
                        text-white
                        hover:bg-red-500/20
                      "
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
              onClick={addPlace}
              className="
                w-full
                border-white/10
                bg-white/5
                text-white
                hover:bg-white/10
              "
            >
              <X
                className="
                  mr-2
                  h-4
                  w-4
                  rotate-45
                "
              />

              Add Place
            </Button>

            {errors.popularPlaces && (
              <p
                className="
                  text-sm
                  text-red-400
                "
              >
                {
                  errors
                    .popularPlaces
                    ?.message as string
                }
              </p>
            )}
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
                text-white
                hover:opacity-90
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

                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}