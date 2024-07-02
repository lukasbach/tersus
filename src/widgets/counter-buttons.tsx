import {
  Box,
  Button,
  Grid,
  Group,
  Input,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { IconExposurePlus2 } from "@tabler/icons-react";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { applyCounterChange, counterWidget } from "./counter.tsx";
import { FieldList } from "../components/atoms/field-list.tsx";
import { randId } from "../utils.ts";
import { OptionalWidgetHeader } from "../components/atoms/optional-widget-header.tsx";

type BtnConfig = {
  text: string;
  value: number;
  key: string;
};

export const counterButtonsWidget: WidgetDefinition<
  { buttons: BtnConfig[]; columns: number },
  PayloadOfWidgetDefinition<typeof counterWidget>
> = {
  referencing: counterWidget,
  name: "Counter Buttons",
  IconComponent: IconExposurePlus2,
  label: "Expands a counter widget with buttons to change the count",
  description: [
    "This widget allows you to add buttons to a counter widget to change the count by a specified amount.",
    "You can customize the buttons and the count they change by in the widget settings.",
  ],
  default: {
    title: "",
    buttons: [
      { key: "a", text: "Add 1", value: 1 },
      { key: "b", text: "Subtract 1", value: -1 },
      { key: "c", text: "Add 5", value: 5 },
      { key: "d", text: "Subtract 5", value: -5 },
    ],
    columns: 2,
  },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  DisplayComponent: ({ config, referencing, icon }) => (
    <>
      <OptionalWidgetHeader title={config.title} icon={icon} />
      <Grid>
        {config.buttons.map((button) => (
          <Grid.Col span={12 / config.columns} key={button.key}>
            <Button
              fullWidth
              variant="light"
              onClick={() => {
                if (!referencing) return;
                applyCounterChange(
                  referencing.config,
                  referencing.onChange,
                  button.value,
                );
              }}
            >
              {button.text}
            </Button>
          </Grid.Col>
        ))}
      </Grid>
    </>
  ),
  ConfigComponent: ({ config, onChange }) => (
    <>
      <NumberInput
        label="Columns"
        placeholder="Column Count"
        value={config.columns}
        onValueChange={(v) =>
          onChange({
            columns: v.floatValue ?? config.columns,
          })
        }
      />
      <FieldList<BtnConfig>
        getKey={(item) => item.key}
        value={config.buttons}
        onChange={(buttons) => onChange({ buttons })}
        renderField={(value, onChange) => (
          <Group wrap="nowrap" align="start">
            <TextInput
              style={{ flexGrow: "1" }}
              label="Button title"
              placeholder="Button title"
              defaultValue={value.text}
              onChange={(event) =>
                onChange({
                  text: event.currentTarget.value ?? value.text,
                  value: value.value,
                  key: value.key,
                })
              }
            />
            <Box w="140px">
              <NumberInput
                label="Count"
                placeholder="Count"
                value={value.value}
                styles={{ input: { marginTop: "4px" } }}
                onValueChange={(v) =>
                  onChange({
                    text: value.text,
                    value: v.floatValue ?? value.value,
                    key: value.key,
                  })
                }
              />
              <Input.Description>
                The count by which the counter changes when the button is
                pressed
              </Input.Description>
            </Box>
          </Group>
        )}
        createItem={() => ({ text: "New button", value: 1, key: randId() })}
        label="Buttons"
        description="Define buttons that will change the counter value"
      />
    </>
  ),
};
