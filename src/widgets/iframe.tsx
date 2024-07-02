import { Stack, TextInput } from "@mantine/core";
import { IconExternalLink, IconWorldWww } from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";

export const iframeWidget: WidgetDefinition<{ url: string }, undefined> = {
  name: "Iframe Embed",
  IconComponent: IconWorldWww,
  label: "Embed any website in an iframe",
  description: [
    "Embed any website in an iframe.",
    "Use this for any external services or information you want to include in your dashboard.",
  ],
  default: {
    title: "",
    url: "https://lukasbach.com",
  },
  sizing: { w: 4, h: 3 },
  DisplayComponent: ({ config }) => (
    <Stack align="stretch" h="100%" gap="0">
      <iframe
        title={config.title}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "8px",
          flexGrow: "1",
        }}
        frameBorder="0"
        src={config.url}
      />
    </Stack>
  ),
  ConfigComponent: ({ config, onChange }) => (
    <TextInput
      label="From"
      value={config.url}
      onChange={(e) => onChange({ url: e.currentTarget.value })}
    />
  ),
  iconActions: [
    {
      text: "Open Website in new tab",
      action: ({ config }) => {
        window.open(config.url, "_blank");
      },
      icon: () => <IconExternalLink />,
    },
  ],
  menuActions: [
    {
      text: "Open Website in new tab",
      action: ({ config }) => {
        window.open(config.url, "_blank");
      },
      icon: () => <IconExternalLink />,
    },
  ],
};
