"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const model = genAi.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const openai = new OpenAI({
//   // baseURL: "https://api.deepseek.com",
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.DEEPSEEK_API_KEY,
// });
const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function saveResume(content: string) {
  if (!content) throw new Error("Content is required to save resume");
  const session = await auth();
  if (!session?.user?.id) throw new Error("User session not found");
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) throw new Error("User not found in database");

    const resume = await prisma.resume.upsert({
      where: { userId: user.id },
      update: { content: content }, // Convert object to JSON string
      create: { userId: user.id, content: content },
    });
    revalidatePath("/resume");

    return resume;
  } catch (error) {
    throw new Error("Failed to save resume: " + error);
  }
}

export async function getResume() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("User session not found");

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found in database");

    const resume = await prisma.resume.findUnique({
      where: { userId: user.id },
    });
    return resume;
  } catch (error) {
    throw new Error("Failed to fetch resume: " + error);
  }
}

export async function inproveWithAi({
  current,
  type,
}: {
  current: string;
  type: string;
}) {
  console.log("debugger", type);
  const session = await auth();
  if (!session?.user?.email) throw new Error("User session not found");

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found in database");
    let prompt = "";
    if (type === "summary") {
      prompt = `As an expert resume writer, improve the following ${type}.description for a ${user.industry} professional. generate a professional summary tailored for a ${user.experience} experience level. Incorporate the following skills: ${user.skills}. Use the provided input as a base: "${current}" and enhance it to be more compelling, concise, and polished. Ensure the summary is formatted as a single paragraph without any additional text or explanations. Maintain a confident and professional tone.`;
    } else if (type === "experience") {
      // prompt = `As an expert resume writer, improve the following ${type} description for a ${user.industry} professional. generate a professional experience tailored for a ${user.experience} experience level.  Use the provided input as a base: "${current}" and enhance it to be more compelling, concise, and polished. Ensure the experience is formatted as a single paragraph without any additional text or explanations. Maintain a confident and professional tone.`;
      // prompt = `Generate a professional and polished description for someone currently working as a ${current}. Highlight their key responsibilities, expertise, and contributions in a compelling and concise manner. Ensure the description is formatted as a single paragraph without any additional text or explanations. Maintain a confident and professional tone.`;
      // prompt = `Generate a professional and polished description for user currently working as a ${current}. Highlight their key responsibilities, expertise, and contributions in a compelling and concise manner. Incorporate the following if user provide any skills in there ${current} then use it or else user skills: ${user.skills}. Ensure the description is formatted as a single paragraph without any additional text or explanations. Maintain a confident and professional tone.`;
      prompt = `Improve the ${current} with Ensure the description is formatted as a single paragraph write 2-3 line without any additional text or explanations. Maintain a confident and professional tone.`;
    } else {
      prompt = `   As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
       Make it more impactful, quantifiable, and aligned with industry standards.
       Current content: "${current}"

       Requirements:
       1. Use action verbs
       2. Include metrics and results where possible
       3. Highlight relevant technical skills
       4. Keep it concise but detailed
       5. Focus on achievements over responsibilities
       6. Use industry-specific keywords

       Format the response as a single paragraph without any additional text or explanations.
    `;
    }

    // const prompt = `
    //   As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    //   Make it more impactful, quantifiable, and aligned with industry standards.
    //   Current content: "${current}"

    //   Requirements:
    //   1. Use action verbs
    //   2. Include metrics and results where possible
    //   3. Highlight relevant technical skills
    //   4. Keep it concise but detailed
    //   5. Focus on achievements over responsibilities
    //   6. Use industry-specific keywords

    //   Format the response as a single paragraph without any additional text or explanations.
    // `;

    // const completion = await openai.chat.completions.create({
    //   model: "deepseek/deepseek-r1:free",
    //   messages: [
    //     { role: "system", content: `As an expert resume writer, improve the following ${type} description for a ${user.industry} professional Ensure the description is formatted as a single paragraph write 2-3 line without any additional text or explanations. Maintain a confident and professional tone. ` },
    //     {
    //       role: "user",
    //       content: current,
    //     },
    //   ],
    //   store: true,
    // });
    // const improvedContent = completion.choices[0].message.content;

    // console.log(prompt)
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
    const cleaned = rawText
      .replace(/```(?:json)?\n?([\s\S]*?)```/, "$1")
      .trim();
    // const result = await model.generateContent(prompt);
    // const improvedContent = result.response.text().trim();

    return cleaned;
  } catch (error) {
    throw new Error("Failed to improve content: " + error);
  }
}
