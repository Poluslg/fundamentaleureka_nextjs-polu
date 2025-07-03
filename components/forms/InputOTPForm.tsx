"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const random = Math.floor(100000 + Math.random() * 900000);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const useremail = email;
    const otp = data.otp;
    setIsLoading(true);
    try {
      const response = await fetch("/api/verifyEmailForgotOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ useremail, otp }),
      });
      const data = await response.json();

      setIsLoading(false);
      if (data.message === "OTP Verify Successfully") {
        toast.success("OTP Verified Successfully");
        setIsLoading(false);
        router.push(`/updatepassword/${random}?email=${useremail}`);
      } else if (data.message === "OTP Expired") {
        toast.error("OTP Expired");
      } else if (data.message.startsWith("Invalid OTP. Attempts left:")) {
        const attemptsLeft = data.message.split(":")[1].trim();
        if (attemptsLeft === "0") {
          toast.error(`Invalid OTP. Attempts left: 0`);
          router.push("/auth/forgotpassword");
        } else {
          toast.error(`Invalid OTP. Attempts left: ${attemptsLeft}`);
        }
      } else if (data.message === "User Not Found") {
        toast.error("User not found");
      } else if (data.message === "Please try again later") {
        toast.error("Please try again later");
      } else {
        if (data.message === "OTP Verify Successfully")
          toast.error("OTP Verified Successfully");
        router.push(`/updatepassword/${random}?email=${useremail}`);
        // toast.error("Invalid OTP");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg z-10 bg-muted"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  pattern={REGEXP_ONLY_DIGITS}
                  className="w-full"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border border-white" />
                    <InputOTPSlot index={1} className="border border-white" />
                    <InputOTPSlot index={2} className="border border-white" />
                    <InputOTPSlot index={3} className="border border-white" />
                    <InputOTPSlot index={4} className="border border-white" />
                    <InputOTPSlot index={5} className="border border-white" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isloading}
          className=" text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          {!isloading ? (
            " Verify OTP"
          ) : (
            <Loader2Icon className="animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
}
