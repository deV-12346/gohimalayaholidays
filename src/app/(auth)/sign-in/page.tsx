"use client"

import Image from "next/image"
import logo from "@/../public/logo.png"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod"
import { signinSchema } from "@/schema/sign-in.schema"
export default function SignInPage() {
  const {register,handleSubmit,formState:{errors}} = useForm<z.infer <typeof signinSchema>>({
    resolver:zodResolver(signinSchema),
    defaultValues:{
      identifier:"",
      password:""
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data:z.infer<typeof signinSchema>) => {
      setLoading(true)
      const res = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect:false
      })
      console.log(res)
      if (res?.error) {
            setLoading(false)
            toast.error(res.error)
      }
      if (res?.ok) {
          setLoading(false)
          toast.success("Log in success")
          router.replace("/admin/dashboard")
      }
  }

  return (

    <section className="relative flex min-h-screen items-center 
    justify-center overflow-hidden bg-black px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Card */}
      <div
        className="
          relative z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/10
          p-8
          shadow-2xl
          backdrop-blur-xl
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
        <div className="mt-6 text-center">

          <h1
            className="
              text-3xl
              font-bold
              text-white
            "
          >
            Admin Sign In
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-gray-300
            "
          >
            Welcome back to Go Himalaya Holidays
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-6"
        >
          {/* Email */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-200
              "
            >
              Email
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-4
              "
            >

              <Mail
                size={18}
                className="text-gray-300"
              />

              <input
                type="email"
                {...register("identifier")}
                placeholder="Enter your email"
                className="
                  w-full
                  bg-transparent
                  px-4
                  py-4
                  text-white
                  outline-none
                  placeholder:text-gray-400
                "
              />
              {
                errors.identifier && (
                  <span className="text-sm text-red-400 
                  font-medium">{errors.identifier.message}</span>
                )
              }
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-200
              "
            >
              Password
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-4
              "
            >
              <Lock
                size={18}
                className="text-gray-300"
              />
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                {...register("password")}
                placeholder="Enter your password"
                className="
                  w-full
                  bg-transparent
                  px-4
                  py-4
                  text-white
                  outline-none
                  placeholder:text-gray-400
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
             
                {
                  showPassword
                    ? (
                      <EyeOff
                        size={18}
                        className="text-gray-300"
                      />
                    )
                    : (
                      <Eye
                        size={18}
                        className="text-gray-300"
                      />
                    )
                }

              </button>

            </div>
             {
                errors.password && (
                  <span className="text-sm text-red-400 
                  font-medium">{errors.password.message}</span>
                )
              }
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-2xl
              bg-indigo-600
              py-4
              font-semibold
              text-white
              transition
              hover:bg-indigo-500
              disabled:opacity-70
            "
          >

            {
              loading
                ? "Signing In..."
                : "Sign In"
            }

          </button>

        </form>

      </div>

    </section>
  )
}