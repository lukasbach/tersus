import { Center, TextInput } from "@mantine/core";
import { WidgetDefinition } from "../types.ts";

export const mapsLocationWidget: WidgetDefinition<
  { location: string },
  undefined
> = {
  name: "Maps Location",
  default: {
    title: "Widget Name",
    location: "Karlsruhe Institut of Technology, Germany",
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
        src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(config.location)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
      />
    </Center>
  ),
  ConfigComponent: ({ config, onChange }) => (
    <TextInput
      label="Location"
      value={config.location}
      onChange={(e) => onChange({ location: e.currentTarget.value })}
    />
  ),
  IconComponent: () => <div>XXX</div>,
};
