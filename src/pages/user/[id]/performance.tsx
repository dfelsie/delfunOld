import type { holding } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { Circles } from "react-loader-spinner";
import PortfolioChart from "../../../Components/Charts/PortfolioChart/PortfolioChart";
import UserTransactionItem from "../../../Components/UserProfile/UserTransactionItem";
import isNullOrUndefined from "../../../server/common/utils/isNullOrUndefined";
import { trpc } from "../../../utils/trpc";

function compareHoldingProperties(a: holding, b: holding, c: keyof holding) {
  const endDateA = a[c];
  const endDateB = b[c];

  if (endDateA === null) {
    if (endDateB === null) {
      return 0;
    }
    return 1;
  }
  if (endDateB === null) {
    return -1;
  }
  if (endDateA > endDateB) {
    return -1;
  }
  if (endDateA === endDateB) {
    return 0;
  }
  return 1;
}

function makeLabels(timeRange: string) {
  if (timeRange === "5d") {
    return ["4 days ago", "3 days ago", "2 days ago", "1 days ago", "Today"];
  }
  //TODO: make values for all ranges
  return ["4 days ago", "3 days ago", "2 days ago", "1 days ago", "Today"];
}

export default function Performance() {
  const router = useRouter();

  const uid = router.query.id;
  /*   const {
    data: portfolioDataRes,
    isLoading: portfolioIsLoading,
    isError: portfolioIsError,
  } = trpc.userdata.getUserPortfolio.useQuery({
    uid: (uid as string) ?? "",
  }); */
  const {
    data: portVals,
    isLoading: portValsIsLoading,
    isError: portValsIsError,
  } = trpc.userdata.getPortfolioValuesOverPeriod.useQuery({
    uid: (uid as string) ?? "",
    timeRange: "5d",
  });
  /*   const {
    data: transVals,
    isLoading: transValsIsLoading,
    isError: transValsIsError,
  } = trpc.userdata.getTransactionsOverPeriod.useQuery({
    uid: (uid as string) ?? "",
    timeRange: "5d",
  });
  console.log("Transvals: ", transVals ?? "No transaction data");
 */
  if (portValsIsError) {
    return <></>;
  }
  /*   if (portfolioIsError || portValsIsError) {
    return <></>;
  }
  if (portfolioIsLoading || portfolioDataRes?.data === undefined) {
    return <></>;
  }

  portfolioDataRes.data.sort((a, b) =>
    compareHoldingProperties(a, b, "start_date")
  );
 */
  if (isNullOrUndefined(portVals)) {
    return <></>;
  }
  if (portValsIsLoading) {
    <Circles
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />;
  }

  console.log(portVals);

  return (
    <div>
      Performance
      <PortfolioChart labels={makeLabels("5d")} portfolioVals={portVals} />
      {/* <ul>
        {portfolioDataRes.data.slice(0, 10).map((val, i) => (
          <li key={`StockNum${i}`}>
            <UserTransactionItem holding={val} />
          </li>
        ))}
      </ul> */}
    </div>
  );
}
