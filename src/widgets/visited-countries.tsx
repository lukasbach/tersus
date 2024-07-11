import {
  IconFlagPlus,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconWorld,
} from "@tabler/icons-react";
import WorldMap, { regions } from "react-svg-worldmap";
import { Box, Center, ColorPicker, Group, TextInput } from "@mantine/core";
import { useMemo } from "react";
import { WidgetDefinition } from "../types.ts";
import { FieldList } from "../components/atoms/field-list.tsx";
import { hexColors, randId, randomItem } from "../utils.ts";
import { promptEnum } from "../modal-utils.tsx";

type CountryItem = {
  code: string;
  date: number;
  kind: string;
};

type KindItem = {
  title: string;
  key: string;
  color: string;
};

export const visitedCountriesWidget: WidgetDefinition<
  { countries: CountryItem[]; kinds: KindItem[]; kind: string },
  undefined
> = {
  name: "Visited Countries Map",
  IconComponent: IconWorld,
  label: "A world map of countries you've visited",
  description: [
    "A world map of countries you've visited. Click countries to mark them as visited, and visualize the number of countries you have visited and which ones you are yet to visit.",
  ],
  default: {
    title: "",
    countries: [],
    kind: "v",
    kinds: [
      {
        key: "v",
        title: "Visited",
        color: "green",
      },
      { key: "p", title: "Planned", color: "blue" },
    ],
  },
  sizing: { w: 4, h: 2 },
  ConfigComponent: ({ config, onChange }) => (
    <FieldList<KindItem>
      label="Country Categories"
      description="Define a set of categories with which countries can be marked"
      getKey={(item) => item.key}
      value={config.kinds}
      onChange={(kinds) => onChange({ kinds })}
      renderField={(value, onChange) => (
        <Group wrap="nowrap" align="flex-end">
          <Box
            bg={value.color}
            w="40px"
            h="40px"
            style={{ borderRadius: "9999px", alignSelf: "center" }}
          />
          <TextInput
            style={{ flexGrow: "1" }}
            label="Category Title"
            placeholder="Category Title"
            defaultValue={value.title}
            onChange={(event) =>
              onChange({
                title: event.currentTarget.value ?? value.title,
              })
            }
          />
          <Box w="140px">
            <ColorPicker
              format="hex"
              swatchesPerRow={8}
              value={value.color}
              onChange={(color) => onChange({ color })}
              withPicker={false}
              size="xs"
              fullWidth
              swatches={hexColors}
            />
          </Box>
        </Group>
      )}
      createItem={() => ({
        title: "Places to visit",
        color: randomItem(hexColors),
        key: randId(),
      })}
    />
  ),
  DisplayComponent: ({ config, onChange, isDark, rect }) => {
    const kindsMap = useMemo(
      () =>
        Object.fromEntries(
          config.kinds.map((kind) => [kind.key, kind]),
        ) as Record<string, KindItem>,
      [config.kinds],
    );
    return (
      <Center h="100%" style={{ overflow: "hidden" }}>
        <WorldMap
          size={Math.min(rect.width + 200, rect.height + 200)}
          data={config.countries.map((c) => ({
            country: c.code,
            value: `${new Date(c.date).toLocaleDateString()};${c.kind}`,
          }))}
          backgroundColor="transparent"
          tooltipTextFunction={({ countryName, countryValue }) => {
            if (!countryValue) return "";
            const [date, kind] = countryValue.split(";");
            return `${countryName} - ${kindsMap[kind]?.title}: ${date}`;
          }}
          styleFunction={({ countryValue }) => {
            const defaults = {
              fill: countryValue ? "blue" : "transparent",
              stroke: isDark ? "#fff" : "#000",
              strokeWidth: 1,
              strokeOpacity: 0.2,
              cursor: "pointer",
            };
            if (!countryValue) return defaults;
            const [, kind] = countryValue.split(";");
            return {
              ...defaults,
              fill: kindsMap[kind]?.color ?? "transparent",
            };
          }}
          onClickFunction={(c) => {
            onChange({
              countries: config.countries.some(
                (country) => country.code === c.countryCode,
              )
                ? config.countries.filter(
                    (country) => country.code !== c.countryCode,
                  )
                : [
                    ...config.countries,
                    {
                      code: c.countryCode,
                      date: Date.now(),
                      kind: config.kind,
                    },
                  ],
            });
          }}
        />
      </Center>
    );
  },
  menuActions: ({ config, onChange }) => [
    {
      icon: () => <IconFlagPlus />,
      text: "Search country...",
      action: () => {
        promptEnum({
          value: "",
          title: "Mark country by name",
          labels: {
            submit: "Mark",
            cancel: "Cancel",
            placeholder: "Search country...",
            input: "Country name",
          },
          data: regions
            .map((country) => ({
              value: country.code,
              label: country.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
          onSubmitModal: (code) => {
            if (!code) return;
            onChange({
              countries: [
                ...config.countries.filter((country) => country.code !== code),
                { code, date: Date.now(), kind: config.kind },
              ],
            });
          },
        });
      },
    },
    ...config.kinds.map((kind) => ({
      text: `Set country to ${kind.title} on click`,
      icon: () =>
        config.kind === kind.key ? (
          <IconSquareRoundedCheck />
        ) : (
          <IconSquareRounded />
        ),
      action: () => {
        onChange({ kind: kind.key });
      },
    })),
  ],
};
