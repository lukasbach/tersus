import { FC, PropsWithChildren } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Text,
  UnstyledButton,
  em,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconLayoutBoard,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { RecentDashboardsMenu } from "./recent-dashboards-menu.tsx";
import { links } from "../../pagedata.ts";

export const NavbarHeader: FC<
  PropsWithChildren<{ currentDashboardId?: string }>
> = ({ children, currentDashboardId }) => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery(`(max-width: ${em(1100)})`);
  return (
    <Group gap="xs">
      <UnstyledButton component={Link} to="/">
        <Group gap="xs" mr="lg">
          <IconLayoutBoard />
          <Text size="md" fw="600">
            Tersus
          </Text>
        </Group>
      </UnstyledButton>
      <Menu shadow="md">
        <Menu.Target>
          <Button variant="default">
            {isMobile ? "Recents" : "Recent Dashboards"}
          </Button>
        </Menu.Target>
        <RecentDashboardsMenu currentDashboardId={currentDashboardId} />
      </Menu>
      <ActionIcon
        size="lg"
        variant="default"
        radius="md"
        component={Link}
        to={links.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconBrandGithub />
      </ActionIcon>
      <ActionIcon
        size="lg"
        variant="default"
        radius="md"
        onClick={toggleColorScheme}
      >
        {colorScheme !== "dark" ? <IconMoon /> : <IconSun />}
      </ActionIcon>
      {children}
    </Group>
  );
};
