import { Center, Group } from "@mantine/core";
import { IconChartBubble } from "@tabler/icons-react";
import { regions } from "react-svg-worldmap";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { visitedCountriesWidget } from "./visited-countries.tsx";
import { StatBtn } from "../components/atoms/stat-btn.tsx";

const countryCount = regions.length;

export const visitedCountriesStatsWidget: WidgetDefinition<
  {},
  PayloadOfWidgetDefinition<typeof visitedCountriesWidget>
> = {
  name: "Visited Countries Statistics",
  referencing: visitedCountriesWidget,
  IconComponent: IconChartBubble,
  label: "Show statistics for a Visited Countries Map widget",
  description: [
    "Shows some statistics for a linked Visited Countries Map widget, such as the number of countries visited and the number of countries left to visit.",
  ],
  default: {
    title: "",
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: ({ referencing }) => (
    <Center h="100%">
      <Group>
        {referencing?.config.kinds.map((kind) => {
          const count = referencing?.config.countries.filter(
            (c) => c.kind === kind.key,
          ).length;
          return (
            <StatBtn
              color={kind.color}
              value={`${count}`}
              badge={`${Math.round((count * 1000) / countryCount) / 10}%`}
              active
            >
              {kind.title}
            </StatBtn>
          );
        })}
      </Group>
    </Center>
  ),
};
