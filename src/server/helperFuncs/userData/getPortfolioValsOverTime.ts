import type { holding, user } from "@prisma/client";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { getUserHoldingsOnDay } from "./getUserHoldingsOnDay";
import { STOCK_DAYS } from "../../common/consts/stockTradingDates";
import type OneDayPortfolioVal from "../../../Core/Types/OneDayPortfolioVal";
import { pairHoldingsWithStockTimeVal } from "../utils/PairHoldingWithStockTimeVal";

//If we can't find early transaction.
//May have to fix this.
const DEFAULT_BALANCE = 1_000_000;

const DATE_OFFSET = 7;

export async function getPortfolioValsOverTime(uid: string, range: string) {
  const user = await prisma?.user.findFirst({
    where: {
      id: uid,
    },
  });
  if (isNullOrUndefined(user)) {
    throw Error("User undefined");
  }
  //const currentDate = new Date("2022-10-29");
  return await getPortfolioValAtDate(user, DATE_OFFSET, range);
}

async function getPortfolioValAtDate(
  user: user,
  dateIndex: number,
  range: string
) {
  const holdingList = [];
  if (range === "5d") {
    //Do we need to get the very first transaction?
    for (let i = 4; i >= 0; i--) {
      //as string is needed in case out of bounds, need to fix.
      const currDate = new Date(STOCK_DAYS[dateIndex + i] as string);
      const oneDayAfterCurrDate = new Date(
        STOCK_DAYS[dateIndex + i - 1] as string
      );
      console.log(currDate);

      let holdingsForDay = await getUserHoldingsOnDay(
        user.id,
        oneDayAfterCurrDate
      );
      if (isNullOrUndefined(holdingsForDay)) {
        holdingsForDay = [];
      }
      const lastTransactionOfDay = await prisma?.transaction.findFirst({
        where: {
          uid: {
            equals: user.id,
          },
          timestamp: {
            lt: oneDayAfterCurrDate,
          },
        },
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
      });
      let freeBalance: number;

      if (isNullOrUndefined(lastTransactionOfDay)) {
        if (holdingsForDay.length > 0) {
          freeBalance =
            holdingsForDay[holdingsForDay.length - 1]?.free_balance ??
            DEFAULT_BALANCE;
        }
        //Default if we can't find a previous transaction or holding
        freeBalance = DEFAULT_BALANCE;
      } else {
        freeBalance = lastTransactionOfDay.free_balance;
      }

      const pairedHoldings = await pairHoldingsWithStockTimeVal(
        holdingsForDay,
        currDate
      );
      const totalValue = pairedHoldings.reduce(
        (totalValue, currentHolding) =>
          totalValue +
          (currentHolding?.price ?? 0) * currentHolding.holding.quantity,
        freeBalance
      );

      const thisDayPortfolioVal: OneDayPortfolioVal = {
        freeBalance: freeBalance,
        holdings: pairedHoldings,
        timestamp: currDate,
        totalValue: totalValue,
        uid: user.id,
      };

      holdingList.push(thisDayPortfolioVal);
    }
  }
  return holdingList;
}

/*
To actually detect if a user sold, we'd need to look at their transaction.
Can't we just look at their most recent transaction to see their free balance?
I think we can.
In fact, this should just be the default behavior.
If we were looking for real performance, we'd maintain a priority
queue for transactions... but this wouldn't help for this going back in time case.
There might be a way to avoid looking through transactions to do this, but I can't think of it.
We could even start the function by computing the days we care about, then looking for
the first transaction before that day.

If there's no transactions at all before the day, we can just put the default balance.


*/

function makeOneDayPortfolioVal(holdingAry: holding[]) {
  return;
}
