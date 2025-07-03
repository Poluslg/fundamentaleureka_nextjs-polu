"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// const openai = new OpenAI({
//   // baseURL: "https://api.deepseek.com",
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.DEEPSEEK_API_KEY,
// });

const openai = new OpenAI({
  // baseURL: "https://api.deepseek.com",
  // baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
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
  // const prompt = `
  //  You are a Teacher and who ever write a message you need to answer them also elplened them with there topic about ${message} format the response as a single paragraph without any additional text or explanations.
  // `;
  // const instructionMEssage: any = {
  //   role: "system",
  //   content:
  //     "You are a code generator,You must answer only in markdown code snippet,Use code comments for explanation",
  // },
  // {
  // role: "user",
  // content:`You are a Teacher and who ever write a message you need to answer them also elplened them with there topic about ${message} ormat the response as a single paragraph without any additional text or explanations.` };
  // }
  // 6. Use language appropriate for the ${user.audience} level.

  if (message) {
    // const response = await openai.chat.completions.create({
    //   model: "deepseek/deepseek-r1:free",
    //   messages: [
    //     {
    //       role: "assistant",
    //       content: `You are a Teacher and who ever write a message you need to answer them also elplened them with there topic about ${message} ormat the response as a single paragraph without any additional text or explanations.`,
    //     },
    //     {
    //       role: "user",
    //       content: message,
    //     },
    //   ],
    // });
    // console.log(response);
 
    const result = await model.generateContent(message, {
      timeout: 10000,
    });
    const improvedContent = result?.response?.text?.() ? result.response.text().trim() : "Error: Unable to generate content.";

    // const completion = await openai.chat.completions.create({
    //   model: "deepseek/deepseek-r1:free",
    //   messages: [
    //     // { role: "system", content: "You are a helpful assistant." },
    //     {
    //       role: "user",
    //       content: message,
    //     },
    //   ],
    //   store: true,
    // });

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant." },
    //     {
    //       role: "user",
    //       content: message,
    //     },
    //   ],
    //   store: true,
    // });

    // const improvedContent = completion.choices[0].message.content;

    return improvedContent;

    // return;
  }
}
