import { Center, TextInput, Textarea } from "@mantine/core";
import { IconArrowLeft, IconArrowsRandom } from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";
import { Stat } from "../components/atoms/stat.tsx";
import { randomInteger } from "../utils.ts";

export const rotatingItemWidget: WidgetDefinition<
  { items: string[]; itemName: string; lastIndex?: number; lastDate?: number },
  undefined
> = {
  name: "Rotating Item",
  default: {
    title: "Widget Name",
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
  IconComponent: () => <div>XXX</div>,
};
