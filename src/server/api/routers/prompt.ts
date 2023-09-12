/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import OpenAI from "openai";
import { type ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

export async function prompt(
  messages: ChatCompletionCreateParamsBase["messages"],
  model: "gpt-3.5-turbo" | "gpt-4" = "gpt-3.5-turbo"
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  });
  try {
    const chatCompletion = await openai.chat.completions.create({
      model,
      temperature: 0.9,
      messages,
    });
    return chatCompletion.choices[0]?.message.content || "";
  } catch (e: any) {
    if (e.response.data.error) {
      console.log(`\nOpenAI API error: ${e.response.data.error.message}`);
    } else {
      console.log(`\nOpenAI API error: ${e.message}`);
    }
    return "";
  }
}
