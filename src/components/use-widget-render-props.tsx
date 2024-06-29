import { useMemo } from "react";
import { WidgetRenderProps } from "../types.ts";
import { widgets } from "../widgets";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";

export const useWidgetRenderProps = (
  widgetId: string,
  dashboard: ReturnType<typeof useManagedDashboardData>,
  onOpenEditModal: () => void,
) => {
  const widget = dashboard.data!.widgets[widgetId];
  const widgetDef = widgets[widget.type];
  const referenceResolved =
    !widgetDef.referencing || widget.config.referencingId;

  const props = useMemo<WidgetRenderProps<any, any>>(() => {
    const referencingConfig =
      widget.config.referencingId &&
      dashboard.data?.widgets[widget.config.referencingId].config;
    return {
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
  }, [widget.config, dashboard, referenceResolved, widgetId]);

  return props;
};
