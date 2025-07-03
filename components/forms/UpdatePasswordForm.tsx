"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

type Props = { email: string };

function UpdatePasswordForm({ email }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, showConfirmPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const FormSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const password = values.password;
    try {
      const response = await fetch("/api/updatepassword", {
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();
      setIsLoading(false);
      if (data.message === "Password Sucessfully Update") {
        toast.success("Password Sucessfully Update");
        setIsLoading(false);
        router.push("/login");
      } else if (data.message === "something went wrong") {
        toast.error("something went wrong");
        setIsLoading(false);
      } else {
        toast.error("Please try again latter");
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex min-h-screen  items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-muted rounded-xl shadow-lg z-10">
        <button
          onClick={() => router.back()}
          className="text-cyan-600 focus:ring-cyan-500 text-xs flex items-center gap-2 w-12"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back
        </button>
        <div className="flex flex-col items-center">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Create a New Password
            </h2>
          </div>
          <form
            className="mt-8 space-y-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-1">
              <div>
                {errors.password && (
                  <p className="text-red-300 font-semibold text-sm py-1">
                    {errors.password.message}
                  </p>
                )}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    {...register("password", { required: true })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-9 appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 z-20"
                    >
                      {!showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {errors.confirmPassword && (
                  <p className="text-red-300 font-semibold text-sm py-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
                <div className="relative">
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    {...register("confirmPassword", { required: true })}
                    type={showconfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-9 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bay-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button
                      type="button"
                      onClick={() => showConfirmPassword(!showconfirmPassword)}
                      className="text-gray-400 z-20"
                    >
                      {!showconfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                {!isloading ? (
                  "Create a new Password"
                ) : (
                  <Loader2Icon className="animate-spin" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordForm;
