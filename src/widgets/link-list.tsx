import { Button, Checkbox, Group, Stack, TextInput } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { WidgetDefinition } from "../types.ts";
import { FieldList } from "../components/atoms/field-list.tsx";
import { randId } from "../utils.ts";
import { WidgetConfigureWarning } from "../components/atoms/widget-configure-warning.tsx";
import { OptionalWidgetHeader } from "../components/atoms/optional-widget-header.tsx";

type Anchor = {
  key: string;
  title: string;
  url: string;
};

export const linkListWidget: WidgetDefinition<
  { links: Anchor[]; openInNewTab: boolean },
  undefined
> = {
  name: "Link List",
  IconComponent: IconExternalLink,
  label: "List of anchor links to external resources",
  description: [
    "This widget allows you to add a list of links to external resources.",
    "Use this to quickly access your favorite websites or services.",
    "You can customize the URL and the title of each link in the widget settings.",
  ],
  default: {
    title: "Link List",
    links: [],
    openInNewTab: true,
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: ({ config, icon, onOpenEditModal }) =>
    config.links.length === 0 ? (
      <WidgetConfigureWarning onOpenEditModal={onOpenEditModal}>
        No links configured for this widget.
      </WidgetConfigureWarning>
    ) : (
      <>
        <OptionalWidgetHeader title={config.title} icon={icon} />
        <Stack>
          {config.links.map((link) => (
            <Button
              component="a"
              key={link.key}
              href={link.url}
              target={config.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              variant="light"
            >
              {link.title}
            </Button>
          ))}
        </Stack>
      </>
    ),
  ConfigComponent: ({ config, onChange }) => (
    <>
      <Checkbox
        label="Open links in new tab"
        checked={config.openInNewTab}
        onChange={(e) => onChange({ openInNewTab: e.target.checked })}
      />
      <FieldList<Anchor>
        label="Links"
        description="Define a set of links to display"
        addLabel="Add Link"
        getKey={(item) => item.key}
        value={config.links}
        onChange={(links) => onChange({ links })}
        renderField={(value, onChange) => (
          <Group wrap="nowrap" align="start">
            <TextInput
              style={{ flexGrow: "1" }}
              label="Title"
              placeholder="Title"
              defaultValue={value.title}
              onChange={(event) =>
                onChange({
                  title: event.currentTarget.value ?? value.title,
                })
              }
            />
            <TextInput
              style={{ flexGrow: "1" }}
              label="URL Target"
              placeholder="URL Target"
              defaultValue={value.url}
              onChange={(event) =>
                onChange({
                  url: event.currentTarget.value ?? value.url,
                })
              }
            />
          </Group>
        )}
        createItem={() => ({
          title: "My homepage",
          url: "https://lukasbach.com",
          key: randId(),
        })}
      />
    </>
  ),
};
