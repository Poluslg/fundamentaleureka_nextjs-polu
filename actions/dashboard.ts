"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAi.getGenerativeModel({
  model: "gemini-3-flash-preview",
  // generationConfig: {
  //   maxOutputTokens: 140,
  //   temperature: 0.4,
  // },
});


// const openRouter = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

export const generateAiInsights = async (industry: string) => {
  const prompt = `
  Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  {
    "salaryRanges": [
      { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": "High" | "Medium" | "Low",
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": "Positive" | "Neutral" | "Negative",
    "keyTrends": ["trend1", "trend2"],
    "recommendedSkills": ["skill1", "skill2"]
  }

  IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
  Include at least 5 common roles for salary ranges.
  Growth rate should be a percentage.
  Include at least 5 skills and trends.
  `;

  const result = await model.generateContent(prompt, {
    timeout: 10000,
  });

  const improvedContent = result?.response?.text?.()
    ? result.response.text().trim()
    : "I could not generate an answer. Please try again.";

  const cleaned = improvedContent.replace(/```(?:json)?\n?([\s\S]*?)```/, "$1").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parsing error:", err);
    throw new Error("Failed to parse AI response as JSON.");
  }
};

export async function getIndurstryInsights() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      IndustryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");

  if (!user?.IndustryInsight) {
    const insights = await generateAiInsights(user?.industry!);
    const industryInsight = await prisma.industryInsight.create({
      data: {
        industry: user?.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return industryInsight;
  }
  return user.IndustryInsight;
}
