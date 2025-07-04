"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const model = genAi.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function getGenerateQuiz(quistionsCount: number) {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const prompt = `
  Generate ${quistionsCount} technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
  
  Each question should be multiple choice with 4 options.
  
  Return the response in this JSON format only, no additional text:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
`;
    const completion = await openRouter.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const rawText = completion.choices[0]?.message?.content || "";
    // Remove markdown formatting like ```json
    const cleaned = rawText
      .replace(/```(?:json)?\n?([\s\S]*?)```/, "$1")
      .trim();
    // const result = await model.generateContent(prompt);
    // const response = result.response;
    // const text = response.text();
    // const cleneText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quize = JSON.parse(cleaned);
    return quize.questions;
  } catch (error) {
    throw new Error("Failed to generate quiz");
  }
}
async function saveQuizeResult(question: any, answers: string, score: number) {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");

  interface Question {
    question: string;
    correctAnswer: string;
    explanation: string;
  }

  interface QuestionResult {
    question: string;
    answer: string;
    userAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }

  const questionResult: QuestionResult[] = question.map(
    (q: Question, index: number) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    })
  );

  const wrongAnswer = questionResult.filter((q) => !q.isCorrect);

  let improvementTip = null;
  if (wrongAnswer.length > 0) {
    const wrongQuestionsText = wrongAnswer
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
    The user got the following ${user.industry} technical interview questions wrong:

    ${wrongQuestionsText}

    Based on these mistakes, provide a concise, specific improvement tip.
    Focus on the knowledge gaps revealed by these wrong answers.
    Keep the response under 2 sentences and make it encouraging.
    Don't explicitly mention the mistakes, instead focus on what to learn/practice.
  `;

    try {
      const completion = await openRouter.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content: improvementPrompt,
          },
        ],
      });
      const rawText = completion.choices[0]?.message?.content || "";
      const cleaned = rawText
        .replace(/```(?:json)?\n?([\s\S]*?)```/, "$1")
        .trim();
      improvementTip = cleaned;
    } catch (error) {
      console.log(error);
    }
  }
  try {
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResult.map((q) => ({
          question: q.question,
          answer: q.answer,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
          explanation: q.explanation,
        })),
        category: "Technical Interview",
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    throw new Error("Failed to save assessment");
  }
}
export default saveQuizeResult;

export async function getAssessments() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");

  try {
    const assessment = await prisma.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return assessment;
  } catch {
    throw new Error("Failed to get assessments");
  }
}
