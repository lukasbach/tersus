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
  const [currentId, setCurrentId] = useState(id);

  useEffect(() => {
    if (!loadedData) return;
    console.log("Loaded data for document", id);
    setCurrentData(loadedData.data());
    setCurrentId(id);
  }, [id, loadedData]);

  const persist = useStableHandler(async () => {
    if (!currentData) return;
    console.log("Saving dashboard:", currentId, currentData);
    const lastEdit = Date.now();
    await updateDashboard(
      currentId,
      removeUndefinedValues({
        ...currentData,
        lastEdit,
        editedAfterWeek:
          lastEdit - currentData.createdAt > 7 * 24 * 60 * 60 * 1000,
      }),
    );
  });

  useDebouncedEffect(persist, [currentData], 4000, 20000);
  useWindowEvent("pagehide", persist);
  useWindowEvent("beforeunload", persist);

  const onLayoutChange = useStableHandler((_, layouts: Layouts) => {
    if (!currentData) return;
    console.log("Layout change");
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
