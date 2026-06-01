"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminSchema } from "@/schema/admin.schema";
import { useAddAdminMutation } from "@/services/admin/adminApi";
import { FormField } from "@/components/admin/common/FormField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

type AdminFormData = z.infer<typeof adminSchema>;

interface AddAdminFormProps {
  onSuccess: () => void;
}

export default function AddAdminForm({ onSuccess }: AddAdminFormProps) {
  const [addAdmin, { isLoading }] = useAddAdminMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminFormData) => {
    try {
      const res = await addAdmin(data).unwrap();
      toast.success(res.message || "Admin created successfully");
      reset();
      onSuccess();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to create admin");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 pt-4">
      <FormField
        label="Admin Name"
        placeholder="e.g. John Doe"
        required
        error={errors.adminName?.message}
        {...register("adminName")}
      />
      <FormField
        label="Email"
        type="email"
        placeholder="admin@example.com"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Phone Number"
        placeholder="10-digit mobile number"
        required
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      <FormField
        label="Password"
        type="password"
        placeholder="Min 12 chars, uppercase, number, special"
        required
        error={errors.password?.message}
        {...register("password")}
      />
      <DialogFooter className="pt-2 px-0">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
          ) : (
            "Create Admin"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
