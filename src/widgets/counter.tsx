import { Center, NumberFormatter, Stack, Text, TextInput } from "@mantine/core";
import { IconMinus, IconPlus, IconRotate } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { WidgetDefinition } from "../types.ts";

export const counterWidget: WidgetDefinition<{ value: number; title: string }> =
  {
    name: "Simple Counter",
    default: { value: 0, title: "Counter" },
    sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
    displayComponent: ({ config }) => (
      <Center h="100%">
        <Stack align="start" gap="0">
          <Text size="xs" color="gray">
            {config.title}
          </Text>
          <Text size="2rem" fw="800">
            <NumberFormatter value={config.value} thousandSeparator />
          </Text>
        </Stack>
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
    configComponent: ({ config, onChange }) => (
      <TextInput
        label="Counter title"
        placeholder="Counter title"
        defaultValue={config.title}
        onChange={(event) => onChange({ title: event.currentTarget.value })}
      />
    ),
    iconComponent: () => <div>XXX</div>,
  };
