import { getUserOnBoardingStatus } from "@/actions/user";
import CompleteProfile from "@/components/forms/CompleteProfile";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const { isOnBoarded } = await getUserOnBoardingStatus();
  if (isOnBoarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <CompleteProfile />
    </main>
  );
}

export default Page;
