import {
  ActionIcon,
  Box,
  Center,
  Group,
  Input,
  Paper,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconBell,
  IconBellRinging,
  IconCalendar,
  IconClockHour8,
  IconSquareRounded,
  IconSquareRoundedCheck,
} from "@tabler/icons-react";
import ReactTimeAgo from "react-time-ago";
import { WidgetDefinition } from "../types.ts";
import { FrequencyInput } from "../components/atoms/frequency-input.tsx";
import { FieldList } from "../components/atoms/field-list.tsx";
import { randId } from "../utils.ts";
import { WidgetConfigureWarning } from "../components/atoms/widget-configure-warning.tsx";
import { FloatingBarContainer } from "../components/atoms/floating-bar-container.tsx";
import { FloatingBar } from "../components/atoms/floating-bar.tsx";
import { promptDate } from "../modal-utils.tsx";

type Todo = {
  title: string;
  lastDone: null | number;
  frequency: number;
  key: string;
};

export const recurringTodoListWidget: WidgetDefinition<
  {
    todos: Todo[];
    showNextRange: number;
    showAll: boolean;
  },
  undefined
> = {
  name: "Recurring Todo List",
  IconComponent: IconClockHour8,
  label: "List of tasks to do regularly",
  description: [
    "Allows you to configure a list of regularly recurring tasks. The widget will show you an overview of upcoming and overdue tasks, and may hide less relevant tasks that are scheduled for later.",
    "You can customize the frequency for each task, and the widget will highlight those tasks that are currently relevant.",
    'This widget is useful for tracking a list of recurring tasks. If you want to just highlight one single recurring task, use the "Recurring Todo" Widget instead.',
  ],
  default: {
    title: "My recurring tasks",
    todos: [],
    showNextRange: 1000 * 60 * 60 * 24 * 2,
    showAll: false,
  },
  sizing: { w: 3, h: 4, minW: 2, minH: 2 },
  DisplayComponent: ({ config, onOpenEditModal, onChange }) => {
    const relevantTasks = config.todos
      .filter(
        (todo) =>
          config.showAll ||
          todo.lastDone === null ||
          todo.lastDone + todo.frequency < Date.now() + config.showNextRange,
      )
      .sort(
        (a, b) =>
          (b.lastDone ?? 0) + b.frequency - (a.lastDone ?? 0) + a.frequency,
      );

    if (config.todos.length === 0) {
      return (
        <WidgetConfigureWarning onOpenEditModal={onOpenEditModal}>
          No Todos configured
        </WidgetConfigureWarning>
      );
    }

    if (relevantTasks.length === 0) {
      return (
        <Center h="100%">
          <Stack>
            <Text>No upcoming tasks.</Text>
          </Stack>
        </Center>
      );
    }

    return (
      <Stack align="stretch" w="100%">
        {relevantTasks.map((todo) => {
          const hasPassed =
            !todo.lastDone || todo.lastDone + todo.frequency < Date.now();
          return (
            <FloatingBarContainer>
              <FloatingBar>
                <ActionIcon
                  aria-label="Complete item"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    // eslint-disable-next-line no-param-reassign
                    todo.lastDone = Date.now();
                    onChange({ todos: config.todos });
                  }}
                >
                  <IconSquareRoundedCheck />
                </ActionIcon>
                <ActionIcon
                  aria-label="Set completion date"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    promptDate({
                      title: "Set last completion date",
                      labels: { submit: "Set date" },
                      onSubmitModal: (date) => {
                        // eslint-disable-next-line no-param-reassign
                        todo.lastDone = date.getTime();
                        onChange({ todos: config.todos });
                      },
                    });
                  }}
                >
                  <IconCalendar />
                </ActionIcon>
              </FloatingBar>
              <Tooltip
                position="right"
                label={
                  !todo.lastDone
                    ? "Never done before"
                    : `Previously done on ${new Date(todo.lastDone).toLocaleString()}`
                }
              >
                <Paper p="xs" px="lg" shadow="xs" radius="lg" withBorder>
                  <Group justify="flex-end">
                    {hasPassed ? <IconBellRinging /> : <IconBell />}
                    <Box style={{ flexGrow: "1" }}>
                      <Text fw="600">{todo.title}</Text>
                    </Box>
                    {todo.lastDone ? (
                      <Text c={hasPassed ? "red" : "dimmed"}>
                        <ReactTimeAgo date={todo.lastDone + todo.frequency} />
                      </Text>
                    ) : (
                      <Text c="dimmed">Never</Text>
                    )}
                  </Group>
                </Paper>
              </Tooltip>
            </FloatingBarContainer>
          );
        })}
      </Stack>
    );
  },
  ConfigComponent: ({ config, onChange }) => (
    <>
      <FrequencyInput
        label="Show tasks from the next"
        value={config.showNextRange}
        onChangeFrequency={(showNextRange) => onChange({ showNextRange })}
      />
      <FieldList<Todo>
        label="Tasks"
        description="Define a set of recurring tasks with individual frequencies"
        getKey={(item) => item.key}
        value={config.todos}
        onChange={(todos) => onChange({ todos })}
        renderField={(value, onChange) => (
          <Group wrap="nowrap" align="start">
            <TextInput
              style={{ flexGrow: "1" }}
              label="Todo Title"
              placeholder="Todo Title"
              defaultValue={value.title}
              onChange={(event) =>
                onChange({
                  title: event.currentTarget.value ?? value.title,
                })
              }
            />
            <Box w="280px">
              <FrequencyInput
                label="Frequency"
                value={value.frequency}
                onChangeFrequency={(frequency) => onChange({ frequency })}
              />
              <Input.Description>
                How often should this task be done?
              </Input.Description>
            </Box>
          </Group>
        )}
        createItem={() => ({
          title: "Take out the trash",
          frequency: 1000 * 60 * 60 * 24 * 7,
          lastDone: null,
          key: randId(),
        })}
      />
    </>
  ),
  menuActions: [
    {
      text: "Show all items",
      action: ({ config, onChange }) => {
        onChange({ showAll: !config.showAll });
      },
      icon: ({ config }) =>
        config.showAll ? <IconSquareRoundedCheck /> : <IconSquareRounded />,
    },
  ],
};
