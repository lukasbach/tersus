import { Center, Stack, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ReactTimeAgo from "react-time-ago";
import { WidgetDefinition } from "../types.ts";
import { FrequencyInput } from "../components/atoms/frequency-input.tsx";

export const recurringTodoWidget: WidgetDefinition<{
  title: string;
  lastDone: null | number;
  frequency: number;
}> = {
  name: "Recurring Todo",
  default: {
    lastDone: null,
    frequency: 1000 * 60 * 60 * 24 * 7,
    title: "Take out the trash",
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  displayComponent: ({ config }) => (
    <Center h="100%">
      <Stack align="start" gap="0">
        <Text size="xs" color="gray">
          {config.title}
        </Text>
        <Text
          size="2rem"
          fw="800"
          color={
            config.lastDone && config.lastDone < Date.now() - config.frequency
              ? "red"
              : undefined
          }
        >
          {config.lastDone ? <ReactTimeAgo date={config.lastDone} /> : "Never"}
        </Text>
      </Stack>
    </Center>
  ),
  iconActions: [
    {
      icon: IconPlus,
      text: "Done now!",
      action: (props) => props.onChange({ lastDone: Date.now() }),
    },
  ],
  configComponent: ({ config, onChange }) => (
    <>
      <TextInput
        label="Counter title"
        placeholder="Counter title"
        defaultValue={config.title}
        onChange={(event) => onChange({ title: event.currentTarget.value })}
      />
      <FrequencyInput
        mt="xs"
        label="Frequency"
        value={config.frequency}
        onChangeFrequency={(frequency) => onChange({ frequency })}
      />
    </>
  ),
  iconComponent: () => <div>XXX</div>,
};
