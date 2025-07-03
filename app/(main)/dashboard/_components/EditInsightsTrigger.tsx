import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditInsight from "./EditInsight";

// type SalaryRange = {
//   role: string;
//   min: number;
//   max: number;
//   median: number;
// };

// type Insights = {
//   id: string;
//   salaryRanges: SalaryRange[];
//   marketOutlook: string | null;
//   lastUpdated: Date;
//   nextUpdate: Date | null;
//   industry: string;
//   growthRate: number | null;
//   demandLevel: string | null;
//   topSkills: string[];
//   keyTrends: string[];
//   recommendedSkills: string[];
// };

type User = {
  id: string;
  name: string;
  email: string;
  industry: string;
  subIndustry?: string;
  bio?: string;
  experience?: number;
  skills?: Array<string>;
};

export default function EditInsightsTrigger({ user }: { user: User }) {
  //   const handleEditInsights = () => {
  //     if (!insights) {
  //       toast.error("No insights data available to edit.");
  //       return;
  //     }
  //   };

  return (
    <Dialog>
      <DialogTrigger className="font-semibold border h-10 w-44 rounded hover:bg-muted-foreground bg-gray-400">
        Edit Insights
      </DialogTrigger>
      <DialogContent className=" overflow-y-auto h-full">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will change your Indrustry
            Insights
          </DialogDescription>
        </DialogHeader>
        <EditInsight user={user} />
      </DialogContent>
    </Dialog>
  );
}
