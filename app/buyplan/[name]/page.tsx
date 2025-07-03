import FreePlan from "@/components/Plans/FreePlan";
import PremiumPlan from "@/components/Plans/PremiumPlan";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";

async function Page({ params }: { params: Promise<{ name: string }> }) {
  const slug = (await params).name;
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full place-content-center place-items-center">
          <Loader2Icon className="animate-spin" size={30} />
        </div>
      }
    >
      {slug === "FREE" ? <FreePlan /> : <PremiumPlan />}
    </Suspense>
  );
}

export default Page;
