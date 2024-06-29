import { Center, NumberFormatter } from "@mantine/core";
import { IconMinus, IconPlus, IconRotate } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { WidgetDefinition } from "../types.ts";
import { Stat } from "../components/atoms/stat.tsx";

export type HistoryItem = {
  from: number;
  to: number;
  value: number;
};

type Payload = { value: number; history: HistoryItem[]; granularity: number };

export const applyCounterChange = (
  config: Payload,
  onChange: (payload: Partial<Payload>) => void,
  diff: number,
) => {
  const value = config.value + diff;
  const latestHistoryItem = config.history.at(-1);
  if (latestHistoryItem && latestHistoryItem.to > Date.now()) {
    latestHistoryItem.value = value;
  } else {
    config.history.push({
      from: Date.now(),
      to: Date.now() + config.granularity,
      value,
    });
  }
  onChange({ history: config.history, value });
};

export const counterWidget: WidgetDefinition<Payload, undefined> = {
  name: "Simple Counter",
  default: {
    value: 0,
    title: "Counter",
    history: [],
    // granularity: 1000 * 60 * 60 * 24,
    granularity: 5000,
  },
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
      action: (props) => applyCounterChange(props.config, props.onChange, 1),
    },
    {
      icon: IconMinus,
      text: "Decrement",
      action: (props) => applyCounterChange(props.config, props.onChange, -1),
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
          onConfirm: () => props.onChange({ value: 0, history: [] }),
        }),
    },
  ],
  iconComponent: () => <div>XXX</div>,
};
