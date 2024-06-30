import { Center } from "@mantine/core";
import { Icon123 } from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";

export const sampleWidget: WidgetDefinition<{}, undefined> = {
  name: "Simple Counter",
  IconComponent: Icon123,
  label: "",
  description: [],
  default: {
    title: "Widget Name",
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: () => <Center h="100%">Hello</Center>,
};
