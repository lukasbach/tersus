import { AreaChart } from "@mantine/charts";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { HistoryItem, counterWidget } from "./counter.tsx";
import { FrequencyInput } from "../components/atoms/frequency-input.tsx";

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
  const now = Date.now();
  const newItems: any[] = [];
  for (let i = 0; i < width * 3; i++) {
    const slice = relevantItems.filter(
      (item) =>
        item.from < now - (config.goingBack / width) * i &&
        item.to > now - (config.goingBack / width) * (i + 1),
    );
    const lastCount = newItems.at(-1)?.[name];
    newItems.push({
      date: stringifyDate(
        new Date(now - (config.goingBack / width) * i),
        config.goingBack,
      ),
      [name]: slice.find((c) => c.value !== lastCount)?.value ?? lastCount,
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
  default: {
    title: "History",
    goingBack: 10000,
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  displayComponent: ({ config, referencing, layout }) =>
    referencing && (
      <AreaChart
        h="100%"
        data={regroupHistoryItems(
          referencing.config.history,
          referencing.config.title,
          layout.w,
          config,
        )}
        dataKey="date"
        series={[{ name: referencing.config.title, color: "indigo.6" }]}
        curveType="linear"
      />
    ),
  configComponent: ({ config, onChange }) => (
    <FrequencyInput
      label="How far should the graph go back?"
      value={config.goingBack}
      onChangeFrequency={(goingBack) => onChange({ goingBack })}
    />
  ),
  iconComponent: () => <div>XXX</div>,
};
