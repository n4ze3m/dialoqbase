import React from "react";
import { DashboardGrid } from "../components/Dashboard/DashboardGrid";
import { DashboardNewBtn } from "../components/Dashboard/DashboardNewBtn";
import { useMessage } from "../hooks/useMessage";

export default function Root() {
  const { setMessages, setHistory, setIsFirstMessage , setHistoryId} = useMessage();

  React.useEffect(() => {
    setHistoryId(null);
    setIsFirstMessage(true);
    setMessages([]);
    setHistory([]);
  }, []);

  return (
    <>
      {/* Create Bot Button */}
      <DashboardNewBtn />
      <DashboardGrid />
    </>
  );
}
