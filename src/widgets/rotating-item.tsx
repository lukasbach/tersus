import { Center, TextInput, Textarea } from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowsRandom,
  IconUsers,
} from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";
import { Stat } from "../components/atoms/stat.tsx";
import { randomInteger } from "../utils.ts";

export const rotatingItemWidget: WidgetDefinition<
  { items: string[]; itemName: string; lastIndex?: number; lastDate?: number },
  undefined
> = {
  name: "Rotating Item",
  IconComponent: IconUsers,
  label: "Keep a list of items to rotate through",
  description: [
    "This widget allows you to keep a list of items and rotate through them.",
    "You can pick the next item manually or let the widget pick one randomly, while keeping track of the last item that was picked.",
    "You can use this to keep a list of people and rotate through them for chores, keep a list of recipes you want to try and rotate through, or keep a list of exercises to rotate through for your workout.",
  ],
  default: {
    title: "",
    itemName: "Person to cleanup",
    items: ["Michael", "Jim", "Dwight", "Pam", "Ryan"],
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config }) => (
    <Center h="100%">
      <Stat
        title={
          config.lastDate && config.lastDate > Date.now() - 1000 * 60 * 5
            ? `The next ${config.itemName} is...`
            : `The last ${config.itemName} was...`
        }
      >
        {config.lastIndex !== undefined
          ? config.items[config.lastIndex % config.items.length]
          : "Never picked"}
      </Stat>
    </Center>
  ),
  ConfigComponent: ({ config, onChange }) => (
    <>
      <Textarea
        label="Items to choose from"
        description="One item per line"
        defaultValue={config.items.join("\n")}
        rows={8}
        onChange={(e) => {
          onChange({ items: e.currentTarget.value.split("\n") });
        }}
      />
      <TextInput
        label="Item name"
        placeholder="Item name"
        description="How items are referred to in the widget"
        defaultValue={config.itemName}
        onChange={(event) =>
          onChange({
            itemName: event.currentTarget.value,
          })
        }
      />
    </>
  ),
  iconActions: [
    {
      icon: "Pick next",
      text: "Pick next",
      action: ({ config, onChange }) =>
        onChange({
          lastIndex: (config.lastIndex ?? -1) + 1,
          lastDate: Date.now(),
        }),
    },
  ],
  menuActions: [
    {
      text: "Pick previous",
      icon: () => <IconArrowLeft />,
      action: ({ config, onChange }) =>
        onChange({
          lastIndex: (config.lastIndex ?? 1) - 1,
          lastDate: Date.now(),
        }),
    },
    {
      text: "Pick random",
      icon: () => <IconArrowsRandom />,
      action: ({ config, onChange }) =>
        onChange({
          lastIndex: randomInteger(0, config.items.length - 1),
          lastDate: Date.now(),
        }),
    },
  ],
};
