import React from "react";
import * as Primatives from "@radix-ui/react-dropdown-menu";
import cn from "classnames";
import { type TopicPromptKey } from "../../prompts/prompts";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

const options = [
  "Overview",
  "Recipe",
  //"Habit Plan",
  //   "Project Plan",
  //   "Travel Plan",
  //   "Fitness Routine",
  //   "Learning Plan",
  //   "Event Plan",
  //   "Document layout",
  //   "Recipe",
] as TopicPromptKey[];

export const DropdownMenu = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: (typeof options)[number]) => void;
}) => {
  return (
    <Primatives.Root>
      <Primatives.Trigger asChild>
        <button
          className="rounded-lg border px-8"
          aria-label="Customise options"
        >
          <div className="font-bold text-white">{value}</div>
        </button>
      </Primatives.Trigger>

      <Primatives.Portal>
        <Primatives.Content
          className="rounded-lg border text-white"
          sideOffset={5}
        >
          {options.map((option, i) => (
            <Primatives.Item key={option}>
              <button
                className={cn("rounded-lg px-4 py-4", {
                  "bg-gray-700": value === option,
                })}
                aria-label="Customise options"
                onClick={() => onChange(option)}
              >
                <div className="font-bold text-white">{option}</div>
              </button>
            </Primatives.Item>
          ))}
        </Primatives.Content>
      </Primatives.Portal>
    </Primatives.Root>
  );
};
