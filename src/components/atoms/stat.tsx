import { FC, PropsWithChildren } from "react";
import { Stack, Text } from "@mantine/core";

export const Stat: FC<
  PropsWithChildren<{ title: string; alert?: boolean }>
> = ({ alert, title, children }) => {
  return (
    <Stack align="start" gap="0">
      <Text size="xs" c="dimmed">
        {title}
      </Text>
      <Text size="2rem" fw="800" c={alert ? "red" : undefined}>
        {children}
      </Text>
    </Stack>
  );
};
