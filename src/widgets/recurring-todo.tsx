import { Center } from "@mantine/core";
import { IconCheck, IconClockHour8 } from "@tabler/icons-react";
import ReactTimeAgo from "react-time-ago";
import { WidgetDefinition } from "../types.ts";
import { FrequencyInput } from "../components/atoms/frequency-input.tsx";
import { Stat } from "../components/atoms/stat.tsx";

export const recurringTodoWidget: WidgetDefinition<
  {
    lastDone: null | number;
    frequency: number;
  },
  undefined
> = {
  name: "Recurring Todo",
  IconComponent: IconClockHour8,
  label: "Reminds you to do a task regularly",
  description: [
    "This widget reminds you to do a task regularly.",
    "It shows you when you last did the task and how long it has been since then, and highlights the widget if a custom frequency has passed since the last time you did the task.",
  ],
  default: {
    lastDone: null,
    frequency: 1000 * 60 * 60 * 24 * 7,
    title: "Take out the trash",
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  DisplayComponent: ({ config }) => (
    <Center h="100%">
      <Stat
        title={config.title}
        alert={
          !!config.lastDone && config.lastDone < Date.now() - config.frequency
        }
        subtitle={
          config.lastDone && (
            <>
              Next <ReactTimeAgo date={config.lastDone + config.frequency} />
            </>
          )
        }
      >
        {config.lastDone ? <ReactTimeAgo date={config.lastDone} /> : "Never"}
      </Stat>
    </Center>
  ),
  iconActions: [
    {
      icon: () => <IconCheck />,
      text: "Done now!",
      action: (props) => props.onChange({ lastDone: Date.now() }),
    },
  ],
  ConfigComponent: ({ config, onChange }) => (
    <FrequencyInput
      mt="xs"
      label="Frequency"
      value={config.frequency}
      onChangeFrequency={(frequency) => onChange({ frequency })}
    />
  ),
};
