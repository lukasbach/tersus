import { useMemo } from "react";
import { modals } from "@mantine/modals";
import { Select, TextInput } from "@mantine/core";
import { WidgetRenderProps } from "../types.ts";
import { useStableHandler } from "../utils.ts";
import { widgets } from "../widgets";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";

export const useWidgetRenderProps = (
  widgetId: string,
  dashboard: ReturnType<typeof useManagedDashboardData>,
) => {
  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];
  const ConfigComponent = widgetDef.configComponent;
  const referenceResolved =
    !widgetDef.referencing || widget.config.referencingId;

  const props = useMemo<WidgetRenderProps<any, any>>(() => {
    const referencingConfig =
      widget.config.referencingId &&
      dashboard.data?.widgets[widget.config.referencingId].config;
    return {
      config: widget.config,
      onChange: (cfg) => dashboard.updateWidgetConfig(widgetId, cfg),
      onOpenEditModal: null as any,
      referenceResolved,
      referencing: !widget.config.referencingId
        ? undefined
        : {
            config: referencingConfig,
            onChange: (newConfig) =>
              dashboard.updateWidgetConfig(
                widget.config.referencingId,
                newConfig,
              ),
          },
    };
  }, [widget.config, dashboard, referenceResolved, widgetId]);

  const onOpenEditModal = useStableHandler(() => {
    modals.open({
      title: "Edit widget",
      children: (
        <>
          <TextInput
            label="Widget title"
            placeholder="Widget title"
            defaultValue={props.config.title}
            onChange={(event) =>
              props.onChange({ title: event.currentTarget.value })
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
              value={props.config.referencingId}
              onChange={(value) =>
                props.onChange({ referencingId: value as string })
              }
              clearable
            />
          )}
          {ConfigComponent && <ConfigComponent {...(props as any)} />}
        </>
      ),
    });
  });

  props.onOpenEditModal = onOpenEditModal;

  return props;
};
