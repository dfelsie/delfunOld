import type { holding, user } from "@prisma/client";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { STOCK_DAYS } from "../../common/consts/stockTradingDates";
import type OneDayPortfolioVal from "../../../Core/Types/OneDayPortfolioVal";
import { pairHoldingsWithStockTimeVal } from "../utils/PairHoldingWithStockTimeVal";

//If we can't find early transaction.
//May have to fix this.
const DEFAULT_BALANCE = 1_000_000;

const DATE_OFFSET = 7;

export async function getTransactionsOverPeriod(uid: string, range: string) {
  const user = await prisma?.user.findFirst({
    where: {
      id: uid,
    },
  });
  if (isNullOrUndefined(user)) {
    throw Error("User undefined");
  }
  //const currentDate = new Date("2022-10-29");
  return await getTransactions(user, DATE_OFFSET, range);
}

//Assume offset greater than range.
//Could be problem for longer ranges.
async function getTransactions(user: user, dateIndex: number, range: string) {
  if (range === "5d") {
    const firstDay = STOCK_DAYS[dateIndex + 5] as string;
    const beforeFirstDay = new Date(firstDay);
    beforeFirstDay.setDate(beforeFirstDay.getDate() - 1);
    const lastDay = STOCK_DAYS[dateIndex] as string;
    const afterLastDay = new Date(lastDay);
    afterLastDay.setDate(afterLastDay.getDate() + 1);
    const transactions =
      (await prisma?.transaction.findMany({
        where: {
          timestamp: {
            gte: new Date(firstDay),
            lte: new Date(lastDay),
          },
          uid: {
            equals: user.id,
          },
        },
      })) ?? [];
    return transactions;
    /*  */
  }
  return [];
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
