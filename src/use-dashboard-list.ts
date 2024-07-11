import { useLocalStorage } from "@mantine/hooks";
import { useStableHandler } from "./utils.ts";

type DashboardLink = { id: string; title: string };

export const useDashboardList = () => {
  const [recents, setRecents] = useLocalStorage<DashboardLink[]>({
    key: "recentdashboards",
    defaultValue: [],
  });
  const [starred, setStarred] = useLocalStorage<DashboardLink[]>({
    key: "starreddashboards",
    defaultValue: [],
  });

  const addRecent = useStableHandler((dashboard: DashboardLink) => {
    const newRecents = recents.filter((d) => d.id !== dashboard.id);
    newRecents.unshift(dashboard);
    setRecents(newRecents.slice(0, 30));
  });

  const addStarred = useStableHandler((dashboard: DashboardLink) => {
    setStarred((current) => {
      if (current.some((d) => d.id === dashboard.id)) {
        return current;
      }

      return [...current, dashboard];
    });
  });

  const removeStarred = useStableHandler((id: string) => {
    setStarred((current) => current.filter((d) => d.id !== id));
  });

  const updateDashboardName = useStableHandler((id: string, title: string) => {
    setRecents((current) =>
      current.map((d) => (d.id === id ? { ...d, title } : d)),
    );
    setStarred((current) =>
      current.map((d) => (d.id === id ? { ...d, title } : d)),
    );
  });

  return {
    recents,
    starred,
    addRecent,
    addStarred,
    removeStarred,
    updateDashboardName,
  };
};
