import { FC, ReactNode } from "react";
import {
  ActionIcon,
  Box,
  DEFAULT_THEME,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { FloatingBarContainer } from "./floating-bar-container.tsx";
import { FloatingBar } from "./floating-bar.tsx";
import styles from "./list-item.module.css";

export type ListItemProps = {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  meta?: string | ReactNode;
  icon?: ReactNode;
  color?: string;
  menu?: ReactNode;
  actions?: ReactNode;
};

export const ListItem: FC<ListItemProps> = ({
  title,
  subtitle,
  meta,
  icon,
  color,
  menu,
  actions,
}) => {
  const hexColor = DEFAULT_THEME.colors[color as string]?.[5] ?? color;
  return (
    <div>
      <FloatingBarContainer>
        <Group
          w="100%"
          className={styles.container}
          style={{
            "--color": hexColor,
          }}
        >
          {icon && <Stack className={styles.icon}>{icon}</Stack>}
          {!icon && color ? <Box className={styles.colorDot} /> : null}
          <Stack className={styles.left} gap="0">
            <Text fw="500">{title}</Text>
            {subtitle && <Text c="dimmed">{subtitle}</Text>}
          </Stack>
          {meta && (
            <Stack className={styles.right}>
              <Text c="dimmed">{meta}</Text>
            </Stack>
          )}
        </Group>
        {(menu || actions) && (
          <FloatingBar>
            {actions}
            {menu && (
              <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>{menu}</Menu.Dropdown>
              </Menu>
            )}
          </FloatingBar>
        )}
      </FloatingBarContainer>
    </div>
  );
};
