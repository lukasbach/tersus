import {
  Badge,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
  isLightColor,
  parseThemeColor,
  useMantineTheme,
} from "@mantine/core";
import { IconHandClick } from "@tabler/icons-react";
import { FC, useMemo } from "react";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { HabitEntry, habitTrackerWidget, toDateKey } from "./habit-tracker.tsx";
import { getColor } from "../utils.ts";
import styles from "./styles.module.css";

const HabitBtn: FC<{
  habit: HabitEntry;
  habitIndex: number;
  onChange: (habit: HabitEntry) => void;
}> = ({ habitIndex, habit, onChange }) => {
  const theme = useMantineTheme();
  const done = habit.done.includes(toDateKey(new Date()));
  const color = getColor(habitIndex);
  const isLight = isLightColor(parseThemeColor({ color, theme }).value, 0.3);
  const textColor = isLight ? "black" : "white";
  const sorted = useMemo(() => habit.done.sort(), [habit.done]);

  const percentage = useMemo(() => {
    if (sorted.length === 0) return 0;

    const firstDate = new Date(sorted[0]);
    const diff = Date.now() - firstDate.getTime();
    const dayCount = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const doneCount = sorted.length;
    return Math.round((doneCount / dayCount) * 100);
  }, [sorted]);

  const streak = useMemo(() => {
    if (toDateKey(new Date()) !== sorted[sorted.length - 1]) {
      return 0;
    }

    for (let i = 0; i < sorted.length; i++) {
      const date = new Date(sorted[sorted.length - 1 - i]);
      date.setDate(date.getDate() - 1);
      if (!sorted.includes(toDateKey(date))) {
        return i + 1;
      }
    }
    return sorted.length;
  }, [sorted]);

  return (
    <UnstyledButton
      onClick={() => {
        onChange({
          ...habit,
          done: done
            ? habit.done.filter((d) => d !== toDateKey(new Date()))
            : [...habit.done, toDateKey(new Date())],
        });
      }}
    >
      <Paper
        p="lg"
        radius="lg"
        bg={`var(--mantine-color-${color}-${done ? "filled" : "light"}`}
        c={!done ? undefined : textColor}
        className={styles.habitTrackerBtn}
      >
        <Group align="flex-start">
          <Stack>
            <Text>{habit.title}</Text>
            <Text fw="800" size="2.2rem">
              {percentage}%
            </Text>
          </Stack>
          <Stack>
            <Badge variant={done ? "transparent" : "light"} color={color}>
              {streak} Streak
            </Badge>
          </Stack>
        </Group>
      </Paper>
    </UnstyledButton>
  );
};

export const habitTrackerButtonsWidget: WidgetDefinition<
  {},
  PayloadOfWidgetDefinition<typeof habitTrackerWidget>
> = {
  name: "Habit Tracker Buttons",
  IconComponent: IconHandClick,
  label: "Buttons for completing items on the habit tracker widget",
  description: [
    "Shows buttons for each habit item from a habit tracker widget. Each button is shown with additional details like streak length and completion rate.",
    "You need a habit tracker widget configured to use this widget.",
  ],
  referencing: habitTrackerWidget,
  default: {
    title: "",
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: ({ referencing }) => {
    const theme = useMantineTheme();
    return (
      <Center h="100%">
        <Group>
          {referencing?.config.habits.map((habit, habitIndex) => {
            return (
              <HabitBtn
                habit={habit}
                habitIndex={habitIndex}
                onChange={(updated) => {
                  referencing?.onChange({
                    habits: referencing.config.habits.map((h, i) =>
                      i === habitIndex ? updated : h,
                    ),
                  });
                }}
                key={habit.key}
              />
            );
          })}
        </Group>
      </Center>
    );
  },
};
