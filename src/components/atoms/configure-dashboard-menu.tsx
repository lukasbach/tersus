import { FC, useMemo } from "react";
import { Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Link } from "@tanstack/react-router";
import {
  IconArrowFork,
  IconHeart,
  IconLink,
  IconPencil,
  IconPin,
  IconPinned,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconTableExport,
  IconTableImport,
} from "@tabler/icons-react";
import { promptText } from "../../modal-utils.tsx";
import { useManagedDashboardData } from "../../use-managed-dashboard-data.ts";
import { createDashboard } from "../../firebase/app.ts";
import { useDashboardList } from "../../use-dashboard-list.ts";
import { useColorBlobs } from "../../use-color-blobs.ts";
import { links } from "../../pagedata.ts";
import { useDebugMode } from "../../use-debug-mode.ts";

export const ConfigureDashboardMenu: FC<{
  dashboard: ReturnType<typeof useManagedDashboardData>;
  dashboardId: string;
}> = ({ dashboard, dashboardId }) => {
  const list = useDashboardList();
  const [colorBlobs, setColorBlobs] = useColorBlobs();
  const [debugMode, setDebugMode] = useDebugMode();
  const isStarred = useMemo(
    () => list.starred.some((d) => d.id === dashboardId),
    [dashboardId, list.starred],
  );
  return (
    <Menu.Dropdown>
      <Menu.Label>Dashboard</Menu.Label>
      <Menu.Item
        leftSection={isStarred ? <IconPinned /> : <IconPin />}
        onClick={() => {
          if (isStarred) {
            list.removeStarred(dashboardId);
          } else {
            list.addStarred({
              id: dashboardId,
              title: dashboard.data?.title ?? "",
            });
          }
        }}
      >
        {isStarred ? "Unpin Dashboard" : "Pin Dashboard"}
      </Menu.Item>

      <Menu.Item
        leftSection={<IconPencil />}
        onClick={() =>
          promptText({
            title: "Rename dashboard",
            value: dashboard.data?.title ?? "",
            onSubmitModal: (value) =>
              dashboard.updateDashboardData({ title: value }),
          })
        }
      >
        Rename Dashboard
      </Menu.Item>

      <Menu.Item
        leftSection={<IconTableExport />}
        onClick={() => {
          const data = JSON.stringify(dashboard.data);
          const blob = new Blob([data], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${dashboard.data?.title?.replace(/[^a-zA-Z0-9 ]/g, "_") ?? "dashboard"}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Export dashboard as JSON
      </Menu.Item>

      <Menu.Item
        leftSection={<IconTableImport />}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "application/json";
          input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const data = await file.text();
            modals.openConfirmModal({
              title: "Replace dashboard data",
              children:
                "Are you sure you want to replace the current dashboard content with imported data?",
              labels: { cancel: "Cancel", confirm: "Replace current data" },
              onConfirm: () => {
                dashboard.updateDashboardData(JSON.parse(data));
              },
            });
          };
          input.click();
        }}
      >
        Import data from JSON file
      </Menu.Item>

      <Menu.Item
        leftSection={<IconArrowFork />}
        onClick={() => {
          modals.openConfirmModal({
            title: "Fork dashboard",
            children:
              "This will copy the dashboard contents, and create a new dashboard with the same content. The new dashboard will open in an new tab.",
            labels: { cancel: "Cancel", confirm: "Fork dashboard" },
            onConfirm: async () => {
              const newDashboard = JSON.parse(JSON.stringify(dashboard.data));
              newDashboard.title = `${newDashboard.title} (fork)`;
              const { id } = await createDashboard({
                ...JSON.parse(JSON.stringify(dashboard.data)),
                title: `${newDashboard.title} (fork)`,
              });
              window.open(`#/board/${id}`, "_blank");
            },
          });
        }}
      >
        Fork Dashboard
      </Menu.Item>

      <Menu.Item
        leftSection={<IconLink />}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href.toString());
        }}
      >
        Copy share link
      </Menu.Item>

      <Menu.Divider>
        <Menu.Label>Tersus</Menu.Label>
        <Menu.Item
          leftSection={
            colorBlobs ? <IconSquareRoundedCheck /> : <IconSquareRounded />
          }
          onClick={() => {
            setColorBlobs((val) => !val);
          }}
        >
          Background Color Blobs
        </Menu.Item>
        <Menu.Item
          leftSection={
            debugMode ? <IconSquareRoundedCheck /> : <IconSquareRounded />
          }
          onClick={() => {
            setDebugMode((val) => !val);
          }}
        >
          Debug Mode
        </Menu.Item>
        <Menu.Item
          component={Link}
          to={links.sponsor}
          target="_blank"
          rel="noopener noreferrer"
          leftSection={<IconHeart />}
        >
          Sponsor Tersus
        </Menu.Item>
      </Menu.Divider>
    </Menu.Dropdown>
  );
};
