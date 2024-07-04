import { FC } from "react";
import {
  AppShell,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { IconBrandGithub, IconHeart, IconTablePlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { NavbarHeader } from "./atoms/navbar-header.tsx";
import { BgBlobs } from "./atoms/bg-blobs.tsx";
import styles from "./home-page.module.css";
import { widgets } from "../widgets";
import { sampleDashboards } from "../sample-dashboards.ts";
import { createDashboardFromTemplate } from "../firebase/app.ts";
import { links } from "../pagedata.ts";

export const HomePage: FC = () => {
  const theme = useComputedColorScheme();
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Flex h="100%" align="center" justify="space-between" p="lg">
          <NavbarHeader />
          <Group>
            <Button
              leftSection={<IconHeart />}
              component={Link}
              to={links.sponsor}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sponsor
            </Button>
            <Button
              leftSection={<IconTablePlus />}
              onClick={() => createDashboardFromTemplate("empty", true)}
            >
              Create Dashboard
            </Button>
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Main bg="var(--board-bg)">
        <BgBlobs />
        <Box pos="relative">
          <Container size={1000}>
            <Title className={styles.title}>
              A{" "}
              <Text
                variant="gradient"
                gradient={{ from: "indigo", to: "grape", deg: 90 }}
                component="span"
                fw="inherit"
                fs="inherit"
                style={{ fontSize: "inherit" }}
              >
                simple dashboarding tool
              </Text>{" "}
              to keep track of everyday tasks
            </Title>
            <Group wrap="nowrap" align="center" gap="60px">
              <Box style={{ flexGrow: "1", flexShrink: "1" }}>
                <Text className={styles.subtext}>
                  {Object.keys(widgets).length} different widgets help you to
                  create a customized dashboard. Keep track of recurring chores,
                  appointments or tax deadlines, visualize how consistently you
                  accomplish regular habits, manage various custom counters and
                  more.
                </Text>
                <Text className={styles.subtext}>
                  Tersus does not require any registration, you can just create
                  a new dashboard and start adding widgets. You get a shareable
                  URL for every dashboard, which you can use to share the
                  dashboard with others.
                </Text>
              </Box>
              <Stack>
                <Button
                  size="xl"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "grape", deg: 112 }}
                  leftSection={<IconTablePlus />}
                  radius="lg"
                  onClick={() => createDashboardFromTemplate("empty", true)}
                >
                  Create Dashboard
                </Button>
                <Button
                  component={Link}
                  to="https://github.com/lukasbach/tersus"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="xl"
                  color="#000"
                  leftSection={<IconBrandGithub />}
                  radius="lg"
                >
                  GitHub
                </Button>
              </Stack>
            </Group>
          </Container>
          <Center>
            <img
              src={`/dashboards/sample-${theme}.png`}
              alt="Dashboard example"
              className={styles.headerImg}
            />
          </Center>

          <Container size={1000} mt="10rem">
            <Title className={styles.title}>Templates</Title>
            <Text className={styles.subtext}>
              You can immediately get started with one of the following
              dashboard templates. Clone any of the following templates and get
              started by customizing it.
            </Text>
          </Container>

          {Object.entries(sampleDashboards).map(([id, dashboard]) => (
            <Container key={id} mt="lg" size={2000}>
              <Group className={styles.sampleGroup}>
                <Stack style={{ flexGrow: "1" }} pl="xl">
                  <Title order={2} mt="xl">
                    {dashboard.title}
                  </Title>
                  {dashboard.description.map((text) => (
                    <Text key={text}>{text}</Text>
                  ))}
                  <Center mt="xl" mb="xl">
                    <Button
                      size="xl"
                      variant="gradient"
                      gradient={{ from: "indigo", to: "grape", deg: 112 }}
                      leftSection={<IconTablePlus />}
                      radius="lg"
                      onClick={() => createDashboardFromTemplate(id, true)}
                    >
                      Clone Dashboard
                    </Button>
                  </Center>
                </Stack>
                <Center>
                  <img
                    src={`/dashboards/${id}-${theme}.png`}
                    alt={dashboard.title}
                    className={styles.templateImg}
                  />
                </Center>
              </Group>
            </Container>
          ))}

          <Container size={1000} mt="10rem">
            <Title className={styles.title}>Widgets</Title>
            <Text className={styles.subtext}>
              Various widgets can be freely configured and arranged on your
              dashboard. You can add as many widgets as you like, and customize
              them to your needs.
            </Text>

            <Grid gutter="xl">
              {Object.entries(widgets).map(([id, widget]) => (
                <Grid.Col key={id} span={4} mb="xl">
                  <Group gap="xs">
                    <widget.IconComponent />
                    <Title order={3}>{widget.name}</Title>
                  </Group>
                  {widget.description.map((text) => (
                    <Text key={text} mb="sm">
                      {text}
                    </Text>
                  ))}
                </Grid.Col>
              ))}
            </Grid>
          </Container>

          <Center mt="xl" mb="xl">
            <Button
              size="xl"
              variant="gradient"
              gradient={{ from: "indigo", to: "grape", deg: 112 }}
              leftSection={<IconTablePlus />}
              radius="lg"
              onClick={() => createDashboardFromTemplate("empty", true)}
            >
              Create Dashboard
            </Button>
          </Center>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};
