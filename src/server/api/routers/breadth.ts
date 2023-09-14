import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prompt } from "../../../prompt";
import {
  topicPrompts,
  modulePrompts,
  type TopicPromptKey,
  TopicTypes,
} from "../../../prompts/prompts";

export const breadthRouter = createTRPCRouter({
  generateTopics: publicProcedure
    .input(z.object({ topicText: z.string(), topicType: TopicTypes }))
    .query(async ({ input: { topicText, topicType } }) => {
      if (topicText === "") {
        return [];
      }

      const topics = await generateTopicList(topicText, topicType);

      return topics;
    }),
  generateModules: publicProcedure
    .input(z.object({ topicText: z.string(), topicType: TopicTypes }))
    .query(async ({ input: { topicText, topicType } }) => {
      const modules = await generateModuleList(topicText, topicType);

      return modules;
    }),
});

type Topic = {
  name: string;
  description: string;
};

type Module = {
  name: string;
  description: string;
};

async function generateTopicList(
  text: string,
  topicType: z.infer<typeof TopicTypes>
): Promise<Topic[]> {
  const result = await prompt([
    ...topicPrompts[topicType],
    {
      role: "user",
      content: text,
    },
  ]);

  const rawTopics =
    result?.split("\n\n").map((topicString) => ({
      name: topicString.split(":")[0] || "",
      description: topicString.split(":")[1] || "",
    })) || [];

  //const topics: Topic[] = [];

  // const modules = await Promise.all(
  //   rawTopics.map((topic) =>
  //     generateModuleList(`${text} - focus specifically on ${topic.name}`)
  //   )
  // );

  const topics = rawTopics.map((topic, index) => {
    const name = removeLeadingNumber(topic.name);

    return {
      name,
      description: topic.description,
    };
  });

  return topics;

  // for (const topic of rawTopics) {
  //   if (topic.name && topic.description) {
  //     topics.push({
  //       name: topic.name,
  //       description: topic.description,
  //       modules,
  //     });
  //   }
  // }

  //return topics;
}

async function generateModuleList(
  subtopic: string,
  topicType: z.infer<typeof TopicTypes>
): Promise<Module[]> {
  const result = await prompt([
    ...modulePrompts[topicType],
    {
      role: "user",
      content: subtopic,
    },
  ]);

  const modules =
    result?.split("\n\n").map((topicString) => {
      const name = removeLeadingNumber(topicString.split(":")[0] || "");
      return {
        name,
        description: topicString.split(":")[1] || "",
      };
    }) || [];

  return modules;
}

function removeLeadingNumber(str: string) {
  return str.replace(/^\d+\.\s*/, "");
}
