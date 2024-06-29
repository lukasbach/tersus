import { FC } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconDots,
  IconGripVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { widgets } from "../widgets";
import { useWidgetRenderProps } from "./use-widget-render-props.tsx";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";
import { FloatingBarContainer } from "./atoms/floating-bar-container.tsx";
import { FloatingBar } from "./atoms/floating-bar.tsx";

export const WidgetContainer: FC<{
  widgetId: string;
  dashboard: ReturnType<typeof useManagedDashboardData>;
}> = ({ dashboard, widgetId }) => {
  const [settingsOpen, settings] = useDisclosure(false);

  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];
  const DisplayComponent = widgetDef.displayComponent;
  const ConfigComponent = widgetDef.configComponent;

  const renderProps = useWidgetRenderProps(widgetId, dashboard, settings.open);

  return (
    <>
      <Modal
        opened={settingsOpen}
        onClose={settings.close}
        title="Edit Widget"
        size="lg"
      >
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
        {ConfigComponent && <ConfigComponent {...(renderProps as any)} />}
      </Modal>
      <FloatingBarContainer>
        <Card
          withBorder
          shadow="sm"
          radius="md"
          w="100%"
          h="100%"
          pos="relative"
        >
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
                  <IconDots />
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
          </FloatingBar>
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
      </FloatingBarContainer>
    </>
  );
};
