import "./App.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "@tanstack/react-router";
import { ModalsProvider } from "@mantine/modals";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { DatesProvider } from "@mantine/dates";
import { router } from "./router.tsx";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";

TimeAgo.addDefaultLocale(en);

const App = () => {
  return (
    <MantineProvider
      theme={{
        fontSizes: {
          md: ".9rem",
        },
        primaryColor: "indigo",
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
        <DatesProvider settings={{ consistentWeeks: true, firstDayOfWeek: 1 }}>
          <RouterProvider router={router} />
        </DatesProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
