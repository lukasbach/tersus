import { FC, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  AppShell,
  Box,
  Button,
  Drawer,
  Flex,
  Group,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments, IconPlus } from "@tabler/icons-react";
import { boardViewRoute } from "../router.tsx";
import { widgets } from "../widgets";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";
import { WidgetContainer } from "./widget-container.tsx";
import { AddWidgetBtn } from "./atoms/add-widget-btn.tsx";
import { NavbarHeader } from "./atoms/navbar-header.tsx";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardPage: FC = () => {
  const { id } = boardViewRoute.useParams();
  const [breakpoint, setBreakpoint] = useState("lg");
  const dashboard = useManagedDashboardData(id);
  const [widgetDrawerOpen, widgetDrawer] = useDisclosure(false);

  if (!dashboard.data) return null;

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Flex h="100%" align="center" justify="space-between" p="lg">
          <NavbarHeader />
          <Box>
            <Text fw="600">My first dashboard</Text>
          </Box>
          <Group>
            <Button
              radius="md"
              onClick={widgetDrawer.open}
              leftSection={<IconPlus />}
            >
              Add Widget
            </Button>
            <Button radius="md" leftSection={<IconAdjustments />}>
              Configure
            </Button>
          </Group>
        </Flex>
      </AppShell.Header>
      <Drawer
        opened={widgetDrawerOpen}
        onClose={widgetDrawer.close}
        position="right"
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
      <AppShell.Main bg="gray.1">
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
