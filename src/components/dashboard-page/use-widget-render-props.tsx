import { useMemo } from "react";
import { useComputedColorScheme } from "@mantine/core";
import { WidgetRenderProps } from "../../types.ts";
import { widgets } from "../../widgets";
import { useManagedDashboardData } from "../../use-managed-dashboard-data.ts";

export const useWidgetRenderProps = (
  widgetId: string,
  dashboard: ReturnType<typeof useManagedDashboardData>,
  breakpoint: string,
  rect: Omit<DOMRectReadOnly, "toJSON">,
  onOpenEditModal: () => void,
) => {
  const colorScheme = useComputedColorScheme();
  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];
  const referenceResolved =
    !widgetDef.referencing ||
    (widget.config.referencingId &&
      dashboard.data?.widgets[widget.config.referencingId]);

  const layout = useMemo(() => {
    return dashboard.data?.layouts[breakpoint].find((l) => l.i === widgetId)!;
  }, [breakpoint, dashboard.data?.layouts, widgetId]);

  const props = useMemo<WidgetRenderProps<any, any>>(() => {
    const referencingConfig =
      widget.config.referencingId &&
      dashboard.data?.widgets[widget.config.referencingId]?.config;
    return {
      rect,
      isDark: colorScheme === "dark",
      id: widgetId,
      icon: widgetDef.IconComponent,
      layout,
      config: widget.config,
      onChange: (cfg) => dashboard.updateWidgetConfig(widgetId, cfg),
      onOpenEditModal,
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
  }, [
    widget.config,
    dashboard,
    rect,
    colorScheme,
    widgetId,
    widgetDef.IconComponent,
    layout,
    onOpenEditModal,
    referenceResolved,
  ]);

  return props;
};
