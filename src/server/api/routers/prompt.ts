/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Configuration, OpenAIApi } from "openai";
import type { ChatCompletionRequestMessage } from "openai";

export async function prompt(
  messages: ChatCompletionRequestMessage[],
  model: "gpt-3.5-turbo" | "gpt-4" = "gpt-3.5-turbo"
) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY as string,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const searchTermsResponse = await openai.createChatCompletion({
      model,
      temperature: 0.9,
      messages,
    });
    return searchTermsResponse.data.choices[0]?.message?.content;
  } catch (e: any) {
    if (e.response.data.error) {
      console.log(`\nOpenAI API error: ${e.response.data.error.message}`);
    } else {
      console.log(`\nOpenAI API error: ${e.message}`);
    }
    return "";
  }
}
