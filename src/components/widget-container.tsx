import { FC } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Menu,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  IconDots,
  IconGripVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { WidgetPayload } from "../types.ts";
import { widgets } from "../widgets";
import styles from "./widget-container.module.css";
import { useWidgetRenderProps } from "./use-widget-render-props.tsx";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";

export const WidgetContainer: FC<{
  widgetId: string;
  payload: WidgetPayload;
  deleteWidget: () => void;
  updateWidgetConfig: (widgetId: string, config: any) => void;
  dashboard: ReturnType<typeof useManagedDashboardData>;
}> = ({ dashboard, widgetId }) => {
  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];
  const DisplayComponent = widgetDef.displayComponent;

  const renderProps = useWidgetRenderProps(widgetId, dashboard);

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

          {widgetDef.iconActions?.map((action) => {
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
              {widgetDef.menuActions?.map((action) => {
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

              <Menu.Item
                leftSection={<IconPencil />}
                onClick={renderProps.onOpenEditModal}
              >
                Configure Widget
              </Menu.Item>

              <Menu.Item
                leftSection={<IconTrash />}
                color="red"
                onClick={() => dashboard.deleteWidget(widgetId)}
              >
                Delete Widget
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
      <div style={{ height: "100%" }}>
        {renderProps.referenceResolved ? (
          <DisplayComponent {...renderProps} />
        ) : (
          <Center h="100%">
            <Stack>
              <Text>This widget needs to reference another widget</Text>
              <Button onClick={renderProps.onOpenEditModal}>
                Configure widget
              </Button>
            </Stack>
          </Center>
        )}
      </div>
    </Card>
  );
};
