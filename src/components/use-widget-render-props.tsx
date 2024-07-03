import { useMemo } from "react";
import { WidgetRenderProps } from "../types.ts";
import { widgets } from "../widgets";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";

export const useWidgetRenderProps = (
  widgetId: string,
  dashboard: ReturnType<typeof useManagedDashboardData>,
  breakpoint: string,
  onOpenEditModal: () => void,
) => {
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
    widgetDef.IconComponent,
    layout,
    onOpenEditModal,
    referenceResolved,
    widgetId,
  ]);

  return props;
};
