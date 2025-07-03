"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuizResult from "./QuizResult";

type Props = { assessments: Assessment[] };

type QuestionType = {
  question: string;
  userAnswer: string;
  answer: string;
  explanation: string;
  isCorrect: boolean;
};
type Assessment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  quizScore: number;
  category: string;
  improvementTip: string | null;
  questions: unknown[];
};

type Result = {
  quizScore: number;
  improvementTip: string;
  questions: QuestionType[];
};
function QuizList({ assessments }: Props) {
  const getAssessmentsInOrder = () => {
    return assessments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getAssessmentsInOrder().map(
              (assessment: Assessment, index: number) => {
                return (
                  <Card
                    key={assessment.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedQuiz(assessment)}
                  >
                    <CardHeader>
                      <CardTitle>Quiz {index + 1}</CardTitle>
                      <CardDescription className="flex justify-between w-full">
                        <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                        <div>
                          {format(
                            new Date(assessment.createdAt),
                            "MMMM dd, yyyy h:mm a"
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {assessment.improvementTip}
                      </p>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{/* Are you absolutely sure? */}</DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz as Result}
            onStartNew={() => router.push("/interview/mock")}
            hideStartNew={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuizList;
