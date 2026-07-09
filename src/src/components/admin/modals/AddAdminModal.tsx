"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
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
import { adminSchema } from "@/schema/admin.schema";
import { useAddAdminMutation } from "@/services/admin/adminApi";
import { z } from "zod";

type AdminFormData = z.infer<typeof adminSchema>;

export default function AddAdminModal() {
  const [open, setOpen] = useState(false);
  const [addAdmin, { isLoading }] = useAddAdminMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminFormData) => {
    try {
      const result = await addAdmin(data).unwrap();
      toast.success(result.message || "Admin created successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create admin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
          <Plus className="h-5 w-5" />
          Create New Admin
        </button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0b1120] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Admin Name"
            name="adminName"
            placeholder="Enter admin name"
            register={register}
            error={errors.adminName}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            register={register}
            error={errors.email}
            required
          />
          <FormField
            label="Phone Number"
            name="phoneNumber"
            placeholder="1234567890"
            register={register}
            error={errors.phoneNumber}
            required
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            register={register}
            error={errors.password}
            required
          />
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
                "Create Admin"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
