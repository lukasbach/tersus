import "./App.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.tsx";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";

const App = () => {
  return (
    <MantineProvider>
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
