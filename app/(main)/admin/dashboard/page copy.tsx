import { getIndurstryInsights } from "@/actions/dashboard";
import {
  getUserAccountSetup,
  getUserOnBoardingStatus,
  getUserRole,
} from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/DashboardView";

type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
};

type Insights = {
  id: string;
  salaryRanges: SalaryRange[];
  marketOutlook: string | null;
  lastUpdated: Date;
  nextUpdate: Date | null;
  industry: string;
  growthRate: number | null;
  demandLevel: string | null;
  topSkills: string[];
  keyTrends: string[];
  recommendedSkills: string[];
};

async function Page() {
  const { isOnBoarded } = await getUserOnBoardingStatus();
  const { isAccountSetup } = await getUserAccountSetup();
  const role = await getUserRole();
  if (!isAccountSetup) {
    redirect("/account-setup");
  }
  if (!isOnBoarded) {
    redirect("/complete-profile");
  }
  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  }
  const insights = await getIndurstryInsights();
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights as Insights} />
    </div>
  );
}

export default Page;
