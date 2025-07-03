import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "fundamentaleuruka", // Unique app ID
  name: "Funda Mental Euruka",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY as string,
    },
  },
});
