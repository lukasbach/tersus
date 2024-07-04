import { Center, NumberFormatter } from "@mantine/core";
import {
  Icon123,
  IconExposurePlus2,
  IconMinus,
  IconPencilCog,
  IconPlus,
  IconRotate,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { WidgetDefinition } from "../types.ts";
import { Stat } from "../components/atoms/stat.tsx";
import { visualRound } from "../utils.ts";
import { promptNumber } from "../modal-utils.tsx";

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
  IconComponent: Icon123,
  label: "A counter widget to keep track of a number",
  description: [
    "This widget allows you to keep track of a number and increment or decrement it.",
    "You can expand the counter with the counter-graph widget to visualize historical data of your count, or with the counter-buttons widget to have customizable count-buttons.",
  ],
  default: {
    value: 0,
    title: "",
    history: [],
    // granularity: 1000 * 60 * 60 * 24,
    granularity: 5000,
  },
  skipTitleComponent: true,
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  DisplayComponent: ({ config }) => (
    <Center h="100%">
      <Stat title={config.title}>
        <NumberFormatter
          value={visualRound(config.value ?? 0)}
          thousandSeparator
        />
      </Stat>
    </Center>
  ),
  iconActions: [
    {
      icon: () => <IconPlus />,
      text: "Increment",
      action: (props) => applyCounterChange(props.config, props.onChange, 1),
    },
    {
      icon: () => <IconMinus />,
      text: "Decrement",
      action: (props) => applyCounterChange(props.config, props.onChange, -1),
    },
  ],
  menuActions: [
    {
      icon: () => <IconExposurePlus2 />,
      text: "Add custom value",
      action: (props) =>
        promptNumber({
          title: "Add custom value",
          children: "Which value do you want to add to the current count?",
          labels: { submit: "Add value" },
          onSubmitModal: (value) =>
            applyCounterChange(props.config, props.onChange, value),
        }),
    },
    {
      icon: () => <IconPencilCog />,
      text: "Set to custom value",
      action: (props) =>
        promptNumber({
          title: "Set to custom value",
          children: "Which value do you want to set the counter to?",
          labels: { submit: "Set value" },
          onSubmitModal: (value) =>
            applyCounterChange(
              props.config,
              props.onChange,
              value - props.config.value,
            ),
        }),
    },
    {
      icon: () => <IconRotate />,
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
};
