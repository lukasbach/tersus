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
  IconTablePlus,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { createDashboard } from "../../firebase/app.ts";
import { RecentDashboardsMenu } from "./recent-dashboards-menu.tsx";

export const NavbarHeader: FC<
  PropsWithChildren<{ currentDashboardId: string }>
> = ({ children, currentDashboardId }) => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery(`(max-width: ${em(1100)})`);
  return (
    <Group gap="xs">
      <UnstyledButton>
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
      <ActionIcon size="lg" variant="default" radius="md">
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
      <Button
        variant="subtle"
        leftSection={!isMobile && <IconTablePlus />}
        onClick={async () => {
          // TODO Default dashboard
          const { id } = await createDashboard({
            widgets: {},
            layouts: {},
            title: `My new dashboard`,
          });
          window.open(`#/board/${id}`, "_blank");
        }}
      >
        {!isMobile ? "Create Dashboard" : <IconTablePlus />}
      </Button>
      {children}
    </Group>
  );
};
