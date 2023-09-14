import { memo, useEffect, useRef } from "react";
import { useCompletion } from "ai/react";
import { type NextPage } from "next";
import Head from "next/head";
import classNames from "classnames";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithHash } from "jotai-location";
import { useAnimate } from "framer-motion";
import FanIcon from "./../icons/fan.svg";
import SendIcon from "./../icons/send.svg";
import ClickIcon from "./../icons/click.svg";

const rainbowGradient =
  "linear-gradient(135deg,#f90,#fd66cb 25%,#9f6eff 50%,#0af 75%,#0ea)";

const queryStringAtom = atomWithHash<string>("query", "");
const hoveredModuleAtom = atom<string | null>(null);

const rawCompletionTextAtom = atom<string>("");
const isRawCompletionLoadingAtom = atom<boolean>(false);

const topicsAtom = atom<{ name: string; description: string }[]>((get) => {
  const rawCompletionText = get(rawCompletionTextAtom);

  if (rawCompletionText === "") return [];

  const topics = rawCompletionText.split("\n\n").map((topicString) => ({
    name: topicString.split(":")[0] || "",
    description: topicString.split(":")[1] || "",
  }));
  return topics;
});

function Form() {
  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
    complete,
  } = useCompletion({
    api: "/api/topics",
    id: "topics",
  });
  const [queryString, setQueryString] = useAtom(queryStringAtom);
  const [, setRawCompletionText] = useAtom(rawCompletionTextAtom);
  const [, setIsLoading] = useAtom(isRawCompletionLoadingAtom);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setRawCompletionText(completion);
  }, [completion]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    stop();
    setInput(queryString);
    if (queryString === "") return;
    complete(queryString)
      .then((_) => {
        //console.log("completed");
      })
      .catch((e) => {
        console.error(e);
      });
  }, [queryString]);

  return (
    <form
      ref={formRef}
      className="relative flex flex-row items-center "
      onSubmit={(e) => {
        if (input !== "") {
          handleSubmit(e);
          setQueryString(input);
        }
      }}
    >
      <input
        className="h-12 rounded-md  bg-slate-100 px-4 pr-14 md:w-96"
        placeholder="Enter topic, .e.g., Mathematics"
        value={input}
        onChange={handleInputChange}
      />
      <button
        disabled={isLoading}
        type="submit"
        className="absolute right-0 flex cursor-pointer items-center justify-center  px-3 py-3 font-bold text-white"
      >
        <SendIcon className="h-5 w-5" fill="rgba(0,0,0,.15)" />
      </button>
    </form>
  );
}

const SuggestedSearches = () => {
  const [, setQueryString] = useAtom(queryStringAtom);
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-2 md:flex-row">
      <div className="flex flex-row items-center justify-center gap-1 text-xs font-bold text-slate-700">
        <ClickIcon
          className="opacity-80"
          style={{
            width: "1.2em",
            height: "1.2em",
          }}
        />
        Try:
      </div>
      <ul className=" flex list-none flex-row flex-wrap justify-center gap-2 text-xs text-slate-700">
        <li>
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Travelling to New Zealand");
            }}
          >
            Travelling to New Zealand
          </button>
        </li>
        <li>
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Pancake Recipe");
            }}
          >
            Pancake Recipe
          </button>
        </li>
        <li>
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Overview of History of Greece");
            }}
          >
            Overview Rome History
          </button>
        </li>
        <li>
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Timeline of the 20th century");
            }}
          >
            Timeline of the 20th century
          </button>
        </li>
        <li>
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("How to maintain a lawn?");
            }}
          >
            How to maintain a lawn?
          </button>
        </li>
      </ul>
    </div>
  );
};

const FancyBadge = () => {
  const [isLoading] = useAtom(isRawCompletionLoadingAtom);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isLoading) {
      const startAnimation = async () => {
        await animate(
          "svg",
          { rotate: 0 },
          {
            ease: "easeIn",
            duration: 0,
          }
        );
        await animate(
          "svg",
          { rotate: 360 * 50 },
          {
            ease: "easeInOut",
            duration: 8,
          }
        );
      };
      startAnimation()
        .then(() => {
          //
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
    }
  }, [isLoading]);

  return (
    <div
      className="text-md mb-12 flex items-center rounded-md border-2 border-slate-100 bg-gradient-to-r pl-1 pr-4 text-xl font-bold tracking-tight text-white shadow-md"
      style={{
        textShadow: "0 0 4px 4px rgba(0,0,0, 1)",
        backgroundImage: rainbowGradient,
        // boxShadow:
        //   "3px 3px 6px rgba(0,0,0,0.125), -3px 3px 6px rgba(0,0,0,0.075)",
      }}
      ref={scope}
    >
      <FanIcon
        style={{ width: "2em", height: "2em" }}
        fill="rgba(255, 255, 255, 1)"
      />
      <h2>Hyperspeed LLM {isLoading ? "" : ""}</h2>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Summarise App</title>
        <meta name="description" content="Infinite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b  pt-16">
        <header className="flex flex-col items-center">
          <h1 className="mb-6 px-3 text-center text-5xl font-extrabold tracking-tight">
            <span
              className="text-slate-100"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsla(215, 20%,15%, 1), hsla(215, 20%,50%, 1) )",
                letterSpacing: "-0.025em",
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              10×.Cards
            </span>
          </h1>
          <FancyBadge />
          <Form />
          <SuggestedSearches />
        </header>

        <div className="container flex flex-col items-center justify-center gap-12 pb-16 pt-8 md:px-4">
          <AllTopics />
        </div>
      </main>
    </>
  );
};

const AllTopics = function TopicList() {
  const topics = useAtomValue(topicsAtom);
  const minimumCountToDisplay = 8;
  const loadingSkeletonCount = minimumCountToDisplay - topics.length;
  return (
    <div className="flex w-screen flex-col gap-2 overflow-x-auto pb-6 md:flex-row md:px-6">
      {topics.map((topic, i) => {
        return <Topic key={i} index={i} />;
      })}

      {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
        <TopicLoadingSkeleton key={`skeleteon${i}`} />
      ))}
    </div>
  );
};

const Topic = memo(function Topic({ index }: { index: number }) {
  const [queryString, setQueryString] = useAtom(queryStringAtom);
  const [topics] = useAtom(topicsAtom);
  const isFetching = useAtomValue(isRawCompletionLoadingAtom);
  const isLast = index === topics.length - 1;
  const hasFinishedTopicCompletion = !isLast || !isFetching;
  const topic = topics[index];
  if (topic === undefined) {
    return null;
  }
  const { name, description } = topic;
  return (
    <div className="flex flex-col">
      <div className="relative flex h-16 items-center overflow-hidden text-ellipsis px-3">
        <button
          onClick={() => {
            setQueryString(`${queryString.replace(name, "")} ${name}`);
          }}
          className={classNames(
            "pl-3 text-left align-middle text-sm font-bold hover:underline"
          )}
          role="button"
        >
          {name}
          {!hasFinishedTopicCompletion ? <Cursor /> : null}
        </button>
        <div
          className={classNames(
            "absolute bottom-0 left-0 h-4 w-full bg-gradient-to-t from-[#ffffff] to-transparent transition-all"
          )}
        />
      </div>
      <div className="flex flex-row gap-3 overflow-x-auto pb-4 pl-3 md:flex-col md:overflow-x-visible md:py-2">
        {hasFinishedTopicCompletion ? (
          <TopicModuleDisplay name={name} description={description} />
        ) : (
          Array.from({ length: 8 }).map((_, i) => (
            <ModuleLoadingSkeleton key={i} />
          ))
        )}
      </div>
    </div>
  );
});

const Cursor = () => {
  return (
    <span
      className="relative top-0.5 inline-block h-4 w-3 animate-pulse"
      style={{
        backgroundImage:
          Math.random() > 0.99
            ? "linear-gradient(135deg,#9f6eff 50%,#0af 75%,#0ea)"
            : "linear-gradient(135deg,#f90,#fd66cb)",
      }}
    />
  );
};

const TopicModuleDisplay = function TopicModuleDisplay({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const [queryString] = useAtom(queryStringAtom);
  const { completion, complete, input, stop, isLoading } = useCompletion({
    api: "/api/modules",
    initialInput:
      name && description
        ? `${queryString} focus specifically on ${name}: ${description}`
        : "",
    id: name + ": " + description,
  });

  const modules =
    completion.split("\n\n").map((topicString) => {
      const rawName = removeLeadingNumber(topicString.split(":")[0] || "");
      // Break out subname if it exists "Name (subname}"
      const [name, rawSubname] = rawName.split(" (");
      const subname = rawSubname ? rawSubname.replace(")", "") : undefined;

      return {
        name: name || rawName,
        subname,
        description: topicString.split(":")[1] || "",
      };
    }) || [];
  const minimumCountToDisplay = 8;
  const loadingSkeletonCount = minimumCountToDisplay - modules.length;
  const hasSubmitted = useRef(false);
  useEffect(() => {
    if (hasSubmitted.current) return;
    if (input === "") return;
    complete(input)
      .then((_) => {
        //console.log("completed");
      })
      .catch((e) => {
        console.error(e);
      });
    hasSubmitted.current = true;
  }, [hasSubmitted.current]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return (
    <>
      {modules.map((module) => {
        const isLast = module === modules[modules.length - 1];
        const isCompleting = isLast && isLoading;
        return (
          <Module
            key={module.name}
            name={module.name}
            subName={module.subname}
            description={module.description}
            isCompleting={isCompleting}
          />
        );
      })}

      {isLoading &&
        Array.from({ length: loadingSkeletonCount }).map((_, i) => (
          <ModuleLoadingSkeleton key={i} />
        ))}
    </>
  );
};

const Module = memo(
  function Module({
    name,
    subName,
    description,
    isCompleting,
  }: {
    name: string;
    subName?: string;
    description: string;
    isCompleting: boolean;
  }) {
    const [text, setText] = useAtom(queryStringAtom);
    const [hoveredModule, setHoveredModule] = useAtom(hoveredModuleAtom);
    const isHovering = hoveredModule === name + description;
    const isOtherModuleHovering = hoveredModule !== null && !isHovering;

    return (
      <div
        className={classNames(
          "relative h-36 w-60 cursor-pointer overflow-visible",
          {
            "z-10": isHovering,
          }
        )}
        onMouseEnter={() => setHoveredModule(name + description)}
        onMouseLeave={() => setHoveredModule(null)}
        role="button"
        tabIndex={-1}
        onClick={() => {
          setText(text + " " + name);
          // Scroll to top
          window.scrollTo(0, 0);
        }}
      >
        <div
          className={classNames(
            "relative min-h-[9rem]  w-60 rounded-md border  bg-white p-3  transition-all duration-300",
            {
              "border-transparent opacity-80": isOtherModuleHovering,
              "scale-[.98] ": isCompleting,
              "  shadow": !isCompleting,
              "0 h-[9rem] max-h-0 overflow-hidden border-gray-100": !isHovering,
              "z-10 max-h-[1000rem] translate-y-[-0.75rem] overflow-auto border-gray-200 shadow-lg":
                isHovering,
            }
          )}
          style={{
            transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            backgroundImage: isCompleting
              ? "linear-gradient(135deg,#ffffff,#f7f7f7)"
              : "none",
          }}
        >
          <h3
            className={classNames("text-sm font-semibold transition-opacity", {
              "opacity-90": !isCompleting,
              "opacity-50": isCompleting,
              underline: isHovering,
            })}
          >
            {name}
            {!subName && description === "" ? <Cursor /> : null}
          </h3>
          {subName ? (
            <p
              className={classNames("text-sm transition-opacity ", {
                "opacity-60": !isCompleting,
                "opacity-20": isCompleting,
                underline: isHovering,
              })}
            >
              {subName}
              {description === "" ? <Cursor /> : null}
            </p>
          ) : null}

          <p className={classNames("mt-1 text-sm")}>
            <span
              className={classNames("transition-opacity", {
                "opacity-80": !isCompleting,
                "opacity-50": isCompleting,
              })}
            >
              {description}
            </span>
            {description !== "" && isCompleting ? <Cursor /> : null}
          </p>

          <div
            className={classNames(
              "absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-[#ffffff] to-transparent transition-all",
              {
                "opacity-0": isHovering,
              }
            )}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.description === nextProps.description &&
      prevProps.isCompleting === nextProps.isCompleting
    );
  }
);

function TopicLoadingSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-3 overflow-x-auto pb-4 pl-3 md:flex-col md:overflow-x-visible md:py-2">
        <TopicTitleLoadingSkeleton />
      </div>

      <div className="flex flex-row gap-3 overflow-x-auto pb-4 pl-3 md:flex-col md:overflow-x-visible md:py-2">
        <ModulesLoadingSkeleton />
      </div>
    </div>
  );
}

function TopicTitleLoadingSkeleton() {
  return (
    <div
      className="bg-muted flex w-60 animate-pulse rounded-md p-5"
      style={{
        backgroundImage: "linear-gradient(135deg,#ffffff,#f7f7f7)",
        //border: "1px solid rgba(176,182,253,.1)",
      }}
    />
  );
}

function ModulesLoadingSkeleton() {
  return (
    <>
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
      <ModuleLoadingSkeleton />
    </>
  );
}

function ModuleLoadingSkeleton() {
  return (
    <div
      className="bg-muted flex h-36 w-60 scale-[.98] animate-pulse rounded-md border border-gray-200 bg-[rgba(255,255,255,0.07)] p-6"
      style={{
        backgroundImage: "linear-gradient(135deg,#ffffff,#f7f7f7)",
        //border: "1px solid rgba(176,182,253,.1)",
      }}
    />
  );
}

function removeLeadingNumber(str: string) {
  return str.replace(/^\d+\.\s*/, "");
}

export default Home;
