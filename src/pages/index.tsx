import { memo, useEffect, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import classNames from "classnames";
import { atom, useAtom } from "jotai";

const topicText = atom<string>("");
const hoveredModuleAtom = atom<string | null>(null);

const Home: NextPage = () => {
  const [text, setText] = useAtom(topicText);
  const [textVisible, setTextVisible] = useState("");

  useEffect(() => {
    setTextVisible(text);
  }, [text]);

  return (
    <>
      <Head>
        <title>Ghost Writer</title>
        <meta name="description" content="Infinite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1a141c] to-[#3a3142] pt-32">
        <header className="absolute top-0 pt-8">
          <h1 className="mb-8 text-center text-5xl font-extrabold tracking-tight text-white">
            <span className=" stroke-white stroke-zinc-50 text-[hsl(280,100%,70%)]">
              Ghost{" "}
            </span>{" "}
            <span className="text-shadow text-[#7c50ba]">Writer</span>
          </h1>

          <div className="flex flex-row gap-3">
            <input
              className="h-12 w-96 rounded-md bg-[rgba(255,255,255,0.07)] px-4 text-white"
              placeholder="Enter topic, .e.g., Mathematics"
              value={textVisible}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setText(textVisible);
                }
              }}
              onChange={(e) => {
                setTextVisible(e.target.value);
              }}
            />
          </div>
        </header>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {/* <p className="mb-1 text-white">{isFetching && "fetching"}</p>
          <p className="mb-1 text-white">{isStale && "stale"}</p> */}
          <TopicList topicString={text} />
        </div>
      </main>
    </>
  );
};

const TopicList = memo(function TopicList({
  topicString,
}: {
  topicString: string;
}) {
  const {
    isLoading,
    data: topics,
    isStale,
    isFetching,
  } = api.breadth.generateTopics.useQuery(
    { text: topicString },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24 * 7,
    }
  );
  return (
    <div className="flex w-screen flex-col gap-4 overflow-x-auto px-6 pb-6 md:flex-row">
      {isFetching && (
        <>
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
          <TopicLoadingSkeleton />
        </>
      )}

      {!isLoading && topics && (
        <>
          {topics.map((topic) => {
            return (
              <Topic
                key={topic.name}
                name={topic.name}
                description={topic.description}
              />
            );
          })}
        </>
      )}
    </div>
  );
});

const Topic = memo(function Topic({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const {
    isLoading,
    data: modules,
    isFetching,
    isStale,
  } = api.breadth.generateModules.useQuery(
    {
      text: name + ": " + description,
    },
    {
      staleTime: 1000 * 60 * 60 * 24 * 7,
      retryOnMount: false,
    }
  );

  return (
    <div className="flex flex-col">
      <div className="flex h-14 items-center px-3">
        <div className="overflow-hidden align-middle text-base font-bold text-white">
          {name}
        </div>
      </div>

      <div className="flex flex-row gap-3 py-2 md:flex-col">
        {isLoading && <ModulesLoadingSkeleton />}

        {!isLoading &&
          modules &&
          modules.map((module) => (
            <Module
              key={module.name}
              name={module.name}
              description={module.description}
            />
          ))}
      </div>
    </div>
  );
});

const Module = memo(function Module({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const [text, setText] = useAtom(topicText);
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
      onClick={() => {
        setText(text + " " + name);
      }}
    >
      <div
        className={classNames(
          "relative min-h-[9rem]  w-60 rounded-md bg-[rgba(55,55,55,1)] p-3 transition-all",
          {
            "h-[9rem] max-h-0 overflow-hidden": !isHovering,
            "z-10 max-h-[1000rem] translate-y-[-0.75rem] overflow-auto shadow-lg":
              isHovering,
            "opacity-40": isOtherModuleHovering,
          }
        )}
      >
        <h3 className="text-white">{name}</h3>
        {/* <p className="mb-1 text-white">{isFetching && "fetching"}</p>
              <p className="mb-1 text-white">{isStale && "stale"}</p> */}
        <p className="mt-1 text-sm text-white opacity-80">{description}</p>
        <div
          className={classNames(
            "absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-[rgba(55,55,55,1)] to-transparent transition-all",
            {
              "opacity-0": isHovering,
            }
          )}
        />
      </div>
    </div>
  );
});

function TopicLoadingSkeleton() {
  return (
    <div className="flex  flex-col">
      <div className="text-base font-bold text-white">{"   "}</div>

      <div className="flex flex-col gap-2 py-2">
        <TopicTitleLoadingSkeleton />
        <ModulesLoadingSkeleton />
      </div>
    </div>
  );
}

function TopicTitleLoadingSkeleton() {
  return (
    <div className="bg-muted flex w-60 animate-pulse rounded-md rounded-md bg-[rgba(255,255,255,0.15)] p-6" />
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
    <div className="bg-muted flex h-36 w-60  animate-pulse rounded-md rounded-md bg-[rgba(255,255,255,0.07)] p-6" />
  );
}

export default Home;
