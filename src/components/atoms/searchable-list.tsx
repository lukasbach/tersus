import { FC, useState } from "react";
import { Box, Group, Stack, TextInput } from "@mantine/core";
import { ListItem, ListItemProps } from "./list-item.tsx";

const defaultMatcher = (item: ListItemProps, search: string) =>
  [item.title, item.subtitle, item.meta]
    .filter((str) => typeof str === "string")
    .join(" ")
    .toLowerCase()
    .includes(search);

export const SearchableList: FC<{
  items: (ListItemProps & { key: string })[];
  searchBarOpen: boolean;
  matchFn?: (item: ListItemProps, search: string) => boolean;
}> = ({ items, matchFn, searchBarOpen }) => {
  const [search, setSearch] = useState("");
  return (
    <Stack h="100%">
      {searchBarOpen && (
        <Group>
          <TextInput
            style={{ flexGrow: "1" }}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Group>
      )}
      <Box style={{ flexGrow: "1", overflow: "auto" }}>
        {items
          .filter((item) => (matchFn ?? defaultMatcher)(item, search))
          .map((item) => (
            <ListItem {...item} key={item.key} />
          ))}
      </Box>
    </Stack>
  );
};
