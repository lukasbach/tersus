import {
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  defaultParseSearch,
} from "@tanstack/react-router";
import { DashboardPage } from "./components/dashboard-page/dashboard-page.tsx";
import { HomePage } from "./components/homepage/home-page.tsx";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const boardViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board/$id",
  component: () => <DashboardPage />,
});

const routeTree = rootRoute.addChildren([indexRoute, boardViewRoute]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  parseSearch: () =>
    defaultParseSearch(
      (window.location.search || window.location.href.split("?", 2)[1]) ?? "",
    ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
