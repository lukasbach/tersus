import { useEffect, useState } from "react";
import { Layouts } from "react-grid-layout";
import { useDebouncedEffect } from "@react-hookz/web";
import { useWindowEvent } from "@mantine/hooks";
import { updateDashboard, useDashboardData } from "./firebase/app.ts";
import { DashboardConfig } from "./types.ts";
import { randId, removeUndefinedValues, useStableHandler } from "./utils.ts";
import { widgets } from "./widgets";

export const useManagedDashboardData = (id: string) => {
  const [loadedData] = useDashboardData(id);
  const [currentData, setCurrentData] = useState<DashboardConfig | undefined>();

  useEffect(() => {
    if (loadedData) {
      setCurrentData(loadedData.data());
    }
  }, [loadedData]);

  const persist = useStableHandler(async () => {
    if (!currentData) return;
    currentData.lastEdit = Date.now();
    console.log("Saving dashboard:", id, currentData);
    await updateDashboard(id, removeUndefinedValues(currentData));
  });

  useDebouncedEffect(persist, [currentData], 3000, 10000);
  useWindowEvent("pagehide", persist);
  useWindowEvent("beforeunload", persist);

  const onLayoutChange = useStableHandler((_, layouts: Layouts) => {
    if (!currentData) return;
    setCurrentData({
      ...currentData,
      layouts,
    });
  });

  const updateWidgetConfig = useStableHandler(
    (widgetId: string, newConfig: any) => {
      if (!currentData) return;
      setCurrentData({
        ...currentData,
        widgets: {
          ...currentData.widgets,
          [widgetId]: {
            ...currentData.widgets[widgetId],
            config: {
              ...currentData.widgets[widgetId].config,
              ...newConfig,
            },
          },
        },
      });
    },
  );

  const addWidget = useStableHandler((widgetType: string) => {
    const widget = widgets[widgetType];
    if (!currentData) return;
    const id = randId();
    for (const layoutKey of Object.keys(currentData.layouts)) {
      currentData.layouts[layoutKey].push({
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
    setCurrentData({
      ...currentData,
      widgets: {
        ...currentData.widgets,
        [id]: {
          config: widget.default,
          type: widgetType,
        },
      },
    });
  });

  const deleteWidget = useStableHandler((widgetId: string) => {
    if (!currentData) return;
    setCurrentData({
      ...currentData,
      layouts: Object.fromEntries(
        Object.entries(currentData.layouts).map(([key, value]) => [
          key,
          value.filter((item) => item.i !== widgetId),
        ]),
      ),
      widgets: Object.fromEntries(
        Object.entries(currentData.widgets).filter(([key]) => key !== widgetId),
      ),
    });
  });

  const updateDashboardData = useStableHandler(
    (newData: Partial<DashboardConfig>) => {
      setCurrentData((old) => (old ? { ...old, ...newData } : undefined));
    },
  );

  return {
    data: currentData,
    onLayoutChange,
    updateWidgetConfig,
    addWidget,
    deleteWidget,
    updateDashboardData,
  };
};
