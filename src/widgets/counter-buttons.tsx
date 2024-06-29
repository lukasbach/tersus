import { Button, Center } from "@mantine/core";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { counterWidget } from "./counter.tsx";

export const counterButtonsWidget: WidgetDefinition<
  {},
  PayloadOfWidgetDefinition<typeof counterWidget>
> = {
  referencing: counterWidget,
  name: "Counter Buttons",
  default: { title: "Counter" },
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  displayComponent: ({ config, referencing }) => (
    <Center h="100%">
      <Button
        onClick={() => {
          referencing?.onChange({ value: referencing.config.value + 1 });
        }}
      >
        Increase
      </Button>
    </Center>
  ),
  configComponent: ({ config, onChange }) => <>Hello</>,
  iconComponent: () => <div>XXX</div>,
};
