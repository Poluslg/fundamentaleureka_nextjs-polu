"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const QUIZ_MODEL_CANDIDATES = [
  "gemini-3.5-flash",
];

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

function isRetryableAiError(error: unknown) {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return /503|429|500|Service Unavailable|high demand|temporar|aborted|timeout|deadline/i.test(
    message
  );
}

async function generateWithRetry(prompt: string) {
  let lastError: unknown = null;

  for (const modelName of QUIZ_MODEL_CANDIDATES) {
    const model = genAi.getGenerativeModel({
      model: modelName,
    });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await model.generateContent(prompt, {
          timeout: 30000,
        });
      } catch (error) {
        lastError = error;
        const canRetry = isRetryableAiError(error) && attempt < 3;
        if (canRetry) {
          await wait(400 * attempt);
          continue;
        }
        if (!isRetryableAiError(error)) {
          break;
        }
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("AI service unavailable");
}

export async function getGenerateQuiz(quistionsCount: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const email = session.user.email;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");

  const totalQuestions = Number(quistionsCount) || 10;
  const safeQuestionCount = Math.min(Math.max(totalQuestions, 5), 30);
  const safeIndustry = user.industry?.trim() || "software";

  try {
    const prompt = `
  Generate ${safeQuestionCount} technical interview questions for a ${safeIndustry
      } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
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

    const result = await generateWithRetry(prompt);
    const improvedContent = result?.response?.text?.()
      ? result.response.text().trim()
      : "";

    const cleaned = improvedContent
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonBlockMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonText = jsonBlockMatch ? jsonBlockMatch[0] : cleaned;
    const quize = JSON.parse(jsonText);
    if (!quize || !Array.isArray(quize.questions) || quize.questions.length === 0) {
      throw new Error("AI returned an invalid questions format");
    }

    return quize.questions;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown generation error";
    throw new Error(`Failed to generate quiz: ${message}`);
  }
}
async function saveQuizeResult(question: any, answers: string, score: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const email = session.user.email;
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
      const completion = await generateWithRetry(improvementPrompt);

      const improvedContent = completion?.response?.text?.()
        ? completion.response.text().trim()
        : "I could not generate an answer. Please try again.";

      const cleaned = improvedContent
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
  if (!session?.user?.email) throw new Error("Unauthorized");
  const email = session.user.email;
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
