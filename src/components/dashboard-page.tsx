import { FC } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { AppShell, Button } from "@mantine/core";
import { boardViewRoute } from "../router.tsx";
import { widgets } from "../widgets";
import { useManagedDashboardData } from "../use-managed-dashboard-data.ts";
import { WidgetContainer } from "./widget-container.tsx";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardPage: FC = () => {
  const { id } = boardViewRoute.useParams();
  const dashboard = useManagedDashboardData(id);

  if (!dashboard.data) return null;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: false },
      }}
    >
      <AppShell.Header>Hello</AppShell.Header>
      <AppShell.Navbar p="md">
        {widgets.map((widget) => {
          return (
            <Button
              key={widget.type}
              onClick={() => {
                dashboard.addWidget(widget);
              }}
            >
              {widget.name}
            </Button>
          );
        })}
      </AppShell.Navbar>
      <AppShell.Main>
        <ResponsiveGridLayout
          className="layout"
          layouts={dashboard.data.layouts}
          onLayoutChange={dashboard.onLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={80}
          draggableHandle=".draghandle"
        >
          {Object.entries(dashboard.data.widgets).map(([id, widget]) => (
            <div key={id}>
              <WidgetContainer
                key={id}
                widget={widget}
                deleteWidget={() => dashboard.deleteWidget(id)}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </AppShell.Main>
    </AppShell>
  );
};
