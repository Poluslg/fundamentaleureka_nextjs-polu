"use client";
import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState<string | null>(null);

  useEffect(() => {
    setOtp(sessionStorage.getItem("resetOtp"));
  }, []);

  return (
    <div>
      <UpdatePasswordForm email={email as string} otp={otp} />
    </div>
  );
}

export default Page;
