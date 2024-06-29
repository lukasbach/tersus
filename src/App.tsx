import "./App.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";
import { ModalsProvider } from "@mantine/modals";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { router } from "./router.tsx";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@mantine/core/styles.css";

TimeAgo.addDefaultLocale(en);

const App = () => {
  return (
    <MantineProvider
      theme={{
        fontSizes: {
          md: ".9rem",
        },
        autoContrast: true,
        components: {
          TextInput: {
            defaultProps: { size: "sm" },
            styles: {
              wrapper: {
                marginTop: "4px",
              },
            },
          },
          Modal: {
            defaultProps: {
              radius: "lg",
            },
            styles: {
              title: {
                fontWeight: "700",
                fontSize: "1.1rem",
              },
              header: {},
            },
          },
          Menu: {
            styles: {
              dropdown: { padding: "6px" },
              itemLabel: { fontSize: ".8rem" },
              itemSection: { height: "8px" },
              item: {
                padding: "4px 12px",
              },
            },
            classNames: {
              itemSection: "menuIcon",
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
