import { getResume } from "@/actions/resume";
import React from "react";
import ResumeBuilder from "./_components/ResumeBuilder";

async function Page() {
  const resume = await getResume();
  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}

export default Page;
