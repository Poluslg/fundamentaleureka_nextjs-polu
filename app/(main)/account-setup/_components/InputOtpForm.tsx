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
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { generateOtp, verifyOtp } from "@/actions/user";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOtpForm() {
  const { data: session } = useSession();

  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    loading: VerifyOtpLoading,
    fn: VerifyOtpFn,
    data: VerifyOtpdata,
  } = useFetch(verifyOtp);

  const { loading: sendOtpLoading, fn: sendOtpFn } = useFetch(generateOtp);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const otp = data.otp;
    try {
      await VerifyOtpFn(otp);
      if (VerifyOtpdata === "Otp Varified Successfully") {
        toast.success("Otp Varified Successfully");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to verify OTP. Please try again later.");
    } finally {
      router.push("/dashboard");
    }
  };

  // const countDownTime = () => {
  //   try {
  //     setTime(initialTime);
  //     const timer = setInterval(() => {
  //       setTime((prev) => {
  //         if (prev === 0) {
  //           clearInterval(timer);
  //           return 0;
  //         } else {
  //           return prev - 1;
  //         }
  //       });
  //     }, 1000);
  //     setIsDisabled(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   setIsDisabled(false);
  // };

  const handleClick = async () => {
    try {
      await sendOtpFn();
      toast.success("OTP sent to your email");
      router.push("/account-setup");
    } catch {
      toast.error("Failed to send OTP");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg z-10 bg-muted/50"
      >
        <Button
          variant={"link"}
          className="text-cyan-600"
          onClick={() => router.back()}
        >
          <AiOutlineArrowLeft />
          <span className="text-xs">Back</span>
        </Button>
        <h1 className="text-cyan-300 font-semibold">{session?.user?.email}</h1>

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
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={VerifyOtpLoading}
            className=" text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            {!VerifyOtpLoading ? (
              " Verify OTP"
            ) : (
              <Loader2Icon className="animate-spin" />
            )}
          </Button>
          <Button
            type="button"
            variant={"link"}
            onClick={handleClick}
            disabled={sendOtpLoading}
          >
            Resend OTP
          </Button>
        </div>
      </form>
    </Form>
  );
}
