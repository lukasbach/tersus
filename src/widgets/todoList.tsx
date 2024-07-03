import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Input,
  Menu,
  Paper,
  ScrollArea,
  Stack,
} from "@mantine/core";
import {
  IconCheck,
  IconDots,
  IconPencil,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useMemo } from "react";
import { DateTimePicker } from "@mantine/dates";
import ReactTimeAgo from "react-time-ago";
import { WidgetDefinition } from "../types.ts";
import { randId } from "../utils.ts";
import { FloatingBarContainer } from "../components/atoms/floating-bar-container.tsx";
import { FloatingBar } from "../components/atoms/floating-bar.tsx";
import { promptDate } from "../modal-utils.tsx";

type TodoItem = {
  text: string;
  doneDate?: number;
  dueDate?: number;
  id: string;
};

export const todoListWidget: WidgetDefinition<
  {
    hideCompleted: boolean;
    items: TodoItem[];
    input: {
      value: string;
      dueDate?: number;
    };
  },
  undefined
> = {
  name: "Todo List",
  IconComponent: IconSquareRoundedCheck,
  label: "Keeps track of a list of tasks",
  description: [
    "This widget allows you to keep track of a list of tasks.",
    "You can add new tasks, mark them as done, and set a due date for them.",
    "The widget shows you how many tasks are done and how many are left.",
  ],
  default: {
    title: "Todo List",
    hideCompleted: false,
    items: [],
    input: {
      value: "",
    },
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config, onChange }) => {
    const changeItem = useCallback(
      (id: string, update: Partial<TodoItem>) => {
        onChange({
          items: config.items.map((item) =>
            item.id === id ? { ...item, ...update } : item,
          ),
        });
      },
      [config.items, onChange],
    );
    const deleteItem = useCallback(
      (id: string) => {
        onChange({
          items: config.items.filter((item) => item.id !== id),
        });
      },
      [config.items, onChange],
    );
    const doneItems = useMemo(
      () => config.items.filter((item) => !!item.doneDate),
      [config.items],
    );
    return (
      <Stack h="100%">
        <ScrollArea style={{ flexGrow: "1" }}>
          {config.items
            .filter((item) => !config.hideCompleted || !item.doneDate)
            .map((item) => (
              <FloatingBarContainer>
                <FloatingBar>
                  <ActionIcon
                    aria-label="Rename item"
                    variant="subtle"
                    color="gray"
                    onClick={async () => {
                      const newName = prompt("New name", item.text);
                      if (newName) {
                        changeItem(item.id, { text: newName });
                      }
                    }}
                  >
                    <IconPencil />
                  </ActionIcon>
                  <ActionIcon
                    aria-label="Remove item"
                    variant="subtle"
                    color="red"
                    onClick={async () => {
                      deleteItem(item.id);
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>

                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          promptDate({
                            title: "Change Due Date",
                            labels: { submit: "Change" },
                            value: item.dueDate
                              ? new Date(item.dueDate)
                              : new Date(),
                            onSubmitModal: (newDate) => {
                              changeItem(item.id, {
                                dueDate: newDate.getTime(),
                              });
                            },
                          });
                        }}
                      >
                        {item.dueDate ? "Change" : "Set"} Due Date
                      </Menu.Item>
                      {item.dueDate && (
                        <Menu.Item
                          onClick={() => {
                            changeItem(item.id, {
                              dueDate: undefined,
                            });
                          }}
                        >
                          Clear Due Date
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </FloatingBar>

                <Paper key={item.id} p="xs" mb="xs" shadow="xs" withBorder>
                  <Group>
                    <Checkbox
                      style={{ flexGrow: "1" }}
                      label={item.text}
                      checked={!!item.doneDate}
                      onChange={(e) => {
                        changeItem(item.id, {
                          doneDate: e.currentTarget.checked ? Date.now() : 0,
                        });
                      }}
                    />
                    {item.dueDate && (
                      <Badge
                        color={
                          item.dueDate < Date.now() && !item.doneDate
                            ? "red"
                            : undefined
                        }
                      >
                        <ReactTimeAgo date={new Date(item.dueDate)} />
                      </Badge>
                    )}
                  </Group>
                </Paper>
              </FloatingBarContainer>
            ))}
        </ScrollArea>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newItem: TodoItem = {
              text: config.input.value,
              doneDate: undefined,
              dueDate: config.input.dueDate,
              id: randId(),
            };
            onChange({
              items: [...config.items, newItem],
              input: { value: "" },
            });
            return false;
          }}
        >
          <Stack gap="xs">
            <Group>
              <Box style={{ flexGrow: "1" }}>
                <Badge variant="light">
                  {doneItems.length}/{config.items.length}
                </Badge>
              </Box>
              <Group gap="xs">
                {config.input.dueDate && (
                  <Button
                    variant="transparent"
                    p={0}
                    m={0}
                    h="-webkit-fit-content"
                    onClick={() =>
                      onChange({
                        input: { ...config.input, dueDate: undefined },
                      })
                    }
                  >
                    <Badge variant="light">Unset</Badge>
                  </Button>
                )}
                <Badge variant="light">
                  <DateTimePicker
                    placeholder="Not set"
                    leftSection={<>Due: </>}
                    variant="unstyled"
                    value={
                      config.input.dueDate
                        ? new Date(config.input.dueDate)
                        : null
                    }
                    onChange={(date) =>
                      onChange({
                        input: { ...config.input, dueDate: date?.getTime() },
                      })
                    }
                    styles={
                      {
                        placeholder: {
                          color: "var(--mantine-color-gray-6)",
                          fontSize: "var(--badge-fz)",
                        },
                        input: {
                          color: "var(--mantine-color-gray-8)",
                          fontSize: "var(--badge-fz)",
                        },
                      } as any
                    }
                  />
                </Badge>
              </Group>
            </Group>
            <Input
              width="100%"
              placeholder="Add Todo item..."
              value={config.input.value}
              onChange={(event) =>
                onChange({
                  input: {
                    value: event.currentTarget.value,
                    dueDate: config.input.dueDate,
                  },
                })
              }
              rightSectionPointerEvents="all"
              rightSection={
                <ActionIcon
                  aria-label="Add value"
                  variant="light"
                  type="submit"
                >
                  <IconCheck />
                </ActionIcon>
              }
            />
          </Stack>
        </form>
      </Stack>
    );
  },
  menuActions: [
    {
      text: "Hide completed items",
      action: ({ config, onChange }) => {
        onChange({ hideCompleted: !config.hideCompleted });
      },
      icon: ({ config }) =>
        config.hideCompleted ? (
          <IconSquareRoundedCheck />
        ) : (
          <IconSquareRounded />
        ),
    },
  ],
};
