import "./App.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.tsx";

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
