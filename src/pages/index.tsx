import { memo, useEffect, useRef, useState, FormEvent } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import classNames from "classnames";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithHash } from "jotai-location";
import { api } from "~/utils/api";
import { useCompletion } from "ai/react";
import useTilg from "tilg";

const topicTextAtom = atomWithHash<string>("query", "");
//const topicTypeAtom = atom<TopicPromptKey>("Overview");
const hoveredModuleAtom = atom<string | null>(null);

const rawCompletionTextAtom = atom<string>("");
const isRawCompletionLoading = atom<boolean>(false);
const topicsAtom = atom<{ name: string; description: string }[]>((get) => {
  const rawCompletionText = get(rawCompletionTextAtom);

  const topics = rawCompletionText
    .split("\n\n")
    .map((topicString) => ({
      name: topicString.split(":")[0] || "",
      description: topicString.split(":")[1] || "",
    }))
    .slice(0, 13);
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
  } = useCompletion({
    api: "/api/topics",
  });

  const [, setRawCompletionText] = useAtom(rawCompletionTextAtom);
  const [, setIsLoading] = useAtom(isRawCompletionLoading);

  useEffect(() => {
    setRawCompletionText(completion);
  }, [completion]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  return (
    <form
      className="flex flex-col gap-3 px-3 md:flex-row"
      onSubmit={input !== "" ? handleSubmit : undefined}
    >
      <input
        className="h-12 rounded-md  bg-[rgba(0,0,0,0.07)] px-4  md:w-96"
        placeholder="Enter topic, .e.g., Mathematics"
        value={input}
        onChange={handleInputChange}
      />
      <button
        disabled={isLoading}
        type="submit"
        className="h-12 rounded-md bg-[rgba(255,255,255,0.07)] bg-purple-900 px-4 font-bold text-white"
      >
        Breakdown
      </button>

      {/* <button type="button" onClick={stop}>
        Stop
      </button> */}
    </form>
  );
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Summarise App</title>
        <meta name="description" content="Infinite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b  pt-32">
        <header className="">
          <h1 className="mb-8 px-3 text-center text-5xl font-extrabold tracking-tight text-white">
            <span className="  text-[hsl(280,100%,70%)]">Summarise.</span>
            <span className="text-shadow text-[#7c50ba]">App</span>
          </h1>

          <Form />
        </header>

        <div className="container flex flex-col items-center justify-center gap-12 pb-16 pt-4 md:px-4">
          <AllTopics />
        </div>
      </main>
    </>
  );
};

const AllTopics = function TopicList() {
  const isLoading = useAtomValue(isRawCompletionLoading);
  const topics = useAtomValue(topicsAtom);
  const minimumCountToDisplay = 8;
  const loadingSkeletonCount = minimumCountToDisplay - topics.length;
  //console.log("MOUNT TOPIC LIST", topics.length);
  //useTilg();
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
  const [topics] = useAtom(topicsAtom);
  const isFetching = useAtomValue(isRawCompletionLoading);
  const isLast = index === topics.length - 1;
  const hasFinishedTopicCompletion = !isLast || !isFetching;

  const topic = topics[index];
  //useTilg();
  if (topic === undefined) {
    return null;
  }

  const { name, description } = topic;

  //console.log("Topic MOUNTED", name, description.length, hasFinished);
  return (
    <div className="flex flex-col">
      <div className="flex h-14 items-center px-3">
        <div className="overflow-hidden align-middle text-base font-bold ">
          {name}
          <span
            className={classNames("animate-pulse transition-all", {
              "text-purple-400": !hasFinishedTopicCompletion,
              "text-transparent": hasFinishedTopicCompletion,
            })}
          >
            {hasFinishedTopicCompletion ? "" : " █"}
          </span>
        </div>
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

const TopicModuleDisplay = function TopicModuleDisplay({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/modules",
    initialInput: name + ": " + description,
    id: name + ": " + description,
  });

  const modules =
    completion.split("\n\n").map((topicString) => {
      const name = removeLeadingNumber(topicString.split(":")[0] || "");
      return {
        name,
        description: topicString.split(":")[1] || "",
      };
    }) || [];
  const minimumCountToDisplay = 8;
  const loadingSkeletonCount = minimumCountToDisplay - modules.length;
  const ref = useRef<HTMLFormElement>(null);

  //console.log("TopicModuleDisplay MOUNTED", name, description.length);
  //useTilg();
  const hasSubmitted = useRef(false);
  useEffect(() => {
    if (!hasSubmitted.current && ref.current) {
      console.log("SUBMIT", name, description.length);

      // Hack to submit the form on mount. Perhaps there is a better way to do this?
      handleSubmit({
        preventDefault: (): void => {
          //
        },
      } as FormEvent<HTMLFormElement>);
      hasSubmitted.current = true;
    }
  }, [ref.current, hasSubmitted.current]);

  //console.log(completion, modules);

  return (
    <>
      <form onSubmit={handleSubmit} ref={ref} className="hidden">
        <input value={input} onChange={handleInputChange} />
      </form>
      {modules.map((module) => {
        const isLast = module === modules[modules.length - 1];
        const isCompleting = isLast && isLoading;
        return (
          <Module
            key={module.name}
            name={module.name}
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
    description,
    isCompleting,
  }: {
    name: string;
    description: string;
    isCompleting: boolean;
  }) {
    const [text, setText] = useAtom(topicTextAtom);
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
        }}
      >
        <div
          className={classNames(
            "relative min-h-[9rem]  w-60 rounded-md border  bg-white p-3  transition-all duration-300",
            {
              "h-[9rem] max-h-0 overflow-hidden": !isHovering,
              "z-10 max-h-[1000rem] translate-y-[-0.75rem] overflow-auto shadow-lg":
                isHovering,
              "opacity-40": isOtherModuleHovering,
              "scale-[.98] border-gray-200": isCompleting,
              "border-gray-200  shadow": !isCompleting,
            }
          )}
          style={{
            // backgroundImage: "linear-gradient(135deg,#faffff,#fbfafb)",
            // border: "1px solid rgba(176,182,253,.05)",
            transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            backgroundImage: isCompleting
              ? "linear-gradient(135deg,#ffffff,#f7f7f7)"
              : "none",
          }}
        >
          <h3
            className={classNames("font-medium transition-opacity", {
              "opacity-90": !isCompleting,
              "opacity-50": isCompleting,
            })}
          >
            {name}
            <span
              className={classNames("animate-pulse transition-all", {
                "text-purple-400": description === "",
                "text-transparent": description !== "",
              })}
            >
              {description === "" ? " █" : ""}
            </span>
          </h3>
          <p className={classNames("mt-1 text-sm")}>
            <span
              className={classNames("transition-opacity", {
                "opacity-80": !isCompleting,
                "opacity-50": isCompleting,
              })}
            >
              {description}
            </span>
            <span
              className={classNames("animate-pulse transition-all", {
                "text-purple-400": description !== "" && isCompleting,
                "text-transparent": description === "" || !isCompleting,
              })}
            >
              {" "}
              █
            </span>
          </p>

          <div
            className={classNames(
              "mt-4  rounded-lg bg-purple-800 p-2 text-center text-xs font-bold text-white  transition-all ",
              {
                "opacity-0": !isHovering,
                "translate–y-0 scale-100 opacity-100 shadow-lg": isHovering,
              }
            )}
          >
            Breakdown Further
          </div>

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
        backgroundImage: "linear-gradient(135deg,#ffffff,#fafafa)",
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
