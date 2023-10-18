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
import BotPreviewRoot from "./routes/bot/playground";
import BotDSRoot from "./routes/bot/ds";
import BotSettingsRoot from "./routes/bot/settings";
import LoginRoot from "./routes/login/root";
import { AuthProvider } from "./context/AuthContext";
import SettingsRoot from "./routes/settings/root";
import BotIntegrationRoot from "./routes/bot/integrations";
import BotAppearanceRoot from "./routes/bot/appearance";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import BotPlaygroundLayout from "./Layout/BotPlaygroundLayout";
import BotConversationsRoot from "./routes/bot/conversations";
import RegisterRoot from "./routes/register";
import { QueryBoundaries } from "./components/Common/QueryBoundaries";
import SettingsApplicationRoot from "./routes/settings/application";
import SettingsTeamsRoot from "./routes/settings/teams";
import BotIntegrationAPIRoot from "./routes/bot/api";
import SettingsModelRoot from "./routes/settings/model";

const router = createHashRouter([
  {
    element: (
      <DashboardLayout>
        <Root />
      </DashboardLayout>
    ),
    path: "/",
  },
  {
    element: (
      <DashboardLayout>
        <NewRoot />
      </DashboardLayout>
    ),
    path: "/new",
  },
  {
    path: "/bot/:id/embed",
    element: (
      <BotLayout>
        <BotEmbedRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id",
    element: (
      <BotPlaygroundLayout>
        <BotPreviewRoot />
      </BotPlaygroundLayout>
    ),
  },
  {
    path: "/bot/:id/playground/:history_id",
    element: (
      <BotPlaygroundLayout>
        <BotPreviewRoot />
      </BotPlaygroundLayout>
    ),
  },
  {
    path: "/bot/:id/conversations",
    element: (
      <BotPlaygroundLayout>
        <BotConversationsRoot />
      </BotPlaygroundLayout>
    ),
  },
  {
    path: "/bot/:id/conversations/:type/:conversation_id",
    element: (
      <BotPlaygroundLayout>
        <BotConversationsRoot />
      </BotPlaygroundLayout>
    ),
  },
  {
    path: "/bot/:id/data-sources",
    element: (
      <BotLayout>
        <BotDSRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/settings",
    element: (
      <BotLayout>
        <BotSettingsRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/integrations",
    element: (
      <BotLayout>
        <BotIntegrationRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/integrations/api",
    element: (
      <BotLayout>
        <BotIntegrationAPIRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/appearance",
    element: (
      <BotLayout>
        <BotAppearanceRoot />
      </BotLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginRoot />,
  },
  {
    path: "/settings",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/settings/application",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsApplicationRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/settings/teams",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsTeamsRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/settings/model",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsModelRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/register",
    element: <RegisterRoot />,
  },
]);
const queryClient = new QueryClient({});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider theme={{}}>
      <StyleProvider hashPriority="high">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AuthProvider>
      </StyleProvider>
    </ConfigProvider>
  </React.StrictMode>
);
