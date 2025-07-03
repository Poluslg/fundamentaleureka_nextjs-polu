import { checkOtp, getUserAccountSetup } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import GenerateOtp from "./_components/GenerateOtp";
import { InputOtpForm } from "./_components/InputOtpForm";

async function Page() {
  const { isAccountSetup } = await getUserAccountSetup();
  if (isAccountSetup) {
    redirect("/dashboard");
  }

  const { isOtpAviable } = await checkOtp();
  return (
    <div className="h-[70vh] flex items-center justify-center">
      {isOtpAviable ? <InputOtpForm /> : <GenerateOtp />}
    </div>
  );
}

export default Page;
