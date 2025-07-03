import { InputOTPForm } from "@/components/forms/InputOTPForm";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full place-content-center place-items-center">
          <Loader2Icon className="animate-spin" size={30} />
        </div>
      }
    >
      <div className="grid-background "></div>
      <div className="h-screen w-full place-content-center place-items-center ">
        <InputOTPForm />
      </div>
    </Suspense>
  );
}

export default Page;
