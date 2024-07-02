import { Stack, TextInput } from "@mantine/core";
import { IconMap2 } from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";

export const mapsLocationWidget: WidgetDefinition<
  { location: string },
  undefined
> = {
  name: "",
  IconComponent: IconMap2,
  label: "Displays a map with a location",
  description: ["Display an Google Maps Embed with a highlighted location"],
  default: {
    title: "",
    location: "Karlsruhe Institut of Technology, Germany",
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config }) => (
    <Stack align="stretch" h="100%" gap="0">
      {/* from https://www.embed-map.com/ */}
      <iframe
        title={config.title}
        style={{
          width: "100%",
          border: "0",
          borderRadius: "8px",
          flexGrow: "1",
        }}
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(config.location)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
      />
    </Stack>
  ),
  ConfigComponent: ({ config, onChange }) => (
    <TextInput
      label="Location"
      value={config.location}
      onChange={(e) => onChange({ location: e.currentTarget.value })}
    />
  ),
};
