"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  buttonName?: string;
};

function ForgotPasswordForm({ buttonName }: Props) {
  const [isEmail, setIsEmail] = useState(false);

  const FormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const onsubmit = async (values: z.infer<typeof FormSchema>) => {
    const email = values.email;
    if (email) setIsEmail(true);

    try {
      const response = await fetch("/api/forgotpassword", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();
      if (data.message === "OTP send To Your Email") {
        toast.success("OTP send To Your Email");
        setIsEmail(false);
        router.push(`/auth/forgotpasswordinputotp?email=${email}`);
      } else if (data.message === "Email not Found") {
        toast.error("User not found");
        setIsEmail(false);
      } else {
        toast.error("Please try again latter");
        setIsEmail(false);
      }
    } catch {
      toast.error("Please try again latter");
      setIsEmail(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-muted rounded-xl shadow-lg z-10 border">
        {errors.email && errors.email.message}
        <button
          onClick={() => router.back()}
          className="text-cyan-600 focus:ring-cyan-500 text-xs flex items-center gap-2 w-12"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back
        </button>
        <form onSubmit={handleSubmit(onsubmit)}>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            type="email"
            {...register("email", { required: true })}
            autoComplete="email"
            className="appearance-none rounded-md relative block w-full px-3 py-2 my-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
          <button
            disabled={isEmail}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            {!isEmail ? (
              buttonName ? (
                buttonName
              ) : (
                "Verify Email"
              )
            ) : (
              <Loader2Icon className="animate-spin" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
