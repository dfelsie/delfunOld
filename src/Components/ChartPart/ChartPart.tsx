import React from "react";
import Linechart from "../Linechart/Linechart";

type Props = {
  chartName: string;
  graphData: any;
};

export default function ChartPart({ chartName, graphData }: Props) {
  return (
    <div className="w-2/3 h-1/3">
      <h5>{chartName}</h5>
      <Linechart graphData={graphData} />
    </div>
  );
}
