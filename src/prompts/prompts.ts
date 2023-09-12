import { z } from "zod";
export const TopicTypes = z.enum(["Overview", "Lesson", "Recipe"]);
import { type ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

type TopicPrompts = {
  [key in z.infer<
    typeof TopicTypes
  >]: ChatCompletionCreateParamsBase["messages"];
};

export type TopicPromptKey = keyof typeof topicPrompts;
export const topicPrompts: TopicPrompts = {
  Overview: [
    {
      role: "system",
      content:
        "You are an assistant who replies with 5-8 high level subtopics" +
        "suitable to give me a solid overview of a given topic with a summary of each subtopics in one sentence. Respond in the language the user uses",
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
  ],
  Lesson: [
    {
      role: "system",
      content:
        "You are an assistant who replies with 5-8 high level subtopics" +
        "suitable to give me a solid overview of a given topic with a summary of each subtopics in one sentence",
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
  ],
  Recipe: [
    {
      role: "system",
      content:
        "You are an assistant who replies with 5-8 high level steps for a recipe " +
        "suitable to make the recipe with an very short and concise summary of the step",
    },
    {
      role: "user",
      content: "Pancakes",
    },
    {
      role: "assistant",
      content: [
        "Ingredients: Flour, sugar, baking powder, salt, milk, egg, melted butter, and toppings.",
        "Step 1: In a large bowl, whisk together flour, sugar, baking powder, and salt.",
        "Step 2: In a separate bowl, whisk together milk, egg, and melted butter. Gradually pour the wet mixture into the dry ingredients and mix until just combined, leaving some lumps.",
        "Step 3: Preheat a non-stick skillet or griddle over medium heat and lightly grease. Pour 1/4 cup of batter onto the pan for each pancake. Cook until bubbles form on the surface and the edges start to look set. Flip the pancake and cook until the other side is golden brown.",
        "Step 4: Transfer cooked pancakes to a plate and cover with a clean cloth or aluminum foil to keep warm. Repeat the process with the remaining batter.",
        "Serving: Stack pancakes on plates, add desired toppings, and serve immediately with complementary sides like bacon, sausage, or scrambled eggs.",
      ].join("\n\n"),
    },
  ],
};

type ModulesPrompts = {
  [key in z.infer<
    typeof TopicTypes
  >]: ChatCompletionCreateParamsBase["messages"];
};

export type modulePromptKey = keyof typeof modulePrompts;
export const modulePrompts: ModulesPrompts = {
  Overview: [
    {
      role: "system",
      content:
        "You are an expert assistant who replies with 5-8 high level " +
        "subtopics suitable to give me a solid overview of a given topic," +
        "with a clear, concise and dense summary of each subtopic. Respond in the language the user uses",
    },
    {
      role: "user",
      content:
        "Spanish language - focus specifically on Advanced language use: Subjunctive mood, compound tenses, advanced vocabulary.",
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
  ],
  Lesson: [
    {
      role: "system",
      content:
        "You are an expert assistant who replies with 5-8 high level " +
        "subtopics suitable to give me a solid overview of a given topic," +
        "with a clear, concise and dense summary of each subtopic",
    },
    {
      role: "user",
      content:
        "Spanish language - focus specifically on Advanced language use: Subjunctive mood, compound tenses, advanced vocabulary.",
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
  ],
  Recipe: [
    {
      role: "system",
      content:
        "You are an cooking assistant " +
        "You will be given either a list of ingredients for a recipe or a step in a recipe." +
        "If give a list of ingredients, for each recipe, you will provide exact amounts suitable " +
        "for 2 people serving and useful advice about the ingredients in the context of making the recipe" +
        "If give a step in the recipe, you will break out the step into 4-5 substeps for considerations " +
        "about each sub step",
    },
    {
      role: "user",
      content:
        "Pancakes ingredients: Flour, sugar, baking powder, salt, milk, egg, melted butter, and toppings.",
    },
    {
      role: "assistant",
      content: [
        "Flour: Use all-purpose flour for a classic pancake texture; for a healthier option, try whole wheat or oat flour.",
        "Sugar: Use white sugar for a neutral sweetness; for a richer flavor, consider brown sugar or a sugar alternative like maple syrup or honey.",
        "Baking powder: Use fresh baking powder to ensure pancakes rise properly; check the expiration date before using.",
        "Salt: Opt for fine-grain salt to ensure even distribution; a small pinch is enough to enhance the overall flavor.",
        "Milk: Whole milk yields a richer taste; for dairy-free options, try almond, soy, or oat milk.",
        "Egg: Fresh eggs work best; if needed, use egg substitutes or flaxseed mixed with water for a vegan alternative.",
        "Melted butter: Allow butter to cool slightly before adding to wet ingredients; for a healthier option, use melted coconut oil or applesauce.",
        "Toppings: Choose a variety of toppings to suit different tastes, like fresh fruit, nuts, chocolate chips, or whipped cream; warm up maple syrup for a cozy touch.",
      ].join("\n\n"),
    },
  ],
};
