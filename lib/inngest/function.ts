import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../prisma";
import { inngest } from "./client";
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every sunday at midnight
  async ({ step }) => {
    const industres = await step.run("Fetch industries", async () => {
      return await prisma.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industres) {
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
      //   const res = await step.ai.wrap("gpt", generateText, {
      //     model: openai("gpt-4-turbo"),
      //     prompt: "What is love?"
      //   });

      const model = genAi.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );
      const contentPart = res?.response?.candidates?.[0]?.content?.parts?.[0];
      const text = contentPart && "text" in contentPart ? contentPart.text : "";
      const cleneText = text.replace(/```(?:json)?\n?/g, "").trim();
      const insights = JSON.parse(cleneText);

      await step.run(`Update ${industry} industry insights`, async () => {
        return await prisma.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(Date.now()),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);

export default generateIndustryInsights;
