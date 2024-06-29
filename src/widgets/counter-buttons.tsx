import {
  Box,
  Button,
  Grid,
  Group,
  Input,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { counterWidget } from "./counter.tsx";
import { FieldList } from "../components/atoms/field-list.tsx";
import { randId } from "../utils.ts";

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
  default: { title: "Counter", buttons: [], columns: 2 },
  sizing: { w: 4, h: 2, minW: 2, minH: 2 },
  displayComponent: ({ config, referencing }) => (
    <Grid>
      {config.buttons.map((button) => (
        <Grid.Col span={12 / config.columns} key={button.key}>
          <Button
            fullWidth
            variant="light"
            onClick={() => {
              referencing?.onChange({
                value: referencing.config.value + button.value,
              });
            }}
          >
            {button.text}
          </Button>
        </Grid.Col>
      ))}
    </Grid>
  ),
  configComponent: ({ config, onChange }) => (
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
  iconComponent: () => <div>XXX</div>,
};
