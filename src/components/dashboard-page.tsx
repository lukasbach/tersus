import { FC, useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  AppShell,
  Box,
  Button,
  Drawer,
  Flex,
  Group,
  Menu,
  Text,
  em,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconAdjustments, IconSquareRoundedPlus } from "@tabler/icons-react";
import { boardViewRoute } from "../router.tsx";
import { widgets } from "../widgets";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";
import { WidgetContainer } from "./widget-container.tsx";
import { AddWidgetBtn } from "./atoms/add-widget-btn.tsx";
import { NavbarHeader } from "./atoms/navbar-header.tsx";
import { ConfigureDashboardMenu } from "./atoms/configure-dashboard-menu.tsx";
import { useDashboardList } from "../use-dashboard-list.ts";
import { BgBlobs } from "./atoms/bg-blobs.tsx";
import { useColorBlobs } from "./use-color-blobs.ts";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardPageInner: FC<{ id: string }> = ({ id }) => {
  const [breakpoint, setBreakpoint] = useState("lg");
  const dashboard = useManagedDashboardData(id);
  const [widgetDrawerOpen, widgetDrawer] = useDisclosure(false);
  const { addRecent } = useDashboardList();
  const isMobile = useMediaQuery(`(max-width: ${em(1100)})`);
  const [colorBlobs] = useColorBlobs();

  useEffect(() => {
    if (!dashboard.data) return;
    addRecent({ title: dashboard.data.title, id });
  }, [addRecent, dashboard.data, id]);

  if (!dashboard.data) return null;

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Flex h="100%" align="center" justify="space-between" p="lg">
          <NavbarHeader currentDashboardId={id} />
          <Box>
            <Text fw="600">{dashboard.data.title}</Text>
          </Box>
          <Group>
            <Button
              radius="md"
              onClick={widgetDrawer.open}
              leftSection={!isMobile && <IconSquareRoundedPlus />}
            >
              {!isMobile ? "Add Widget" : <IconSquareRoundedPlus />}
            </Button>

            <Menu shadow="md" width={240}>
              <Menu.Target>
                <Button
                  radius="md"
                  leftSection={!isMobile && <IconAdjustments />}
                >
                  {!isMobile ? "Configure" : <IconAdjustments />}
                </Button>
              </Menu.Target>
              <ConfigureDashboardMenu dashboard={dashboard} dashboardId={id} />
            </Menu>
          </Group>
        </Flex>
      </AppShell.Header>
      <Drawer
        opened={widgetDrawerOpen}
        onClose={widgetDrawer.close}
        position="right"
        title="Add a widget..."
      >
        {Object.keys(widgets).map((widgetType) => {
          return (
            <AddWidgetBtn
              key={widgetType}
              widgetType={widgetType}
              onClick={() => {
                dashboard.addWidget(widgetType);
              }}
            />
          );
        })}
      </Drawer>
      <AppShell.Main bg="var(--board-bg)">
        {colorBlobs && <BgBlobs />}
        <ResponsiveGridLayout
          className="layout"
          layouts={dashboard.data.layouts}
          onLayoutChange={dashboard.onLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          draggableHandle=".draghandle"
          onBreakpointChange={(newBreakpoint) => setBreakpoint(newBreakpoint)}
        >
          {Object.keys(dashboard.data.widgets).map((id) => (
            <div key={id}>
              <WidgetContainer
                key={id}
                widgetId={id}
                dashboard={dashboard}
                breakpoint={breakpoint}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </AppShell.Main>
    </AppShell>
  );
};

export const DashboardPage = () => {
  const { id } = boardViewRoute.useParams();
  return <DashboardPageInner id={id} key={id} />;
};
