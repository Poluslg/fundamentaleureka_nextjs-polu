"use client";
import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  return (
    <div>
      <UpdatePasswordForm email={email as string} />
    </div>
  );
}

export default Page;
