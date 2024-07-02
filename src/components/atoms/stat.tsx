import { FC, PropsWithChildren, ReactNode } from "react";
import { Stack, Text } from "@mantine/core";

export const Stat: FC<
  PropsWithChildren<{ title: string; subtitle?: ReactNode; alert?: boolean }>
> = ({ alert, title, children, subtitle }) => {
  return (
    <Stack align="start" gap="0">
      <Text size="xs" c="dimmed">
        {title}
      </Text>
      <Text size="2rem" fw="800" c={alert ? "red" : undefined}>
        {children}
      </Text>
      {subtitle && (
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};
