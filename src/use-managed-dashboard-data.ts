import { useEffect } from "react";
import { Layouts } from "react-grid-layout";
import { useDebouncedEffect } from "@react-hookz/web";
import { useWindowEvent } from "@mantine/hooks";
import { useSyncDashboardData } from "./firebase/app.ts";
import { DashboardConfig } from "./types.ts";
import { randId, useStableHandler } from "./utils.ts";
import { widgets } from "./widgets";

const breakpoints = ["lg", "md", "sm", "xs", "xxs"];

export const useManagedDashboardData = (id: string) => {
  const { data, update, persist } = useSyncDashboardData(id);

  useDebouncedEffect(persist, [data], 4000, 20000);
  useWindowEvent("pagehide", persist);
  useWindowEvent("beforeunload", persist);
  useEffect(
    () => () => {
      persist();
    },
    [persist],
  );

  const onLayoutChange = useStableHandler((_, layouts: Layouts) => {
    if (!data) return;
    console.log("Layout change");
    update({
      ...data,
      layouts,
    });
  });

  const updateWidgetConfig = useStableHandler(
    (widgetId: string, newConfig: any) => {
      if (!data) return;
      update({
        ...data,
        widgets: {
          ...data.widgets,
          [widgetId]: {
            ...data.widgets[widgetId],
            config: {
              ...data.widgets[widgetId].config,
              ...newConfig,
            },
          },
        },
      });
    },
  );

  const addWidget = useStableHandler((widgetType: string) => {
    const widget = widgets[widgetType];
    if (!data) return;
    const id = randId();
    for (const layoutKey of breakpoints) {
      if (!data.layouts[layoutKey]) {
        data.layouts[layoutKey] = [];
      }
      data.layouts[layoutKey].push({
        x: 0,
        y: Infinity,
        w: 4,
        h: 4,
        minW: 2,
        minH: 2,
        ...widget.sizing,
        i: id,
      });
    }
    update({
      ...data,
      widgets: {
        ...data.widgets,
        [id]: {
          config: widget.default,
          type: widgetType,
        },
      },
    });
  });

  const deleteWidget = useStableHandler((widgetId: string) => {
    if (!data) return;
    update({
      ...data,
      layouts: Object.fromEntries(
        Object.entries(data.layouts).map(([key, value]) => [
          key,
          value.filter((item) => item.i !== widgetId),
        ]),
      ),
      widgets: Object.fromEntries(
        Object.entries(data.widgets).filter(([key]) => key !== widgetId),
      ),
    });
  });

  const updateDashboardData = useStableHandler(
    (newData: Partial<DashboardConfig>) => {
      if (!data) return;
      console.log("!!", data, newData);
      update({ ...data, ...newData });
    },
  );

  return {
    data,
    onLayoutChange,
    updateWidgetConfig,
    addWidget,
    deleteWidget,
    updateDashboardData,
  };
};
