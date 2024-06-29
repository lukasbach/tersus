import { Center, NumberFormatter } from "@mantine/core";
import { IconMinus, IconPlus, IconRotate } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { WidgetDefinition } from "../types.ts";
import { Stat } from "../components/atoms/stat.tsx";

export const counterWidget: WidgetDefinition<{ value: number }, undefined> = {
  name: "Simple Counter",
  default: { value: 0, title: "Counter" },
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  displayComponent: ({ config }) => (
    <Center h="100%">
      <Stat title={config.title}>
        <NumberFormatter value={config.value} thousandSeparator />
      </Stat>
    </Center>
  ),
  iconActions: [
    {
      icon: IconPlus,
      text: "Increment",
      action: (props) => props.onChange({ value: props.config.value + 1 }),
    },
    {
      icon: IconMinus,
      text: "Decrement",
      action: (props) => props.onChange({ value: props.config.value - 1 }),
    },
  ],
  menuActions: [
    {
      icon: IconRotate,
      text: "Reset",
      action: (props) =>
        modals.openConfirmModal({
          title: "Reset the counter",
          children: "Do you want to reset the counter value to 0?",
          labels: { cancel: "Cancel", confirm: "Reset" },
          onConfirm: () => props.onChange({ value: 0 }),
        }),
    },
  ],
  iconComponent: () => <div>XXX</div>,
};
