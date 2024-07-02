import { AreaChart } from "@mantine/charts";
import { useMemo } from "react";
import { IconChartLine } from "@tabler/icons-react";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { HistoryItem, counterWidget } from "./counter.tsx";
import { FrequencyInput } from "../components/atoms/frequency-input.tsx";
import { OptionalWidgetHeader } from "../components/atoms/optional-widget-header.tsx";

type Payload = { goingBack: number };

const stringifyDate = (date: Date, goingBack: number) => {
  if (goingBack < 1000 * 60 * 60 * 24) {
    return date.toLocaleTimeString();
  }
  if (goingBack < 1000 * 60 * 60 * 24 * 3) {
    return date.toLocaleString();
  }
  return date.toLocaleDateString();
};

const regroupHistoryItems = (
  items: HistoryItem[],
  name: string,
  width: number,
  config: Payload,
) => {
  const relevantItems = items.filter(
    (item) => item.from > Date.now() - config.goingBack,
  );
  if (relevantItems.length === 0 && items.length > 0)
    relevantItems.push(items.at(-1)!);

  // TODO this defaults to never being 0 at the start of the graph

  const now = Date.now();
  const newItems: any[] = [];
  for (let i = 0; i < width * 3; i++) {
    const item = relevantItems.find(
      (item) => item.to > now - (config.goingBack / width) * i,
    );
    const lastCount =
      newItems.at(-1)?.[name] ?? relevantItems.at(-1)?.value ?? 0;
    newItems.push({
      date: stringifyDate(
        new Date(now - (config.goingBack / width) * i),
        config.goingBack,
      ),
      [name]: item?.value ?? lastCount,
    });
  }
  return newItems.reverse();
};

export const counterGraphWidget: WidgetDefinition<
  Payload,
  PayloadOfWidgetDefinition<typeof counterWidget>
> = {
  referencing: counterWidget,
  name: "Counter History Graph",
  IconComponent: IconChartLine,
  label: "Visualizes the history of a counter widget",
  description: [
    "This widget visualizes the history of a counter widget over time.",
    "You can customize how far back the graph should go in the widget settings.",
  ],
  default: {
    title: "",
    goingBack: 10000,
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config, referencing, layout, icon }) => {
    const data = useMemo(
      () =>
        referencing &&
        regroupHistoryItems(
          referencing.config.history,
          referencing.config.title,
          layout.w,
          config,
        ),
      [config, layout.w, referencing],
    );
    return (
      referencing && (
        <>
          <OptionalWidgetHeader title={config.title} icon={icon} />
          <AreaChart
            h={config.title ? "90%" : "100%"}
            data={data!}
            dataKey="date"
            series={[{ name: referencing.config.title, color: "indigo.6" }]}
            curveType="linear"
          />
        </>
      )
    );
  },
  ConfigComponent: ({ config, onChange }) => (
    <FrequencyInput
      label="How far should the graph go back?"
      value={config.goingBack}
      onChangeFrequency={(goingBack) => onChange({ goingBack })}
    />
  ),
};
