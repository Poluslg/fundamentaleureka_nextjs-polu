"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon, TrophyIcon } from "lucide-react";
import React from "react";

type Assessment = {
  createdAt: Date;
  updatedAt: Date;
  quizScore: number;
  questions: unknown[];
  id: string;
  userId: string;
  category: string;
  improvementTip: string | null;
};

type Props = { assessments: Assessment[] };

function StatsCards({ assessments }: Props) {
  const getAvarageScore = () => {
    if (!assessments.length) return 0;
    const total = assessments.reduce(
      (sum: number, assessment: Assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(2);
  };

  const getLatestAssessment = () => {
    if (!assessments.length) return null;
    return assessments[0];
  };

  // const getTotalNumberQuistions = () => {
  //   if (!assessments.length) return 0;
  //   return assessments.reduce(
  //     (sum: number, assessment: Assessment) =>
  //       sum + assessment.questions.length,
  //     0
  //   );
  // };

  const getTotalNumberQuests = () => {
    if (!assessments.length) return 0;
    return assessments.length;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avarage Score</CardTitle>
          <TrophyIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAvarageScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Accross All Assessments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Quiz Practiced
          </CardTitle>
          <BrainIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalNumberQuests()}</div>
          <p className="text-xs text-muted-foreground">Total Quiz</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Letest Score</CardTitle>
          <TrophyIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            Most recent quiz score
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsCards;
