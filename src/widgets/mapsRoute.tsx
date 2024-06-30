import { Center, TextInput } from "@mantine/core";
import { WidgetDefinition } from "../types.ts";

export const mapsRouteWidget: WidgetDefinition<
  { from: string; to: string },
  undefined
> = {
  name: "Maps Route",
  default: {
    title: "Widget Name",
    from: "Karlsruhe, Germany",
    to: "Stuttgart, Germany",
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config }) => (
    <Center h="100%">
      {/* from https://www.embed-map.com/ */}
      <iframe
        title={config.title}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "8px",
        }}
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/directions?origin=${encodeURIComponent(config.from)}&destination=${encodeURIComponent(config.to)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
      />
    </Center>
  ),
  ConfigComponent: ({ config, onChange }) => (
    <>
      <TextInput
        label="From"
        value={config.from}
        onChange={(e) => onChange({ from: e.currentTarget.value })}
      />
      <TextInput
        label="To"
        value={config.to}
        onChange={(e) => onChange({ to: e.currentTarget.value })}
      />
    </>
  ),
  IconComponent: () => <div>XXX</div>,
};
