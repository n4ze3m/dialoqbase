import { DashboardGrid } from "../components/Dashboard/DashboardGrid";
import { DashboardNewBtn } from "../components/Dashboard/DashboardNewBtn";

export default function Root() {
  return (
    <>
      {/* Create Bot Button */}
      <DashboardNewBtn />
      <DashboardGrid />
    </>
  );
}

