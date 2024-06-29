import { FC, useMemo } from "react";
import { ActionIcon, Card, Flex, Group, Menu, rem } from "@mantine/core";
import {
  IconDots,
  IconGripVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { WidgetPayload, WidgetRenderProps } from "../types.ts";
import { widgets } from "../widgets";
import { useStableHandler } from "../utils.ts";
import styles from "./widget-container.module.css";

export const WidgetContainer: FC<{
  payload: WidgetPayload;
  deleteWidget: () => void;
  updateConfig: (config: any) => void;
}> = ({ payload, deleteWidget, updateConfig }) => {
  const widget = widgets[payload.type];
  const DisplayComponent = widget.displayComponent;
  const ConfigComponent = widget.configComponent;

  let onOpenEditModal: WidgetRenderProps<any>["onOpenEditModal"] | null = null;

  const renderProps = useMemo<WidgetRenderProps<any>>(
    () => ({
      config: payload.config,
      onChange: updateConfig,
      onOpenEditModal: onOpenEditModal!,
    }),
    [onOpenEditModal, payload, updateConfig],
  );

  onOpenEditModal = useStableHandler(() => {
    modals.open({
      title: "Edit widget",
      children: <ConfigComponent {...renderProps} />,
    });
  });

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      w="100%"
      h="100%"
      pos="relative"
      className={styles.container}
    >
      <Flex
        pos="absolute"
        top="5px"
        right="5px"
        bd="1px solid var(--mantine-color-gray-3)"
        p="2px"
        bg="var(--mantine-color-gray-0)"
        style={(theme) => ({ borderRadius: theme.radius.md })}
        className={styles.actionButtons}
      >
        <Group gap="2px">
          <ActionIcon
            variant="subtle"
            color="gray"
            className="draghandle"
            style={{ cursor: "grab" }}
          >
            <IconGripVertical style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>

          {widget.iconActions?.map((action) => {
            if (action.skip?.(renderProps)) return null;
            return (
              <ActionIcon
                key={action.text}
                variant="subtle"
                color="gray"
                onClick={() => action.action(renderProps)}
                aria-label={action.text}
                style={{ cursor: "pointer" }}
              >
                {action.icon && <action.icon />}
              </ActionIcon>
            );
          })}

          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {widget.menuActions?.map((action) => {
                if (action.skip?.(renderProps)) return null;
                return (
                  <Menu.Item
                    key={action.text}
                    leftSection={action.icon && <action.icon />}
                    onClick={() => action.action(renderProps)}
                  >
                    {action.text}
                  </Menu.Item>
                );
              })}

              <Menu.Item leftSection={<IconPencil />} onClick={onOpenEditModal}>
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
      </Flex>
      <div style={{ height: "100%" }}>
        <DisplayComponent {...renderProps} />
      </div>
    </Card>
  );
};
