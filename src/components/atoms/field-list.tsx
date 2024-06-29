import { ReactNode } from "react";
import { ActionIcon, Button, Group, Input, Paper, Stack } from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconTrash } from "@tabler/icons-react";
import { FloatingBarContainer } from "./floating-bar-container.tsx";
import { FloatingBar } from "./floating-bar.tsx";

export const FieldList = <T,>(props: {
  getKey: (value: T) => string;
  value: T[];
  onChange: (value: T[]) => void;
  renderField: (value: T, onChange: (value: T) => void) => ReactNode;
  renderHeader?: (onAdd: (value: T) => void) => ReactNode;
  label?: string;
  description?: string;
  addLabel?: string;
  createItem?: () => T;
}) => {
  const onAdd = (v: T) => props.onChange([...props.value, v]);
  return (
    <>
      {props.renderHeader ? (
        props.renderHeader(onAdd)
      ) : (
        <Group mt="md" mb="xs">
          <Stack style={{ flexGrow: "1" }} gap="2px">
            <Input.Label>{props.label}</Input.Label>
            {props.description && (
              <Input.Description>{props.description}</Input.Description>
            )}
          </Stack>
          <Button onClick={() => props.createItem && onAdd(props.createItem())}>
            {props.addLabel ?? "Add item"}
          </Button>
        </Group>
      )}
      <Stack ml="xs">
        {props.value?.map((value) => (
          <Paper
            withBorder
            shadow="sm"
            radius="md"
            mb="xs"
            p="xs"
            key={props.getKey(value)}
          >
            <FloatingBarContainer>
              <FloatingBar>
                <ActionIcon
                  aria-label="Move up"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    const index = props.value.indexOf(value);
                    if (index === 0) return;
                    const newValue = [...props.value];
                    newValue[index] = newValue[index - 1];
                    newValue[index - 1] = value;
                    props.onChange(newValue);
                  }}
                >
                  <IconArrowUp />
                </ActionIcon>
                <ActionIcon
                  aria-label="Move down"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    const index = props.value.indexOf(value);
                    if (index === props.value.length - 1) return;
                    const newValue = [...props.value];
                    newValue[index] = newValue[index + 1];
                    newValue[index + 1] = value;
                    props.onChange(newValue);
                  }}
                >
                  <IconArrowDown />
                </ActionIcon>
                <ActionIcon
                  aria-label="Remove"
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    props.onChange(props.value.filter((v) => v !== value));
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </FloatingBar>
              {props.renderField(value, (v) => {
                const newValue = [...props.value];
                newValue[newValue.indexOf(value)] = v;
                props.onChange(newValue);
              })}
            </FloatingBarContainer>
          </Paper>
        ))}
      </Stack>
    </>
  );
};
