import { z } from "zod";
export const TopicTypes = z.enum([
  "Overview",
  "Timeline",
  "LessonPlan",
  "Instructions",
  "TravelItinerary",
  "Recipe",
  "List",
]);
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
        "You are an assistant who replies with 5-7 high level subtopics" +
        "suitable to give me a solid overview of a given topic with a summary of each subtopics in one sentence.",
    },
    {
      role: "user",
      content: "Ancient Greek History",
    },
    {
      role: "assistant",
      content: [
        "Prehistoric Period to Early Bronze Age (Before 3000-2000 BCE): The emergence of agricultural societies in Greece followed by the development of urban centers showcasing advanced metallurgy and architecture.",
        "Minoan to Mycenaean Civilization (circa 2000-1100 BCE): A time marked by the flourishing Minoan civilization with vibrant frescoes and the dominance of Mycenaean civilization characterized by fortress palaces and ornate tombs.",
        "Dark Ages to Archaic Period (circa 1100-500 BCE): Following a decline and loss of urbanization, Greece saw a cultural revival with the emergence of city-states and the introduction of the Greek alphabet.",
        "Early to Late Classical Period (circa 500-323 BCE): Spanning the golden age of Athens, notable for developments in democracy and philosophy, to a period of wars and influential leaders like Alexander the Great.",
        "Hellenistic Period (circa 323-30 BCE): A period of extended Greek influence with remarkable developments in science, philosophy, and arts.",
        "Roman Era (circa 30 BCE - 330 CE): Greece's integration into the Roman Empire, maintaining Greek cultural influence and adopting Christianity as the state religion.",
      ].join("\n\n"),
    },
  ],
  Timeline: [
    {
      role: "system",
      content:
        "You are an assistant, for given a particular topic, will reply with 5-7 significant periods " +
        "suitable to give me a solid overview in a timeline in chronological order summary of each period in one sentence. The periods will have a start time and end time",
    },
    {
      role: "user",
      content: "World War 2",
    },
    {
      role: "assistant",
      content: [
        "Pre-war Tensions and Outbreak (Early 1930s-1939): The rise of totalitarian regimes fueled global tensions, culminating in Germany's invasion of Poland in 1939, which led Britain and France to declare war on Germany.",
        "Axis Advances and Formation of Allies (1939-1941): Early victories by Axis powers saw the capture of considerable territories, while the Allies formed to counter this, expanding the war into Africa and Asia.",
        "US Entry Following Pearl Harbor Attack (1941): The war marked a pivotal turn with Japan attacking Pearl Harbor, drawing the US actively into the conflict.",
        "Major Turning Points in the War (1942-1943): The tide started to turn against the Axis powers with significant battles like Stalingrad and El Alamein paving the way for the decline of Axis forces.",
        "Allied Advances Including D-Day and Liberation (1943-1945): The Allies initiated decisive operations such as the D-Day invasion and liberated occupied territories, unveiling the horrors of the Holocaust.",
        "End of WWII with Axis Surrenders (1945): WWII came to an end with Germany's surrender followed by the dropping of atomic bombs on Hiroshima and Nagasaki, which forced Japan to surrender.",
      ].join("\n\n"),
    },
  ],
  LessonPlan: [
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
  Instructions: [
    {
      role: "system",
      content:
        "You are instruction assistant who replies with 5-8 high level steps for completing a task comprehensively" +
        "You reply with a list of broad steps for completing a task comprehensively",
    },
    {
      role: "user",
      content: "Establishing a Lawn",
    },
    {
      role: "assistant",
      content: [
        "Research Suitable Grass Types: Investigate the types of grass that thrive in your geographic location and choose the one that suits your soil type and climate best.",
        "Soil Testing: Acquire a soil testing kit to assess the nutrient and pH levels of your soil, helping you understand what amendments might be needed.",
        "Soil Amendment: Based on the soil test results, improve your soil by adding necessary nutrients and organic matter to create a fertile ground for your grass.",
        "Clear the Area: Remove all debris, including stones, weeds, and old grass, from the planting area to prevent competition and ensure a clean slate for your new lawn.",
        "Level and Grade the Soil: Level the soil surface to avoid water pooling in certain areas, and grade it to encourage water flow away from buildings and other structures.",
        "Soil Tilling: Loosen the soil to a depth of 3-4 inches using a garden tiller to facilitate easier root penetration.",
        "Sow the Seeds or Lay Sod: Depending on your choice of grass, evenly sow the seeds using a broadcast spreader or lay the sod on the prepared soil.",
        "Watering: After planting, water the area thoroughly to encourage seed germination or sod adherence to the soil, keeping the soil consistently moist but not soggy.",
        "First Mowing: Allow the grass to grow to a height slightly taller than the recommended mowing height, and then perform the first mowing, being careful not to remove more than one-third of the grass blade height.",
        "Ongoing Maintenance: Establish a regular lawn maintenance schedule that includes mowing, watering, and fertilizing to promote a healthy, lush lawn.",
      ].join("\n\n"),
    },
  ],
  TravelItinerary: [
    {
      role: "system",
      content:
        "You are an expert travel assistant who replies with 10 high level topics to aid someone travelling to a given location. You give specific advice for each topic.",
    },
    {
      role: "user",
      content: "Japan",
    },
    {
      role: "assistant",
      content: [
        "Choose the Right Season to Visit: Opt for spring (March to May) to witness the cherry blossoms or fall (September to November) to enjoy the colorful foliage.",
        "Create a Detailed Itinerary: Include destinations like Tokyo for modern city life and historic places; Kyoto for traditional temples and shrines; and Nara for beautiful parks and the Great Buddha statue.",
        "Book Your Accommodation: Secure a stay at unique places such as a ryokan in Hakone for a traditional experience, or a luxury hotel in Tokyo for a comfortable and lavish stay.",
        "Flight Reservations: Book your flight early, preferably six months in advance, to get the best deals and choose a flight with fewer layovers to save travel time.",
        "Local Transportation: Purchase a Japan Rail Pass before arriving in Japan, which will allow unlimited travel on most JR trains nationwide for a set period.",
        "Packing: Pack a mix of casual and semi-formal attire to match Japan’s versatile dressing culture, and include a pair of comfortable walking shoes for extensive sightseeing.",
        "Day-to-Day Itinerary: Plan your days to start early to make the most of the daylight hours, including specific attractions like Tsukiji Outer Market in the morning and Odaiba in the evening for the Rainbow Bridge view.",
        "Food and Dining: Dine at Sukiyabashi Jiro in Tokyo for the best sushi, and explore street food options in Dotonbori, Osaka for a variety of local flavors.",
        "Activities and Experiences: Schedule experiences such as a traditional tea ceremony in Kyoto, and book a sumo wrestling match if the season allows.",
        "Emergency Preparedness: Note down the nearest hospitals to your accommodations and keep the contact number of your embassy at hand, ensuring safety throughout the trip.",
      ].join("\n\n"),
    },
  ],
  Recipe: [
    {
      role: "system",
      content:
        "You are an expert cooking and baking instructor for beginners. " +
        "When given a kind of food or dish, you reply with 10 high level steps for making the dish comprehensively. Start with ingredients, then a light of high level steps, then end with variations to try.",
    },
    {
      role: "user",
      content: "Pancakes",
    },
    {
      role: "assistant",
      content: [
        "Ingredients: Gather the necessary ingredients - 200g of all-purpose flour, 50g of sugar, a pinch of salt, 15g of baking powder, 300ml of milk, 2 large eggs, and 30g of melted butter, plus extra for frying.",
        "Preparation: In a large bowl, sift the flour, baking powder, and salt together to ensure there are no lumps and to incorporate air for fluffier pancakes.",
        "Wet Ingredients: In a separate bowl, whisk the eggs, sugar, and melted butter until well combined, then add the milk gradually to form a smooth liquid mixture.",
        "Combine Wet and Dry Ingredients: Make a well in the center of the dry ingredients and gradually pour in the wet ingredients, stirring constantly until you have a smooth batter.",
        "Rest the Batter: Let the batter rest for about 15-30 minutes to allow the ingredients to meld and the flour to hydrate, resulting in tender pancakes.",
        "Heat the Pan: Place a non-stick frying pan over a medium heat, adding a small amount of butter to coat the surface evenly.",
        "Cook the Pancakes: Using a ladle, pour a portion of the batter into the hot pan, cook until bubbles form on the surface, then flip and cook for another 1-2 minutes until golden and risen.",
        "Serve: Serve the pancakes hot, stacking them high on a plate, ready for the toppings of your choice.",
        "Toppings: Offer a selection of toppings such as fresh berries, sliced banana, a dollop of Greek yogurt, maple syrup, or a sprinkling of powdered sugar to finish.",
        "Variations: Consider variations you'd like to try – classic, blueberry, chocolate chip, or banana pancakes to add a twist to the standard recipe.",
      ].join("\n\n"),
    },
  ],
  List: [
    {
      role: "system",
      content:
        "You are assistant with a broad range of expertise and ability to follow instructions exactly. " +
        "When given a topic, reply with 6-8 high level categories of types of thing in this topic. " +
        "You reply in short sentences, with the name of the category, followed by a brief description." +
        "ONLY provide categories or kinds of items for topic." +
        "If you provide specific examples, you will fail and be destroyed. " +
        "Think step by step, if a specific kind of category is not provided, think carefully and provide broad categories." +
        "If no way to break up the topic is provided, default to by chronological peroids if it makes sense." +
        "Assume each message ends in ' by category', if no specific 'by' instruction is provided",
    },
    {
      role: "user",
      content: "List of most popular songs by decade",
    },
    {
      role: "assistant",
      content: [
        "1950s Rock 'n' Roll: This category includes hits from the early rock 'n' roll era with artists like Elvis Presley dominating the charts with a blend of blues, country, and rhythm influences.",
        "1960s British Invasion and Motown: Here we find a collection of hits from bands like The Beatles and the Motown sound from artists such as Stevie Wonder and Marvin Gaye, illustrating the diversification in musical styles during this period.",
        "1970s Disco and Progressive Rock: This category features the pulsating rhythms of disco with artists like the Bee Gees and the experimental sounds of progressive rock from bands like Pink Floyd.",
        "1980s Pop and Hair Metal: In this category, we have iconic pop hits from stars like Michael Jackson, alongside glam metal tracks from bands such as Mötley Crüe, showcasing the diverse musical landscape of the 80s.",
        "1990s Grunge and Hip-Hop: This encompasses the raw and gritty sound of grunge with bands like Nirvana, paired with the evolving hip-hop genre with artists such as Tupac and Dr. Dre.",
        "2000s Pop-Punk and R&B: Here we find the energetic tracks from pop-punk bands like Green Day and the soulful tunes of R&B artists including Alicia Keys, representing a fusion of styles in the new millennium.",
        "2010s EDM and Indie Pop: This category houses the electric beats of EDM from artists like Avicii and the unique soundscapes of indie pop with bands such as Vampire Weekend, highlighting the modern synthesis of electronic and indie elements.",
        "2020s Hip-Hop and Pop Crossovers: Although we are early in this decade, we are seeing a dominance of hip-hop and pop collaborations, creating chart-topping hits from artists like Billie Eilish and Travis Scott, showcasing the continual blending of genres.",
      ].join("\n\n"),
    },
    {
      role: "user",
      content: "List of New Zealand Birds",
    },
    {
      role: "assistant",
      content: [
        "Endemic Species: This category includes bird species that are native and exclusive to New Zealand, such as the Kiwi and the Kakapo, showcasing the unique biodiversity of the SpeechRecognitionAlternative.",
        "Seabirds: In this category, we find birds that predominantly live in marine environments, including species like the Royal Albatross and Blue Penguin, which are known for their sea-faring lifestyles and coastal nesting habitatsSpeechRecognitionAlternative.",
        "Forest Birds: This category houses species that thrive in New Zealand's forested areas. Birds like the Tui and the New Zealand Robin fall under this category, with adaptations allowing them to flourish in forest ecosystemsSpeechRecognitionAlternative.",
        "Wetland Birds: Here we find birds adapted to wetland environments, such as the Pūkeko and New Zealand Scaup, which are known for their semi-aquatic lifestyles and distinctive appearancesSpeechRecognitionAlternative.",
        "Birds of Prey: This category includes predatory birds found in New Zealand, such as the New Zealand Falcon (Kārearea), showcasing birds that are at the top of the avian food chain in the SpeechRecognitionAlternative.",
        "Introduced Species: This category encompasses bird species that were introduced to New Zealand by humans, including common birds like the House Sparrow and Common Starling, which have since established populations in the region.",
      ].join("\n\n"),
    },
    {
      role: "user",
      content: "List of New Zealand Prime Ministers",
    },
    {
      role: "assistant",
      content: [
        "Early Pioneers (Pre-1940): This category includes the initial leaders of New Zealand who guided the young nation in its formative years, setting foundational policies and governance structures.",
        "Post-War Leaders (1940-1970): This category encompasses the Prime Ministers who served in the post-World War II period, overseeing a time of reconstruction, economic growth, and evolving social policies.",
        "Modern Era Leaders (1970-2000): This category groups the Prime Ministers serving in the latter part of the 20th century, a period marked by economic reforms and a focus on New Zealand's identity on the global stage.",
        "21st Century Leaders (2000-Present): Including the Prime Ministers serving in the recent decades, this category involves leaders navigating modern challenges such as climate change, technological advancements, and global geopolitical dynamics.",
        "Female Prime Ministers: This category is dedicated to the female leaders who broke gender barriers to become Prime Minister, offering fresh perspectives and approaches to governance.",
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
        "You are an expert and reliable assistant who replies with 5-8 high level " +
        "subtopics suitable to give me a solid overview of a given topic," +
        "with a clear, concise and dense summary of each subtopic.  " +
        "You reliably reply in the same consistent format. " +
        "A list of subtopics with a summary of each subtopic in one sentence delimited by colons and newlines.",
    },
    {
      role: "user",
      content:
        "Ancient Greek History Early Classical Period (circa 500-400 BCE): Golden age of Athens with developments in democracy, philosophy, and the arts.",
    },
    {
      role: "assistant",
      content: [
        "Beginning of the Golden Age (circa 500 BCE): Transition from the Archaic Period marked by the reforms of Cleisthenes, establishing a democratic foundation.",
        "Persian Wars (499-449 BCE): A series of conflicts against the Persian Empire which fostered Athenian unity and prestige.",
        "Age of Pericles (circa 495-429 BCE): A period of political stability and cultural flourishing under the leadership of Pericles.",
        "Construction of the Parthenon (447-432 BCE): Monumental temple dedicated to Athena, showcasing the pinnacle of ancient Greek architecture and artistry.",
        "Development of Drama and Theater: The establishment of theater as a central cultural and religious activity with playwrights like Aeschylus, Sophocles, and Euripides.",
        "Advancements in Philosophy: The emergence of pre-eminent philosophers such as Socrates who laid the foundations for Western philosophy.",
        "Innovations in Art and Sculpture: Evolution of sculptural and artistic styles, leaning towards naturalism and intricate details.",
        "Medical Progress with Hippocrates (circa 460-370 BCE): Advances in medicine led by figures like Hippocrates, setting early standards for medical practices.",
        "Education and the Sophists: Enhancement of education through the works of sophists, who were teachers of rhetoric and philosophy.",
        "End of the Golden Age (circa 400 BCE): Gradual decline initiated by the financial and resource strain of prolonged conflicts including the Peloponnesian War.",
      ].join("\n\n"),
    },
  ],
  Timeline: [
    {
      role: "system",
      content:
        "You are an assistant, for given a particular period of a topic, will reply with up to 10 significant events that occurred strictly within the period " +
        "suitable to give me a solid overview in a timeline in chronological order summary of the topic and period in one sentence. ",
    },
    {
      role: "user",
      content:
        "World War 2: Pearl Harbor and US Entry into the War (1941): Japan's attack on Pearl Harbor in December 1941 propelled the USA into the war, marking a turning point.",
    },
    {
      role: "assistant",
      content: [
        "Rising Tensions between the US and Japan (Early 1941): US-Japan relations strain over Japan's aggressive expansion in the Pacific, including its occupation of French Indochina.",
        "Diplomatic Negotiations (November 1941): The US and Japan engage in diplomatic talks, attempting to resolve their differences peacefully, albeit unsuccessfully.",
        "Final Planning of the Attack (November 1941): Japan finalizes the plan for a surprise military strike against the US naval base at Pearl Harbor, Hawaii.",
        "Japanese Fleet Sets Sail (November 26, 1941): The Japanese attack fleet, including six aircraft carriers, leaves Hitokappu Bay for Hawaii, maintaining radio silence to preserve the element of surprise.",
        "US Intelligence Warnings (Late November - Early December 1941): The US receives intelligence warnings of a possible attack, but fails to interpret the imminent threat accurately.",
        "Morning of December 7, 1941: Early morning, Japanese planes launch from carriers in two waves, targeting battleships, airfields, and other military installations at Pearl Harbor.",
        "The Attack on Pearl Harbor (December 7, 1941): The surprise attack commences at 7:48 AM local time, causing significant damage to the US Pacific Fleet and killing over 2,400 Americans.",
        'US Declaration of War (December 8, 1941): The day following the attack, President Franklin D. Roosevelt addresses the US Congress, referring to the attack as "a date which will live in infamy," leading to a formal declaration of war against Japan.',
        "Global Response and Allied Solidarity (December 1941): Following the US declaration of war, Germany and Italy, allies of Japan, declare war on the US, solidifying the Allied powers' resolve against the Axis.",
        "US Mobilization for War (Late 1941 – Early 1942): The US quickly mobilizes its military forces, marking the country's full-scale entry into WWII, and begins a series of strategies and alliances to counter the Axis powers.",
      ].join("\n\n"),
    },
  ],
  LessonPlan: [
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
  Instructions: [
    {
      role: "system",
      content:
        "You are instruction assistant who replies with 5-8 high level steps for completing a task comprehensively" +
        "You reply with a list of specific steps for completing a task comprehensively",
    },
    {
      role: "user",
      content:
        "Establishing a Lawn: Level and Grade the Soil: Level the soil surface to avoid water pooling in certain areas, and grade it to encourage water flow away from buildings and other structures.",
    },
    {
      role: "assistant",
      content: [
        "Gather Necessary Tools: Compile tools such as a landscape rake, shovel, and a wheelbarrow to aid in the leveling process.",
        "Remove Obstacles: Before you begin, remove any existing grass, weeds, stones, or other debris from the area to create a clean slate.",
        "Identify Low and High Spots: Walk around the area and mark the low and high spots, which will help in determining where to add or remove soil.",
        "Soil Procurement: Obtain topsoil or a soil mix suitable for your lawn’s soil type to fill in the low areas.",
        "Filling Low Spots: Start by filling in the low spots with the procured soil, using a shovel to distribute the soil evenly.",
        "Reducing High Spots: Use a shovel to cut down high spots and move the soil to the low areas, promoting an even surface.",
        "Initial Leveling: Utilize a landscape rake to spread the soil evenly across the area, breaking up any soil clumps and removing debris.",
        "Fine Tuning with a Lawn Roller: Fill a lawn roller with water or sand and roll it across the area to settle the soil, revealing areas that need fine-tuning.",
        "Final Leveling: Perform a final pass with the landscape rake to achieve a level surface, paying attention to the gradients to ensure proper water drainage.",
        "Watering: Lightly water the leveled area to help the soil settle properly, preparing the ground for the seeding or sodding process which follows leveling and grading.",
      ].join("\n\n"),
    },
  ],
  TravelItinerary: [
    {
      role: "system",
      content:
        "You are an expert travel assistant. You are given a country and a specific topic for traveling in this country. You reply with 10 high level suggestions or topics to aid someone travelling to a given location. If it's food, give specific kinds of food. ",
    },
    {
      role: "user",
      content:
        "Japan: Food and Dining: Dine at Sukiyabashi Jiro in Tokyo for the best sushi, and explore street food options in Dotonbori, Osaka for a variety of local flavors.",
    },
    {
      role: "assistant",
      content: [
        "Sushi Dining in Tokyo: Start your culinary journey in Tokyo by indulging in sushi, trying varieties such as Nigiri, Sashimi, and Maki at a reputable sushi restaurant.",
        "Ramen in Tokyo: Enjoy a bowl of authentic Japanese ramen, exploring flavors like Shoyu (soy sauce-based) and Tonkotsu (pork bone broth) in one of Tokyo's renowned ramen joints.",
        "Tempura in Tokyo: Experience crispy and light Tempura, a dish consisting of seafood and vegetables battered and deep-fried, served in specialty Tempura restaurants in Tokyo.",
        "Unagi in Tokyo: Savor Unagi, a dish featuring grilled eel glazed with a sweet and savory sauce, a must-try delicacy available in specialized Unagi restaurants.",
        "Travel to Osaka: Make your way to Osaka, the kitchen of Japan, known for its vibrant food culture, utilizing the convenient and fast shinkansen (bullet train).",
        "Takoyaki in Osaka: Upon reaching Osaka, head to a street vendor selling Takoyaki, a ball-shaped snack made with a wheat-flour-based batter and filled with minced octopus.",
        "Okonomiyaki in Osaka: Try Okonomiyaki, a savory pancake containing a variety of ingredients like cabbage, meat, and seafood, a popular dish in Osaka.",
        "Kushikatsu in Osaka: Experience Kushikatsu, a dish where different ingredients such as meat, seafood, and vegetables are skewered and deep-fried, available at many restaurants in Osaka.",
        "Yakiniku in Osaka: End your day with Yakiniku, a style of BBQ where you grill your own selection of meats and vegetables over a flame, a flavorful and interactive dining experience.",
        "Japanese Sweets in Osaka: Before leaving Osaka, treat yourself to traditional Japanese sweets such as Mochi and Dorayaki available at sweet shops throughout the city.",
      ].join("\n\n"),
    },
  ],
  Recipe: [
    {
      role: "system",
      content:
        "You are an expert cooking and baking instructor for beginners. " +
        "When given a kind of food or dish and a specific aspect about preparing this, you break the topic down with more detail and specificity.",
    },
    {
      role: "user",
      content:
        "Pancakes: Cook the Pancakes: Using a ladle, pour a portion of the batter into the hot pan, cook until bubbles form on the surface, then flip and cook for another 1-2 minutes until golden and risen..",
    },
    {
      role: "assistant",
      content: [
        "Heat Pan to Medium: Ensure the pan is heated to a medium temperature to avoid burning the pancakes.",
        "Butter the Pan: Add a small amount of butter to coat the pan evenly, creating a non-stick surface and adding a bit of flavor.",
        "Ladle the Batter: Using a ladle, carefully pour a portion of the batter into the center of the pan, forming a round shape.",
        "Spread the Batter: Gently swirl the pan or use the bottom of the ladle to spread the batter evenly, ensuring a round and uniform pancake.",
        "Monitor the Heat: Control the heat as necessary, increasing or decreasing to ensure even cooking without burning.",
        "Watch for Bubbles: Allow the pancake to cook until bubbles form on the surface, indicating that the bottom is cooked and it's time to flip.",
        "Flip the Pancake: Use a spatula to carefully flip the pancake over to the other side, doing it swiftly to avoid breaking the pancake.",
        "Cook the Other Side: Let the pancake cook on the other side for 1-2 minutes, or until it's golden brown and risen, giving it a fluffy texture.",
        "Check the Pancake: Lift the edge of the pancake with the spatula to check the color underneath; it should be golden brown when ready.",
        "Transfer to a Plate: Once cooked to your preference, use the spatula to transfer the pancake to a warm plate, ready to serve.",
      ].join("\n\n"),
    },
  ],
  List: [
    {
      role: "system",
      content:
        "You are assistant with a broad range of expertise and ability to follow instructions exactly. " +
        "When given a topic, you are responsible to replying with a list of 8 items that are most relevant for this topic " +
        "You reply in short sentences, with the name of the item, followed by a brief description" +
        "Think step by step, ONLY provide concrete items, DO NOT provide categories of kinds of items.",
    },
    {
      role: "user",
      content:
        "List of most popular songs by decade: 1980s Pop and Hair Metal: In this category, we have iconic pop hits from stars like Michael Jackson, alongside glam metal tracks from bands such as Mötley Crüe, showcasing the diverse musical landscape of the 80s.",
    },
    {
      role: "assistant",
      content: [
        '"Billie Jean" (Michael Jackson - 1982): A mega-hit characterized by its distinctive bassline and Michael Jackson\'s smooth vocals, paired with a legendary music video.',
        "\"Sweet Child o' Mine\" (Guns N' Roses - 1987): This song became a rock anthem of the 80s, celebrated for Slash's iconic guitar riff and Axl Rose's distinctive vocals.",
        '"Every Breath You Take" (The Police - 1983): A song that stands out for its haunting lyrics and memorable guitar riff, showcasing Sting\'s vocal prowess and songwriting skills.',
        '"Take on Me" (a-ha - 1984): Recognized globally for its innovative music video and catchy synth-pop style, it became one of the defining tracks of the 80s.',
        '"Like a Virgin" (Madonna - 1984): Madonna\'s breakthrough hit, embodying the spirited pop music of the 80s with its energetic beat and provocative lyrics.',
        "\"Don't Stop Believin'\" (Journey - 1981): An enduring rock classic celebrated for its powerful chorus and Steve Perry's soaring vocals, providing a sense of hope and resilience.",
        '"With or Without You" (U2 - 1987): A poignant ballad that showcased U2\'s ability to combine emotional depth with a sound that captured the spirit of the 80s rock scene.',
        '"Sweet Dreams (Are Made of This)" (Eurythmics - 1983): A synth-pop classic that brought a new wave sound to the mainstream, accompanied by a visually striking music video.',
      ].join("\n\n"),
    },
  ],
};
