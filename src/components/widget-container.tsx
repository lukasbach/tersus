import { FC, memo } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Menu,
  Modal,
  ScrollArea,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  IconDots,
  IconGripVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { widgets } from "../widgets";
import { useWidgetRenderProps } from "./use-widget-render-props.tsx";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";
import { FloatingBarContainer } from "./atoms/floating-bar-container.tsx";
import { FloatingBar } from "./atoms/floating-bar.tsx";
import { WidgetConfigureWarning } from "./atoms/widget-configure-warning.tsx";
import { OptionalWidgetHeader } from "./atoms/optional-widget-header.tsx";
import styles from "./widget.module.css";

const WidgetContainerInner: FC<{
  widgetId: string;
  dashboard: ReturnType<typeof useManagedDashboardData>;
  breakpoint: string;
}> = ({ dashboard, widgetId, breakpoint }) => {
  const [settingsOpen, settings] = useDisclosure(false);

  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];

  const renderProps = useWidgetRenderProps(
    widgetId,
    dashboard,
    breakpoint,
    settings.open,
  );

  return (
    <>
      <Modal
        opened={settingsOpen}
        onClose={settings.close}
        title="Edit Widget"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Widget title"
            placeholder="Widget title"
            defaultValue={widget.config.title}
            onChange={(event) =>
              dashboard.updateWidgetConfig(widgetId, {
                title: event.currentTarget.value,
              })
            }
          />
          {widgetDef.referencing && (
            <Select
              withAsterisk
              error={widgetDef.referencing && !widget.config.referencingId}
              label="Referencing widget"
              description={`This widget must reference a ${widgetDef.referencing.name} widget, on which it acts.`}
              placeholder="Pick a widget"
              data={Object.entries(dashboard.data?.widgets ?? {})
                .filter(([, w]) => widgets[w.type] === widgetDef.referencing)
                .map(([id, widget]) => ({
                  value: id,
                  label: widget.config.title,
                }))}
              value={widget.config.referencingId}
              onChange={(value) =>
                dashboard.updateWidgetConfig(widgetId, {
                  referencingId: value as string,
                })
              }
              clearable
            />
          )}
          {widgetDef.ConfigComponent && (
            <widgetDef.ConfigComponent {...(renderProps as any)} />
          )}
        </Stack>
      </Modal>
      <FloatingBarContainer>
        <FloatingBar>
          <ActionIcon
            variant="subtle"
            color="gray"
            className="draghandle"
            style={{ cursor: "grab" }}
          >
            <IconGripVertical />
          </ActionIcon>

          {widgetDef.iconActions?.map((action) => {
            if (action.skip?.(renderProps)) return null;
            if (typeof action.icon === "string") {
              return (
                <Button
                  key={action.text}
                  variant="subtle"
                  color="gray"
                  onClick={() => action.action(renderProps)}
                  size="compact-sm"
                >
                  {action.icon}
                </Button>
              );
            }

            return (
              <ActionIcon
                key={action.text}
                variant="subtle"
                color="gray"
                onClick={() => action.action(renderProps)}
                aria-label={action.text}
              >
                {action.icon && <action.icon {...renderProps} />}
              </ActionIcon>
            );
          })}

          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {widgetDef.menuActions?.map((action) => {
                if (action.skip?.(renderProps)) return null;
                return (
                  <Menu.Item
                    key={action.text}
                    leftSection={
                      action.icon && <action.icon {...renderProps} />
                    }
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
                onClick={() =>
                  modals.openConfirmModal({
                    title: "Delete widget",
                    children: "Are you sure you want to delete this widget?",
                    labels: { cancel: "Cancel", confirm: "Delete widget" },
                    onConfirm: () => dashboard.deleteWidget(widgetId),
                  })
                }
              >
                Delete Widget
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </FloatingBar>
        <Card
          withBorder
          shadow="sm"
          radius="md"
          w="100%"
          h="100%"
          pos="relative"
        >
          <Flex h="100%" direction="column">
            {renderProps.referenceResolved ? (
              <>
                {!widgetDef.skipTitleComponent && (
                  <OptionalWidgetHeader
                    title={renderProps.config.title}
                    icon={renderProps.icon}
                  />
                )}
                <ScrollArea
                  style={{ flexGrow: "1" }}
                  classNames={{ viewport: styles.widgetScrollViewPort }}
                >
                  <widgetDef.DisplayComponent {...renderProps} />
                </ScrollArea>
              </>
            ) : (
              <WidgetConfigureWarning
                onOpenEditModal={renderProps.onOpenEditModal}
              >
                This widget needs to reference another widget
              </WidgetConfigureWarning>
            )}
          </Flex>
        </Card>
      </FloatingBarContainer>
    </>
  );
};

export const WidgetContainer = memo(WidgetContainerInner);
