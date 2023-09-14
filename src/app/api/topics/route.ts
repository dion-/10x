import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { topicPrompts } from "../../../prompts/prompts";
import { handleStreamingResponse } from "~/handleStreamingResponse";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

export async function POST(req: Request) {
  return handleStreamingResponse("topics", req, topicPrompts, 5);
}
