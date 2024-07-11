import { IconListCheck, IconSearch, IconSearchOff } from "@tabler/icons-react";
import { regions } from "react-svg-worldmap";
import { useMemo } from "react";
import { Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PayloadOfWidgetDefinition, WidgetDefinition } from "../types.ts";
import { KindItem, visitedCountriesWidget } from "./visited-countries.tsx";
import { SearchableList } from "../components/atoms/searchable-list.tsx";
import { promptDate, promptEnum } from "../modal-utils.tsx";

const regionMap = Object.fromEntries(regions.map((r) => [r.code, r.name]));

export const visitedCountriesListWidget: WidgetDefinition<
  { showSearch: boolean },
  PayloadOfWidgetDefinition<typeof visitedCountriesWidget>
> = {
  name: "Visited Countries List",
  referencing: visitedCountriesWidget,
  IconComponent: IconListCheck,
  label: "List of visited countries",
  description: [
    "A list of countries you've visited. This widget is linked to a Visited Countries Map widget, and will show the countries you've marked as visited.",
    "This gives you additional options to customize the date or kind of individual entries.",
  ],
  default: {
    title: "",
    showSearch: true,
  },
  sizing: { w: 4, h: 2 },
  DisplayComponent: ({ referencing, config }) => {
    const kindsMap = useMemo<Record<string, KindItem>>(() => {
      return Object.fromEntries(
        referencing?.config.kinds.map((k) => [k.key, k]) ?? [],
      );
    }, [referencing?.config.kinds]);

    if (!referencing) return null;

    return (
      <SearchableList
        items={referencing.config.countries.map((c) => ({
          title: regionMap[c.code],
          subtitle: new Date(c.date).toLocaleDateString(),
          color: kindsMap[c.kind]?.color,
          meta: kindsMap[c.kind]?.title,
          key: c.code,
          menu: (
            <>
              <Menu.Item
                onClick={() => {
                  promptDate({
                    title: "Change Date",
                    labels: {
                      input: "Date of item",
                      placeholder: "Date",
                      submit: "Update date",
                      cancel: "Cancel",
                    },
                    value: new Date(c.date),
                    onSubmitModal: (date) => {
                      referencing?.onChange({
                        countries: referencing.config.countries.map((cc) =>
                          cc.code === c.code
                            ? { ...cc, date: date.getTime() }
                            : cc,
                        ),
                      });
                    },
                  });
                }}
              >
                Change Date
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  promptEnum({
                    title: "Change Category",
                    labels: {
                      input: "Category of item",
                      placeholder: "Category",
                      submit: "Update Category",
                      cancel: "Cancel",
                    },
                    data: referencing.config.kinds.map((kind) => ({
                      value: kind.key,
                      label: kind.title,
                    })),
                    value: c.kind,
                    onSubmitModal: (kind) => {
                      referencing?.onChange({
                        countries: referencing.config.countries.map((cc) =>
                          cc.code === c.code ? { ...cc, kind } : cc,
                        ),
                      });
                    },
                  });
                }}
              >
                Change Category
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => {
                  modals.openConfirmModal({
                    title: "Remove entry",
                    children:
                      "Are you sure you want to remove the country from your list?",
                    labels: {
                      confirm: "Remove",
                      cancel: "Cancel",
                    },
                    onConfirm: () => {
                      referencing?.onChange({
                        countries: referencing.config.countries.filter(
                          (cc) => cc.code !== c.code,
                        ),
                      });
                    },
                  });
                }}
              >
                Remove from list
              </Menu.Item>
            </>
          ),
        }))}
        searchBarOpen={config.showSearch}
      />
    );
  },
  iconActions: [
    {
      text: "Show Search",
      icon: () => <IconSearchOff />,
      action: ({ onChange }) => onChange({ showSearch: true }),
      skip: ({ config }) => config.showSearch,
    },
    {
      text: "Hide Search",
      icon: () => <IconSearch />,
      action: ({ onChange }) => onChange({ showSearch: false }),
      skip: ({ config }) => !config.showSearch,
    },
  ],
};
