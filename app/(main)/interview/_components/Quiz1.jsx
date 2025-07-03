"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import saveQuizeResult, { getGenerateQuiz } from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import { BarChart, LucideLoaderPinwheel, Minus, Plus } from "lucide-react";
import QuizResult from "./QuizResult";
import { Progress } from "@/components/ui/progress";
import { Bar, ResponsiveContainer } from "recharts";

export default function Quiz1() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState(20);
  const [quistionsCount, setQuistionsCount] = useState(10);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(getGenerateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizeResult);

  console.log(resultData);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setProgress(80), 5000);
    return () => clearTimeout(timer);
  }, [generatingQuiz]);

  const StartQuize = async () => {
    console.log("Starting quiz with questions count:", quistionsCount);
    try {
      await generateQuizFn(quistionsCount);
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz");
    }
  };

  if (generatingQuiz) {
    return (
      <Progress className="mt-4" width={"100%"} color="gray" value={progress} />
    );
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-2">
            This quiz contains some questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
          <Drawer>
            <DrawerTrigger className="w-full">
              <Button className="w-full">Start Quiz</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    How Meny Quistions You Want
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Please choose the number of questions you want to take.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => setQuistionsCount(quistionsCount - 10)}
                      disabled={quistionsCount <= 10}
                    >
                      <Minus />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-7xl font-bold tracking-tighter">
                        {quistionsCount}
                      </div>
                      <div className="text-[0.70rem] uppercase text-muted-foreground">
                        Quistions
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => setQuistionsCount(quistionsCount + 10)}
                      disabled={quistionsCount >= 100}
                    >
                      <Plus />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                  <div className="mt-3 h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quistionsCount}>
                        <Bar
                          dataKey="goal"
                          style={{
                            fill: "hsl(var(--foreground))",
                            opacity: 0.9,
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <DrawerFooter className="w-full max-w-sm mx-auto">
                <Button onClick={StartQuize}>Start Quiz</Button>
                <DrawerClose className="w-full ">
                  <Button variant="outline" className="w-full  ">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </CardContent>
        <CardFooter>
          {/* <Button onClick={generateQuizFn} className="w-full">
            Start Quiz
          </Button> */}
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult && (
            <LucideLoaderPinwheel className="animate-spin mt-4" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
