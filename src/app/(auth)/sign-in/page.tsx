"use client";

import Image from "next/image";
import logo from "@/../public/logo.png";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { signinSchema } from "@/schema/sign-in.schema";
import FormField from "@/components/admin/common/FormField";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoading(true);
    const res = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    console.log(res);
    if (res?.error) {
      setLoading(false);
      toast.error(res.error);
    }
    if (res?.ok) {
      setLoading(false);
      toast.success("Log in success");
      router.replace("/admin/dashboard");
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 bg-gray-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/5" />
      {/* Card */}
      <div
        className="
          relative z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-zinc-200
          p-8
          shadow-2xl
          backdrop-blur-xl
          bg-white
          text-gray-900
        "
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="logo"
            width={90}
            height={90}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mt-4 text-center ">
          <h1 className="text-3xl font-bold text-gray-900">Admin Sign In</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back to Go Himalaya Holidays
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-2">
          {/* Email / Identifier */}
          <FormField
            label="Email"
            name="identifier"
            type="email"
            placeholder="Enter your email"
            register={register}
            error={errors.identifier}
            required
            isEnquiryModal={true}
          />

          {/* Password */}
          <div className="relative w-full">
            <FormField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              required
              isEnquiryModal={true}
            />
            {/* Absolute toggle button adjusted for light background alignment */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[46px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-2xl
              bg-gray-800
              py-4
              font-semibold
              text-white
              transition
              hover:bg-gray-500
              disabled:opacity-70
              shadow-sm
              cursor-pointer
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}