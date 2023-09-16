import { memo, useEffect, useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { type NextPage } from "next";
import Head from "next/head";
import classNames from "classnames";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithHash } from "jotai-location";
import { atomWithStorage } from "jotai/utils";
import { useAnimate } from "framer-motion";
import FanIcon from "./../icons/fan.svg";
import CogIcon from "./../icons/cog.svg";
import InfoIcon from "./../icons/info.svg";
import SendIcon from "./../icons/send.svg";
import ClickIcon from "./../icons/click.svg";

const rainbowGradient =
  "linear-gradient(135deg,#f90,#fd66cb 25%,#9f6eff 50%,#0af 75%,#0ea)";

const queryStringAtom = atomWithHash<string>("query", "");
const errorAtom = atom<string | null>(null);
const settingsModalOpenAtom = atom<boolean>(false);
const apiKeyAtom = atomWithStorage<string>("api-key", "");
const hoveredModuleAtom = atom<string | null>(null);
const rawCompletionTextAtom = atom<string>("");
const isRawCompletionLoadingAtom = atom<boolean>(false);

type ModuleCard = {
  name: string;
  subname?: string;
  description: string;
};

const topicsAtom = atom<{ name: string; description: string }[]>((get) => {
  const rawCompletionText = get(rawCompletionTextAtom);

  if (rawCompletionText === "") return [];

  const topics = rawCompletionText.split("\n\n").map((topicString) => ({
    name: topicString.split(":")[0] || "",
    description: topicString.split(":")[1] || "",
  }));
  return topics;
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>10×</title>
        <meta name="description" content="10×" />
        <link rel="icon" href="/logo.png" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="108x108" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b  pt-16">
        <header className="flex flex-col items-center">
          <h1 className="mb-6 px-3 text-center  font-extrabold tracking-tight">
            <span
              className="text-5xl text-slate-100"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, hsla(215, 20%,15%, 1), hsla(215, 20%,50%, 1) )",
                letterSpacing: "-0.025em",
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              10×.cards
            </span>
          </h1>
          <FancyBadge />
          <Form />
          <SuggestedSearches />
          <SettingsCog />
        </header>

        <div className="container flex flex-col items-center justify-center gap-12 pb-16 pt-8 md:px-4">
          <AllTopics />
        </div>
        <ModuleModal />
        <ErrorModal />
        <SettingsModal />
      </main>
    </>
  );
};

const moduleInModalAtom = atom<ModuleCard | null>(null);

function ModuleModal() {
  const [module, setModule] = useAtom(moduleInModalAtom);
  const [, setQueryString] = useAtom(queryStringAtom);
  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex h-full w-full max-w-3xl flex-col items-center justify-center overflow-auto bg-white shadow-lg">
        <div className="items- flex h-full w-full flex-col justify-center p-4">
          <h2 className="text-2xl font-bold">{module.name}</h2>
          {module.subname ? (
            <h3 className="text-lg  opacity-50">{module.subname}</h3>
          ) : null}
          <p className="pt-2 text-lg ">{module.description}</p>
          <div className="">
            <button
              className="mt-4 rounded-md bg-slate-700 px-4 py-2 font-bold text-white"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                setQueryString((prev) => prev + " " + module.name);
                setModule(null);
              }}
            >
              Search
            </button>
          </div>
        </div>
        <button
          className="absolute right-0 top-0 p-4"
          onClick={() => {
            setModule(null);
          }}
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

function ErrorModal() {
  const [error, setError] = useAtom(errorAtom);

  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex max-w-lg flex-col items-center justify-center overflow-auto rounded-md bg-white shadow-lg">
        <div className="items- flex h-full w-full flex-col justify-center p-4">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="pt-2 text-lg ">{error}</p>
          <div className="flex items-end justify-center">
            <button
              className="mt-4 w-44 rounded-md bg-slate-700 px-4 py-2 font-bold text-white"
              onClick={() => {
                setError(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function maskKey(key: string) {
  if (key.length < 8) return key;

  return key.slice(0, 3) + "∙".repeat(14) + key.slice(-3);
}

function SettingsCog() {
  const [, setIsOpen] = useAtom(settingsModalOpenAtom);
  return (
    <div
      className="absolute right-6 top-6 cursor-pointer opacity-70 transition-opacity hover:opacity-90"
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <CogIcon
        style={{
          width: "1.7em",
          height: "1.7em",
        }}
      />
    </div>
  );
}

function SettingsModal() {
  const [queryString, setQueryString] = useAtom(queryStringAtom);
  const [isOpen, setIsOpen] = useAtom(settingsModalOpenAtom);
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [apiKeyValue, setApiKeyValue] = useState("");
  const displayApiKey = maskKey(apiKey);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <div
        className="relative flex max-w-lg flex-col items-center justify-center overflow-auto rounded-md border-4 border-white bg-white shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="items- flex h-full w-full flex-col justify-center  px-6 py-8">
          <div
            className="absolute bottom-0 left-0 right-0 top-0 z-0 m-auto rounded-md border"
            style={{
              backgroundImage: rainbowGradient,
              opacity: 0.15,
            }}
          />

          <div className="z-10">
            <h3>
              <span className="text-2xl font-bold">Settings</span>
            </h3>
            <p className="pt-4 font-bold">
              {apiKey ? "API Key" : "Enter API Key"}
            </p>

            {apiKey ? (
              <div className="mt-2 flex gap-2 border-b border-white pb-10">
                <input
                  className=" w-full rounded-md bg-white px-4 py-2  text-slate-950"
                  value={displayApiKey}
                  disabled
                  placeholder="sk-•••••••••••••••••••••••••"
                />
                <button
                  type="submit"
                  className="w-24 rounded-md bg-white px-4 py-2 font-bold text-gray-500"
                  onClick={() => {
                    setApiKey("");
                    setApiKeyValue("");
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form
                className="mt-2 flex gap-2 border-b border-neutral-100 pb-10"
                onSubmit={() => {
                  setApiKey(apiKeyValue);
                  setIsOpen(false);
                  setQueryString("");
                  setQueryString(queryString);
                }}
              >
                <input
                  className=" w-full rounded-md bg-white px-4 py-2  text-slate-950"
                  value={apiKeyValue}
                  onChange={(e) => {
                    setApiKeyValue(e.target.value);
                  }}
                  placeholder="sk-•••••••••••••••••••••••••"
                />
                <button
                  type="submit"
                  className=" w-44 rounded-md bg-slate-700 px-4 py-2 font-bold text-white"
                >
                  Save
                </button>
              </form>
            )}

            <div className="mt-10 rounded-md  bg-white p-4 text-sm">
              <div className="flex items-center gap-2 pb-4 text-center font-bold opacity-80">
                <InfoIcon style={{ width: "1.2em", height: "1.2em" }} />
                <span>OpenAI API Key Required</span>
              </div>
              <p className="font-semibold text-slate-600 opacity-80">Access</p>
              <p className="text-slate-950 opacity-80">
                10x runs on GPT-3.5 and an API key is required for use, which
                can be found here:{" "}
                <a
                  className="underline"
                  target="_blank"
                  href="https://beta.openai.com/account/api-keys"
                >
                  https://beta.openai.com/account/api-keys
                </a>
              </p>
              <p className="mt-4 font-semibold text-slate-600 opacity-80">
                Usage Limit
              </p>
              <p className="text-slate-950 opacity-80">
                This tool runs multiple completions in parallel, which can use a
                lot of tokens. Please ensure your account has an appropriate
                usage limit set and monitor your usage to avoid surprises.
              </p>

              <p className="mt-4 font-semibold text-slate-600 opacity-80">
                Keys are stored in your browser
              </p>
              <p className="text-slate-960 opacity-80">
                Your key are only sent to the server when a request that
                requires the OpenAI API is made. Your keys are not stored or
                logged on the server or sent anywhere else. Although care is
                taken to keep your keys safe, no guarantees are made.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useHandleCompletionError() {
  const [queryString, setQueryString] = useAtom(queryStringAtom);
  const [, setError] = useAtom(errorAtom);
  const [, setSettingsOpen] = useAtom(settingsModalOpenAtom);
  //console.log(error);

  return (error: Error | undefined) => {
    console.log("error", error);
    if (error) {
      // setQueryString("");
      // stop();
      if (error.message === "Missing API key") {
        setSettingsOpen(true);
        return;
      }

      setError(error.message);
    }
  };
}

function Form() {
  const [apiKey] = useAtom(apiKeyAtom);
  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    setInput,
    complete,
  } = useCompletion({
    api: "/api/topics",
    id: "topics",
    headers: {
      "x-api-key": apiKey,
    },
    onError: useHandleCompletionError(),
  });
  const [queryString, setQueryString] = useAtom(queryStringAtom);
  const [, setRawCompletionText] = useAtom(rawCompletionTextAtom);
  const [, setIsLoading] = useAtom(isRawCompletionLoadingAtom);
  const formRef = useRef<HTMLFormElement>(null);
  //useHandleCompletionError(error, stop);

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
    <>
      <form
        ref={formRef}
        className="relative flex w-[100vw] flex-row items-center px-4 md:w-96"
        onSubmit={(e) => {
          if (input !== "") {
            setQueryString(input); // useEffect above will trigger 'complete'
          }
          e.stopPropagation();
        }}
      >
        <input
          className="h-12 w-full  rounded-md bg-slate-100 px-4 pr-14 "
          placeholder="Enter topic, .e.g., Mathematics"
          value={input}
          onChange={handleInputChange}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="absolute right-4 flex cursor-pointer items-center justify-center  px-3 py-3 font-bold text-white"
        >
          <SendIcon className="h-5 w-5" fill="rgba(0,0,0,.15)" />
        </button>
      </form>
      {/* {error && <div className="text-sm text-red-500">{error.message}</div>} */}
    </>
  );
}

const SuggestedSearches = () => {
  const [, setQueryString] = useAtom(queryStringAtom);
  return (
    <div className="mt-6 flex flex-col gap-2 md:flex-row md:justify-center">
      <div className="flex flex-row gap-1 pl-4 text-sm font-bold text-slate-700 md:justify-center">
        <ClickIcon
          className="opacity-80"
          style={{
            width: "1.4em",
            height: "1.4em",
          }}
        />
        Try:
      </div>
      <ul className="flex list-none flex-row gap-2 overflow-scroll px-4 pb-4 text-xs text-slate-700">
        <li className="flex-shrink-0 ">
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Travelling to New Zealand");
            }}
          >
            Travelling to New Zealand
          </button>
        </li>
        <li className="flex-shrink-0 ">
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Pancake Recipe");
            }}
          >
            Pancake Recipe
          </button>
        </li>
        <li className="flex-shrink-0 ">
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Overview of History of Greece");
            }}
          >
            Overview Rome History
          </button>
        </li>
        <li className="flex-shrink-0 ">
          <button
            className="cursor-pointer rounded-md bg-slate-100 px-2 py-1"
            onClick={() => {
              setQueryString("Timeline of the 20th century");
            }}
          >
            Timeline of the 20th century
          </button>
        </li>
        <li className="flex-shrink-0">
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
          { rotate: 360 * 80 },
          {
            ease: "easeInOut",
            duration: 12,
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

const AllTopics = function TopicList() {
  const topics = useAtomValue(topicsAtom);
  const minimumCountToDisplay = 6;
  const loadingSkeletonCount = minimumCountToDisplay - topics.length;
  return (
    <div className="flex w-screen flex-col gap-2 overflow-x-auto overflow-y-visible pb-14 md:flex-row md:px-6">
      {topics.map((topic, i) => {
        const isLast = i === topics.length - 1;
        const { name, description } = topic;

        return (
          <Topic
            key={i}
            name={name}
            description={description}
            isLast={isLast}
          />
        );
      })}

      {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
        <TopicLoadingSkeleton key={`skeleteon${i}`} />
      ))}
    </div>
  );
};

const Topic = memo(function Topic({
  name,
  description,
  isLast,
}: {
  name: string;
  description: string;
  isLast: boolean;
}) {
  const [queryString, setQueryString] = useAtom(queryStringAtom);
  const isFetching = useAtomValue(isRawCompletionLoadingAtom);
  const shouldStartRendering = !isLast || !isFetching;

  return (
    <div className="flex flex-col">
      <div className="relative flex h-16 items-center overflow-hidden text-ellipsis px-3 hover:overflow-visible">
        <button
          onClick={() => {
            setQueryString(`${queryString.replace(name, "")} ${name}`);
          }}
          className={classNames(
            "pl-3 text-left align-middle text-sm font-bold hover:underline"
          )}
          role="button"
        >
          {name.slice(0, 70)}
          {!shouldStartRendering ? <Cursor /> : null}
        </button>
        <div
          className={classNames(
            "absolute left-0 top-0 h-4 w-full bg-gradient-to-t from-transparent to-[#ffffff] transition-all"
          )}
        />
        <div
          className={classNames(
            "absolute bottom-0 left-0 h-4 w-full bg-gradient-to-t from-[#ffffff] to-transparent transition-all"
          )}
        />
      </div>
      <div className="flex flex-row gap-3 overflow-x-auto px-4 pb-6 md:flex-col md:overflow-x-visible md:py-2 md:pl-3 md:pr-0">
        {shouldStartRendering ? (
          <TopicModuleDisplay name={name} description={description} />
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
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

const TopicModuleDisplay = memo(function TopicModuleDisplay({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const [queryString] = useAtom(queryStringAtom);
  const initialInput = `${queryString} ${name}: ${description}`;
  const [apiKey] = useAtom(apiKeyAtom);
  const { completion, complete, input, stop, isLoading, error } = useCompletion(
    {
      api: "/api/modules",
      initialInput,
      id: name + ": " + description,
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  //useHandleCompletionError(error);

  const modules: ModuleCard[] =
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
  const minimumCountToDisplay = 6;
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
      {modules.map((module, i) => {
        const isLast = module === modules[modules.length - 1];
        const isCompleting = isLast && isLoading;
        return (
          <Module
            key={`${module.name}${i}`}
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
});

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
    const isTouchDevice =
      typeof window !== "undefined" && "ontouchstart" in window;

    const [, setModuleInModalAtom] = useAtom(moduleInModalAtom);
    //const isOtherModuleHovering = hoveredModule !== null && !isHovering;

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
          if (isTouchDevice) {
            setModuleInModalAtom({
              name,
              subname: subName,
              description,
            });

            return;
          }

          setText(text + " " + name);
          // Scroll to top
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <div
          className={classNames(
            "relative min-h-[9rem]  w-60 rounded-md border  bg-white p-3  transition-all duration-300",
            {
              //"opacity-60": isOtherModuleHovering,
              "scale-[.98] ": isCompleting,
              //"shadow-md": !isCompleting,
              "0 h-[9rem] max-h-0 overflow-hidden border-gray-200": !isHovering,
              "z-10 max-h-[1000rem] translate-y-[-0.75rem] overflow-auto border-gray-200 shadow-md":
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
      className="bg-muted flex w-60 animate-pulse rounded-md p-6"
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
      className="bg-muted flex h-36 w-60 flex-shrink-0 scale-[.98] animate-pulse rounded-md border border-gray-200 bg-[rgba(255,255,255,0.07)] p-6"
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
