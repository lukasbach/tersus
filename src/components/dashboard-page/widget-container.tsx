import { ComponentProps, FC, RefObject, memo, useMemo } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Drawer,
  Flex,
  Menu,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  IconBug,
  IconDots,
  IconGripVertical,
  IconMaximize,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import {
  useDebouncedValue,
  useDisclosure,
  useResizeObserver,
} from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { widgets } from "../../widgets";
import { useWidgetRenderProps } from "./use-widget-render-props.tsx";
import { useManagedDashboardData } from "../../use-managed-dashboard-data.ts";
import { FloatingBarContainer } from "../atoms/floating-bar-container.tsx";
import { FloatingBar } from "../atoms/floating-bar.tsx";
import { WidgetConfigureWarning } from "../atoms/widget-configure-warning.tsx";
import { OptionalWidgetHeader } from "../atoms/optional-widget-header.tsx";
import styles from "./widget.module.css";
import { useDebugMode } from "../../use-debug-mode.ts";

const WidgetContainerInner: FC<{
  widgetId: string;
  dashboard: ReturnType<typeof useManagedDashboardData>;
  breakpoint: string;
  widgetRef: RefObject<any>;
  drawerRef: RefObject<any>;
  widgetRect: Omit<DOMRectReadOnly, "toJSON">;
  drawerRect: Omit<DOMRectReadOnly, "toJSON">;
}> = ({
  dashboard,
  widgetId,
  breakpoint,
  widgetRect,
  widgetRef,
  drawerRect,
  drawerRef,
}) => {
  const [settingsOpen, settings] = useDisclosure(false);
  const [drawerOpen, drawer] = useDisclosure(false);
  const [debugMode] = useDebugMode();

  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];

  const renderProps = useWidgetRenderProps(
    widgetId,
    dashboard,
    breakpoint,
    widgetRect,
    settings.open,
  );
  const drawerRenderProps = useMemo(
    () => ({ ...renderProps, rect: drawerRect }),
    [drawerRect, renderProps],
  );

  const menuActions = useMemo(
    () =>
      typeof widgetDef.menuActions === "function"
        ? widgetDef.menuActions(renderProps)
        : widgetDef.menuActions,
    [widgetDef, renderProps],
  );
  const iconActions = useMemo(
    () =>
      typeof widgetDef.iconActions === "function"
        ? widgetDef.iconActions(renderProps)
        : widgetDef.iconActions,
    [widgetDef, renderProps],
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
                  label:
                    widget.config.title ||
                    `Unnamed ${widgets[widget.type].name} widget`,
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

          {iconActions?.map((action) => {
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
              {menuActions?.map((action) => {
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

              {menuActions && <Menu.Divider />}

              <Menu.Item leftSection={<IconMaximize />} onClick={drawer.open}>
                Fullscreen
              </Menu.Item>

              <Menu.Item
                leftSection={<IconPencil />}
                onClick={renderProps.onOpenEditModal}
              >
                Configure Widget
              </Menu.Item>

              {debugMode && (
                <Menu.Item
                  leftSection={<IconBug />}
                  onClick={() => {
                    console.log(
                      `Widget-data of ${widget.type}/${renderProps.id}:`,
                      widget.config,
                    );
                    modals.open({
                      title: `Widget-data of ${widget.type}/${renderProps.id}`,
                      children: (
                        <pre>{JSON.stringify(widget.config, null, 2)}</pre>
                      ),
                    });
                  }}
                >
                  Show payload
                </Menu.Item>
              )}

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
        <Card className={styles.container} withBorder shadow="sm" radius="md">
          <Flex h="100%" direction="column" ref={widgetRef}>
            {renderProps.referenceResolved ? (
              <>
                {!widgetDef.skipTitleComponent && (
                  <OptionalWidgetHeader
                    title={renderProps.config.title}
                    icon={renderProps.icon}
                  />
                )}
                <Box
                  style={{
                    flexGrow: "1",
                    overflow: "auto",
                  }}
                >
                  <widgetDef.DisplayComponent {...renderProps} />
                </Box>
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
      <Drawer
        opened={drawerOpen}
        onClose={drawer.close}
        size="90%"
        styles={{ body: { height: "100%" } }}
        withCloseButton={false}
      >
        <Box ref={drawerRef} h="100%">
          <widgetDef.DisplayComponent {...drawerRenderProps} />
        </Box>
      </Drawer>
    </>
  );
};

const WidgetContainerInnerMemo = memo(WidgetContainerInner);
const WidgetContainerOuter: FC<
  Omit<
    ComponentProps<typeof WidgetContainerInner>,
    "widgetRect" | "drawerRect" | "widgetRef" | "drawerRef"
  >
> = (props) => {
  const [widgetRef, widgetRectRaw] = useResizeObserver();
  const [drawerRef, drawerRectRaw] = useResizeObserver();

  const [widgetRect] = useDebouncedValue(widgetRectRaw, 300);
  const [drawerRect] = useDebouncedValue(drawerRectRaw, 300);

  return (
    <WidgetContainerInnerMemo
      {...props}
      widgetRef={widgetRef}
      widgetRect={widgetRect}
      drawerRef={drawerRef}
      drawerRect={drawerRect}
    />
  );
};

export const WidgetContainer = memo(WidgetContainerOuter);
