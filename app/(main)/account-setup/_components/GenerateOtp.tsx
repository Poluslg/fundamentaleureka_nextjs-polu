"use client";
import { generateOtp } from "@/actions/user";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function GenerateOtp() {
  const { data: session } = useSession();
  const { loading: sendOtpLoading, fn: sendOtpFn } = useFetch(generateOtp);
  const router = useRouter();
  const handleSendOtp = async () => {
    try {
      await sendOtpFn();
      toast.success("OTP sent to your email");
      router.push("/account-setup");
    } catch {
      toast.error("Failed to send OTP");
    }
  };
  return (
    <div className="max-w-md w-full space-y-6 p-8 rounded-lg shadow-md z-10 bg-muted/50 backdrop-blur-md">
      <h1 className="text-lg font-semibold ">{session?.user?.email}</h1>
      <Button
        onClick={handleSendOtp}
        className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${
          sendOtpLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
      >
        {sendOtpLoading ? (
          <span className="ml-2">Sending...</span>
        ) : (
          <span>Send OTP</span>
        )}
      </Button>
    </div>
  );
}

export default GenerateOtp;
