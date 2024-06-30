import { FC, PropsWithChildren } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconLayoutBoard,
  IconMoon,
  IconSun,
  IconTablePlus,
} from "@tabler/icons-react";
import { createDashboard } from "../../firebase/app.ts";

export const NavbarHeader: FC<PropsWithChildren> = ({ children }) => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
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
      <Button variant="default">Recent Dashboards</Button>
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
        leftSection={<IconTablePlus />}
        onClick={async () => {
          // TODO Default dashboard
          const { id } = await createDashboard({
            widgets: {},
            layouts: {},
            title: `My new dashboard`,
            lastEdit: Date.now(),
          });
          window.open(`#/board/${id}`, "_blank");
        }}
      >
        Create Dashboard
      </Button>
      {children}
    </Group>
  );
};
