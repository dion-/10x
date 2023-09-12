import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prompt } from "./prompt";

export const iconsRouter = createTRPCRouter({
  generateTopics: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input: { text } }) => {
      if (text === "") {
        return [];
      }

      const topics = await generateTopicList(text);

      return topics;
    }),
  generateModules: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input: { text } }) => {
      const modules = await generateModuleList(text);

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

async function generateIcon(text: string) {
  const result = await prompt([
    {
      role: "system",
      content:
        "You are an expert artistic assistant who replies with SVG icons that convey the concept of a given word",
    },
    {
      role: "user",
      content: "Cup of Coffee",
    },
    {
      role: "assistant",
      content: [
        `\`\`\`
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Coffee">
<path id="Vector" d="M4 20H10.9433M10.9433 20H11.0567M10.9433 20C10.9622 20.0002 10.9811 20.0002 11 20.0002C11.0189 20.0002 11.0378 20.0002 11.0567 20M10.9433 20C7.1034 19.9695 4 16.8468 4 12.9998V8.92285C4 8.41305 4.41305 8 4.92285 8H17.0767C17.5865 8 18 8.41305 18 8.92285V9M11.0567 20H18M11.0567 20C14.8966 19.9695 18 16.8468 18 12.9998M18 9H19.5C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14H18V12.9998M18 9V12.9998M15 3L14 5M12 3L11 5M9 3L8 5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
\`\`\``,
      ].join("\n\n"),
    },
    {
      role: "user",
      content: text,
    },
  ]);
}

async function generateTopicList(text: string): Promise<Topic[]> {
  const result = await prompt([
    {
      role: "system",
      content:
        "You are an assistant who replies with 5-8 high level subtopics suitable to give me a solid overview of a given topic with a summary of each subtopics in one sentence",
    },
    {
      role: "user",
      content: "Spanish language",
    },
    {
      role: "assistant",
      content: [
        "Grammar: Essential components of Spanish grammar, such as verb conjugation, noun-adjective agreement, pronouns, prepositions, and sentence structure.",
        "Vocabulary: Common words and phrases, topic-specific vocabulary such as travel, food, hobbies, and professions.",
        "Pronunciation: Phonetics including the alphabet, syllable stress, and intonation patterns.",
        "Conversation skills: Practical topics like greetings, small talk, asking for directions, and expressing opinions.",
        "Reading and listening comprehension: Authentic materials such as news articles, podcasts, movies, and literature.",
        "Cultural context: History, customs, and traditions to understand the cultural nuances.",
        "Idiomatic expressions: Idioms, colloquialisms, and slang for conversational fluency.",
        "Advanced language use: Linguistic concepts like the subjunctive mood, compound tenses.",
      ].join("\n\n"),
    },
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

async function generateModuleList(text: string): Promise<Module[]> {
  const result = await prompt([
    {
      role: "system",
      content:
        "You are an expert assistant who replies with 5-8 high level subtopics suitable to give me a solid overview of a given topic, with a clear, concise and dense summary of each subtopic",
    },
    {
      role: "user",
      content:
        "Spanish language - focus specifically on Advanced language use: More complex linguistic concepts like the subjunctive mood, compound tenses, and advanced vocabulary required to refine Spanish proficiency.",
    },
    {
      role: "assistant",
      content: [
        "Verb Conjugation: Includes patterns in the indicative, subjunctive, and imperative moods across tenses, such as present, past, future, and conditional.",
        "Noun-Adjective Agreement: Gender (masculine and feminine) and number (singular and plural). Exceptions and irregular forms.",
        "Pronouns: For Subject, direct and indirect object, reflexive, relative, demonstrative, and possessive pronouns.",
        'Prepositions: Includes "a," "de," "en," "con," "por," and "para," that connect words and phrases within sentence',
        "Sentence Structure: Simple, compound, and complex structures. Rules for word order and negation.",
        "Articles: Definite and indefinite articles, agreements with nouns, exceptions and special cases.",
        "Adverbs and Adjectives: Comparative and superlative forms which modify verbs, adjectives, or other adverbs in sentences.",
        "Tense and Aspect: Time reference and the nature of an action, creating meaning in various grammatical structures.",
      ].join("\n\n"),
    },
    {
      role: "user",
      content: text,
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
