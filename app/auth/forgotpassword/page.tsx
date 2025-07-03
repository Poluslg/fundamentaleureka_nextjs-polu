import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import { Loader2Icon } from "lucide-react";
// import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function page() {
  // const searchParams = useSearchParams();
  // const buttonname = searchParams.get("resetpassword");
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full place-content-center place-items-center">
          <Loader2Icon className="animate-spin" size={30} />
        </div>
      }
    >
      <div className="grid-background "></div>
      <ForgotPasswordForm />;
    </Suspense>
  );
}

export default page;
