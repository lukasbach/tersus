import { FC } from "react";
import { ActionIcon, Card, Group, Menu, Text, rem } from "@mantine/core";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { WidgetPayload } from "../types.ts";
import { widgets } from "../widgets";
import { useStableHandler } from "../utils.ts";

export const WidgetContainer: FC<{
  payload: WidgetPayload;
  deleteWidget: () => void;
  updateConfig: (config: any) => void;
}> = ({ payload, deleteWidget, updateConfig }) => {
  const widget = widgets[payload.type];
  const DisplayComponent = widget.displayComponent;
  const ConfigComponent = widget.configComponent;

  const onEdit = useStableHandler(() => {
    modals.open({
      title: "Edit widget",
      children: <ConfigComponent config={payload} onChange={updateConfig} />,
    });
  });

  return (
    <Card withBorder shadow="sm" radius="md" w="100%" h="100%">
      <Card.Section withBorder inheritPadding py="2px">
        <Group justify="space-between">
          <Text className="draghandle" fw={500}>
            Review pictures
          </Text>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconPencil />} onClick={onEdit}>
                Configure Widget
              </Menu.Item>

              <Menu.Item
                leftSection={<IconTrash />}
                color="red"
                onClick={deleteWidget}
              >
                Delete Widget
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
      <div>
        <DisplayComponent
          config={payload}
          onChange={updateConfig}
          onEdit={onEdit}
        />
      </div>
    </Card>
  );
};
