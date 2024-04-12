import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/dates/styles.css";
import "./index.css";
import "@mantine/notifications/styles.css";
import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DatesProvider } from "@mantine/dates";
import { HashRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <HashRouter>
        <ModalsProvider>
          <Notifications position="top-center" />
          <DatesProvider settings={{ locale: "ru" }}>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </DatesProvider>
        </ModalsProvider>
      </HashRouter>
    </MantineProvider>
  </React.StrictMode>
);
