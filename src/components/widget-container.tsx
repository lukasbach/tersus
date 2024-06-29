import { FC } from "react";
import { ActionIcon, Card, Group, Menu, Text, rem } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { WidgetPayload } from "../types.ts";

export const WidgetContainer: FC<{
  widget: WidgetPayload;
  deleteWidget: () => void;
}> = ({ widget, deleteWidget }) => {
  return (
    <Card withBorder shadow="sm" radius="md" w="100%" h="100%">
      <Card.Section withBorder inheritPadding py="xs">
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
      <div>hello</div>
    </Card>
  );
};
