import { FC, useMemo } from "react";
import { Menu } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { IconStar } from "@tabler/icons-react";
import { useDashboardList } from "../../use-dashboard-list.ts";
import { boardViewRoute } from "../../router.tsx";

export const RecentDashboardsMenu: FC<{
  currentDashboardId: string;
}> = ({ currentDashboardId }) => {
  const list = useDashboardList();
  const navigate = useNavigate();

  const starred = useMemo(
    () => list.starred.filter(({ id }) => id !== currentDashboardId),
    [currentDashboardId, list.starred],
  );

  const recent = useMemo(
    () =>
      list.recents
        .slice(0, 10)
        .filter(
          ({ id }) =>
            id !== currentDashboardId &&
            !starred.some((star) => star.id === id),
        ),
    [currentDashboardId, list.recents, starred],
  );

  return (
    <Menu.Dropdown>
      {starred.length === 0 && recent.length === 0 && (
        <Menu.Item disabled>No recent dashboards</Menu.Item>
      )}

      {starred.map(({ id, title }) => (
        <Menu.Item
          key={id}
          leftSection={<IconStar />}
          onClick={() =>
            navigate({ to: boardViewRoute.fullPath, params: { id } })
          }
        >
          {title}
        </Menu.Item>
      ))}
      {recent.map(({ id, title }) => (
        <Menu.Item
          key={id}
          onClick={() =>
            navigate({ to: boardViewRoute.fullPath, params: { id } })
          }
        >
          {title}
        </Menu.Item>
      ))}
    </Menu.Dropdown>
  );
};
