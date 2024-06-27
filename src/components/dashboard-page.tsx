import { FC } from "react";
import GridLayout from "react-grid-layout";
import { boardViewRoute } from "../router.tsx";
import { useDashboardData } from "../firebase/app.ts";

export const DashboardPage: FC = () => {
  const { id } = boardViewRoute.useParams();
  const [dashboard] = useDashboardData(id);

  if (!dashboard) return null;

  console.log(dashboard.data());
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <div style={{ textAlign: "left" }}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </GridLayout>
    </div>
  );
};
