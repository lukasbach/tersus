/* eslint-disable no-nested-ternary */
import { FC, PropsWithChildren } from "react";
import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
  isLightColor,
  parseThemeColor,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import styles from "./stat-btn.module.css";

export const StatBtn: FC<
  PropsWithChildren<{
    onClick?: () => void;
    color: string;
    active?: boolean;
    value: string;
    badge?: string;
  }>
> = ({ active, badge, value, onClick, color, children }) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isLight = isLightColor(parseThemeColor({ color, theme }).value, 0.3);
  const textColor = isLight ? "black" : "white";
  const content = (
    <Paper
      p="lg"
      radius="lg"
      bg={`var(--mantine-color-${color}-${active ? "filled" : "light"}`}
      c={!active ? undefined : textColor}
      className={onClick ? styles.statBtnClickable : ""}
      miw="140px"
    >
      <Group align="flex-start">
        <Stack>
          <Text>{children}</Text>
          <Text fw="800" size="2.2rem">
            {value}
          </Text>
        </Stack>
        {badge && (
          <Stack>
            <Badge
              variant={
                colorScheme === "dark"
                  ? active
                    ? "transparent"
                    : "light"
                  : active
                    ? "filled"
                    : "light"
              }
              color={color}
            >
              {badge}
            </Badge>
          </Stack>
        )}
      </Group>
    </Paper>
  );

  return onClick ? (
    <UnstyledButton onClick={onClick}>{content}</UnstyledButton>
  ) : (
    content
  );
};
