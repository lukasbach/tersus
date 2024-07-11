import {
  ActionIcon,
  Badge,
  Box,
  Checkbox,
  Flex,
  Group,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendarMonth,
} from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import { WidgetDefinition, WidgetRenderProps } from "../types.ts";
import { FieldList } from "../components/atoms/field-list.tsx";
import { getColor, randId } from "../utils.ts";
import { FloatingBarContainer } from "../components/atoms/floating-bar-container.tsx";
import { FloatingBar } from "../components/atoms/floating-bar.tsx";

export type HabitEntry = {
  key: string;
  done: string[];
  title: string;
};
type Config = { habits: HabitEntry[]; colored: boolean };

const FIRST_COL_W = 200;
const HABIT_COL_W = 50;
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
const getDateArray = (start: Date, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();
};
const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  if (newDate.getTime() > Date.now()) {
    return new Date();
  }
  return newDate;
};

// TODO doesnt need to be memoized anymore
const DisplayComponent = ({
  config,
  onChange,
  colCount,
}: WidgetRenderProps<Config, undefined> & {
  colCount: number;
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const dates = useMemo(
    () => getDateArray(startDate, colCount),
    [colCount, startDate],
  );
  const nextPageDate = addDays(startDate, colCount - 2);
  const prevPageDate = addDays(startDate, -colCount + 2);
  return (
    <FloatingBarContainer>
      <FloatingBar>
        <ActionIcon
          aria-label="Next Page"
          variant="subtle"
          color="gray"
          onClick={() => setStartDate(prevPageDate)}
        >
          <IconArrowLeft />
        </ActionIcon>
        <ActionIcon
          aria-label="Previous Page"
          variant="subtle"
          color="gray"
          onClick={() => setStartDate(nextPageDate)}
        >
          <IconArrowRight />
        </ActionIcon>
      </FloatingBar>
      <Table striped highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={`${FIRST_COL_W}px`}>Habit</Table.Th>
            {dates.map((date) => (
              <Table.Th key={date.getTime()} w={`${HABIT_COL_W}px`} ta="center">
                {weekday[date.getDay()][0]}
                <br />
                {date.getMonth() + 1}/{date.getDate()}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {config.habits.map((habit, habitIndex) => {
            const color = config.colored ? getColor(habitIndex) : undefined;
            return (
              <Table.Tr>
                <Table.Td>
                  <Flex>
                    <Box style={{ flexGrow: "1" }}>
                      {config.colored ? (
                        <Badge bg={color}>{habit.title}</Badge>
                      ) : (
                        <Text fw={500}>{habit.title}</Text>
                      )}
                    </Box>
                    <Badge variant="light" color={color}>
                      {habit.done.length}
                    </Badge>
                  </Flex>
                </Table.Td>
                {dates.map((date) => {
                  const dateKey = toDateKey(date);
                  return (
                    <Table.Th key={dateKey} ta="center">
                      <Checkbox
                        styles={{ body: { justifyContent: "center" } }}
                        color={color}
                        checked={config.habits[habitIndex].done.includes(
                          dateKey,
                        )}
                        onChange={(e) => {
                          const { done } = config.habits[habitIndex];
                          if (e.target.checked) {
                            done.push(dateKey);
                          } else {
                            done.splice(done.indexOf(dateKey), 1);
                          }
                          onChange({
                            habits: config.habits.map((habit, index) =>
                              index === habitIndex
                                ? { ...habit, done: Array.from(done) }
                                : habit,
                            ),
                          });
                        }}
                      />
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </FloatingBarContainer>
  );
};

const DisplayComponentMemo = memo(DisplayComponent);

export const habitTrackerWidget: WidgetDefinition<Config, undefined> = {
  name: "Habit tracker",
  IconComponent: IconCalendarMonth,
  label: "Track the completion of various daily habits or routines",
  description: [
    "Allows you to track the completion of various daily habits or routines.",
    "You can add a list of habits and mark them as completed each day.",
    "The widget shows you a list of recent days to visualize which habits you regularly complete, and which ones you need to focus more on.",
  ],
  default: {
    title: "Habit Tracker",
    habits: [
      { title: "Excercise", done: [], key: randId() },
      { title: "Read", done: [], key: randId() },
    ],
    colored: true,
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: (props) => {
    const colCount = Math.max(
      2,
      // eslint-disable-next-line react/destructuring-assignment
      Math.floor((props.rect.width - FIRST_COL_W) / HABIT_COL_W),
    );
    return <DisplayComponentMemo {...props} colCount={colCount} />;
  },
  ConfigComponent: ({ config, onChange }) => (
    <>
      <Checkbox
        label="Colored rows"
        checked={config.colored}
        onChange={(e) => {
          onChange({ colored: e.currentTarget.checked });
        }}
      />
      <FieldList<HabitEntry>
        label="Habits"
        description="Define a set of habits you want to track"
        getKey={(item) => item.key}
        value={config.habits}
        onChange={(habits) => onChange({ habits })}
        renderField={(value, onChange) => (
          <Group wrap="nowrap" align="start">
            <TextInput
              style={{ flexGrow: "1" }}
              label="Habit Title"
              placeholder="Habit Title"
              defaultValue={value.title}
              onChange={(event) =>
                onChange({
                  title: event.currentTarget.value ?? value.title,
                })
              }
            />
          </Group>
        )}
        createItem={() => ({
          title: "Exercise",
          frequency: 1000 * 60 * 60 * 24,
          done: [],
          key: randId(),
        })}
      />
    </>
  ),
};
