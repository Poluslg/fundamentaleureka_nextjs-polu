import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircleIcon, Trophy, XCircleIcon } from "lucide-react";
import React from "react";

type Result = {
  quizScore: number;
  improvementTip: string;
  questions: Q[];
};

type Q={
  question: string;
  userAnswer: string;
  answer: string;
  explanation: string;
  isCorrect: boolean;
}

type Props = {
  result: Result;
  hideStartNew: false;
  onStartNew: () => void;
};

function QuizResult({ result, hideStartNew, onStartNew }: Props) {
  if (!result) return null;
  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">
            {result?.quizScore.toFixed(1)}%
            <Progress value={result.quizScore} className={"w-full h-4"} />
          </h3>
        </div>

        {result?.improvementTip && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-medium">Improvement Tip</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium">Quistion Review</h3>
          {result?.questions.map((q: Q, index: number) => (
            <div key={index} className="border p-4 rounded-lg space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Your answer : {q.userAnswer}</p>
                {!q.isCorrect && <p>Correct answer : {q.answer}</p>}
              </div>

              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation</p>
                <p>{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="flex justify-center mt-4">
          <Button onClick={onStartNew} className="btn btn-primary">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}

export default QuizResult;
