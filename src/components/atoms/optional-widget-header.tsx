import { ComponentType, FC, Fragment } from "react";
import { Group, Text } from "@mantine/core";

export const OptionalWidgetHeader: FC<{
  title?: string;
  icon?: ComponentType;
}> = ({ title, icon }) => {
  if (!title) return null;
  const Icon = icon ?? Fragment;
  return (
    <Group mt="-8px" mb="xs" gap="xs">
      <Icon />
      <Text>{title}</Text>
    </Group>
  );
};
