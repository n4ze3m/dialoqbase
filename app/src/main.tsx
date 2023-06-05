import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import DashboardLayout from "./Layout";
import NewRoot from "./routes/new/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BotLayout from "./Layout/BotLayout";
import BotEmbedRoot from "./routes/bot/embed";
const router = createHashRouter([
  {
    element: <DashboardLayout><Root /></DashboardLayout>,
    path: "/",
  },
  {
    element: <DashboardLayout><NewRoot /></DashboardLayout>,
    path: "/new",
  },
  {
    path: "/bot/:id",
    element: <BotLayout>
      <BotEmbedRoot />
    </BotLayout>
  },
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
