import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { type modulePrompts, type TopicPromptKey } from "./prompts/prompts";
import { redis } from "./persistence/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function handleStreamingResponse(
  cacheModule: string,
  req: Request,
  messages: typeof modulePrompts,
  cachedStreamingDelay: number
) {
  // Extract the `messages` from the body of the request
  const { prompt } = (await req.json()) as { prompt: string };
  const topicType = await determineTopicType(prompt);
  const cacheBreaking = 1;

  console.log(topicType);

  const cacheKey = `${cacheModule}${cacheBreaking}${prompt.replace(/ /g, "_")}`;
  const cachedResponse = (await redis.get(cacheKey)) as string;

  if (cachedResponse) {
    const chunks = cachedResponse.split(" ");
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const bytes = new TextEncoder().encode(chunk + " ");
          controller.enqueue(bytes);
          await new Promise((r) =>
            setTimeout(r, Math.floor(Math.random() * cachedStreamingDelay) + 10)
          );
        }
        controller.close();
      },
    });
    //console.log("return cached response", prompt);
    return new StreamingTextResponse(stream);
  }

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      ...messages[topicType],
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    // onFinal(...args) {
    //   //await redis.set(cacheKey, completion);
    //   //console.log("cached response", cacheKey, args);
    // },
    async onCompletion(completion) {
      await redis.set(cacheKey, completion);
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

async function determineTopicType(query: string): Promise<TopicPromptKey> {
  const queryL = query.toLowerCase();
  return new Promise((resolve, reject) => {
    if (queryL.includes("overview") || queryL.includes("summar")) {
      return resolve("Overview");
    }
    if (queryL.includes("itinerary") || queryL.includes("travel")) {
      return resolve("TravelItinerary");
    }
    if (queryL.includes("recipe")) {
      return resolve("Recipe");
    }
    if (queryL.includes("learn") || queryL.includes("lesson")) {
      return resolve("LessonPlan");
    }
    if (queryL.includes("timeline")) {
      return resolve("Timeline");
    }
    if (queryL.startsWith("how") || queryL.endsWith("?")) {
      return resolve("Instructions");
    }

    resolve("Overview");
  });
}
