"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
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
import { changePassword } from "@/schema/changepassword.schema";
import { useChangePasswordMutation } from "@/services/admin/adminApi";
import { z } from "zod";

type PasswordFormData = z.infer<typeof changePassword>;

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(changePassword),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const result = await changePasswordMutation(data).unwrap();
      toast.success(result.message || "Password changed successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
          <KeyRound className="h-5 w-5" />
          Change Password
        </button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0b1120] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            register={register}
            error={errors.newPassword}
            required
          />
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            register={register}
            error={errors.confirmPassword}
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
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
