import { Icon123 } from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import ReactTimeAgo from "react-time-ago";
import { Center, Checkbox } from "@mantine/core";
import Countdown from "react-countdown";
import { WidgetDefinition } from "../types.ts";
import { WidgetConfigureWarning } from "../components/atoms/widget-configure-warning.tsx";
import { Stat } from "../components/atoms/stat.tsx";

export const dateTickerWidget: WidgetDefinition<
  { date: number | undefined; showCountdown: boolean },
  undefined
> = {
  name: "Date Ticker",
  IconComponent: Icon123,
  label: "Counts down the remaining time to a date",
  description: [
    "Track the remaining days to a specific date, such as a deadline, a Holiday, weeks to a new baby born, or a wedding date.",
    "Can also be used to count the passed time since a date in the past.",
  ],
  default: {
    title: "Date Ticker",
    showCountdown: false,
    date: undefined,
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: ({ config, onOpenEditModal }) =>
    config.date ? (
      <Center h="100%">
        <Stat title={config.title}>
          {config.showCountdown ? (
            <Countdown date={config.date} overtime />
          ) : (
            <ReactTimeAgo date={config.date} />
          )}
        </Stat>
      </Center>
    ) : (
      <WidgetConfigureWarning onOpenEditModal={onOpenEditModal} />
    ),
  ConfigComponent: ({ config, onChange }) => (
    <>
      <DateTimePicker
        label="Target Date"
        withAsterisk
        placeholder="Not set"
        value={config.date ? new Date(config.date) : null}
        onChange={(date) =>
          onChange({
            date: date?.getTime(),
          })
        }
      />
      <Checkbox
        label="Show countdown"
        checked={config.showCountdown}
        onChange={(e) => onChange({ showCountdown: e.currentTarget.checked })}
        description='Uses an exact countdown instead of a textual "x ago" representation'
      />
    </>
  ),
};
