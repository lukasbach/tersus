import { Center } from "@mantine/core";
import { WidgetDefinition } from "../types.ts";

export const sampleWidget: WidgetDefinition<{}, undefined> = {
  name: "Simple Counter",
  default: {
    title: "Widget Name",
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
  DisplayComponent: ({}) => <Center h="100%">Hello</Center>,
  IconComponent: () => <div>XXX</div>,
};
