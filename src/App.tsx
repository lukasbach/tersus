import "./App.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.tsx";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@mantine/core/styles.css";

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
