"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
// import Cookies from "js-cookie";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleSignInButton from "../GoogleSignInButton";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string(),
});

const SignInForm = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // if (rememberMe) {
    //   Cookies.set("userEmail", values.email, { expires: 7 }); // Expires in 7 days
    // } else {
    //   Cookies.set("userEmail", values.email); // Expires at session end
    // }
    const singinData = {
      email: values.email,
      password: values.password,
    };
    console.log(singinData);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <Link
          href="/"
          className="text-cyan-600 focus:ring-cyan-500 text-xs flex items-center gap-2 w-12"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back
        </Link>

        <div className="flex flex-col items-center">
          <Image
            src="/NextGenGuidance_transparent.png"
            alt="NextGenGuidance"
            width={200}
            height={200}
            priority
            quality={100}
            className="h-36 w-36 rounded-full border border-black"
          />
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form
            className="mt-8 space-y-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                {errors.email && (
                  <p className="text-red-300 font-semibold text-sm">
                    {errors.email.message}
                  </p>
                )}
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  {...register("email", { required: true })}
                  autoComplete="email"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
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
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 z-20"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgotpassword"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
         
        </div>
        <div className="pt-5">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;