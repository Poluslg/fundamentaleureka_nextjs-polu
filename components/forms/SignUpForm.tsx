"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    phone: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits")
      .regex(/^\d+$/, "Phone number must contain only numbers"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof FormSchema>;

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: FormData) => {
    try {
      const response = await fetch("/api/signup", {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      toast.success(data.message);
      router.push("/auth/login");
    } catch {
      console.log("Error signing up:");
    }
  };

  return (
    <div className="flex min-h-screen  items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 rounded-xl bg-muted shadow-lg z-10">
        <h2 className="mt-6 text-center text-3xl font-bold text-muted-foreground">
          Sign Up
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-cyan-600 hover:text-cyan-500">
            Log in
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <input
              id="username"
              type=""
              {...register("username")}
              className="appearance-none rounded-md block w-full px-3 py-2 border border-muted placeholder-gray-500 text-muted-foreground focus:outline-none  sm:text-sm"
              placeholder="Full Name"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="phone"
              type="number"
              {...register("phone")}
              className="appearance-none rounded-md block w-full px-3 py-2 border border-muted placeholder-gray-500 text-muted-foreground focus:outline-none  sm:text-sm"
              placeholder="Phone Number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="appearance-none rounded-md block w-full px-3 py-2 border border-muted placeholder-gray-500 text-muted-foreground focus:outline-none  sm:text-sm"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="appearance-none rounded-md block w-full px-3 py-2 border border-muted placeholder-gray-500 text-muted-foreground focus:outline-none  sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="appearance-none rounded-md block w-full px-3 py-2 border border-muted placeholder-gray-500 text-muted-foreground focus:outline-none  sm:text-sm"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
