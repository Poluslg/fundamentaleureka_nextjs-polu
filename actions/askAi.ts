"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAi.getGenerativeModel({
  model: "gemini-3-flash-preview",
  // generationConfig: {
  //   maxOutputTokens: 140,
  //   temperature: 0.4,
  // },
});



export async function askAiQuestion({ message }: { message: string }) {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");


  const cleanMessage = message?.trim();
  if (!cleanMessage) return "Please ask a question.";

  const prompt = `You are Fundamental Eureka AI Tutor.
Help students with study questions in simple words.
Rules:
- Keep response short: max 3 bullet points or 4 short lines.
- Be direct and practical.
- If the question is unclear, ask one short clarifying question.
- Avoid long explanations.

Student question: ${cleanMessage}`;

  const result = await model.generateContent(prompt, {
    timeout: 10000,
  });

  const improvedContent = result?.response?.text?.()
    ? result.response.text().trim()
    : "I could not generate an answer. Please try again.";

  return improvedContent;
}
