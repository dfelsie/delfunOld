export const PKACEHIKDER = 12;
/* import type { Holding, Transaction, User } from "@prisma/client";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { getUserHoldingsFromRange } from "./getUserHoldingsOnDay";
import { STOCK_DAYS } from "../../common/consts/stockTradingDates";
import type OneDayPortfolioVal from "../../../Core/Types/OneDayPortfolioVal";
import { pairHoldingsWithStockTimeVal } from "../utils/PairHoldingWithStockTimeVal";
import type HoldingWithTimeVal from "../../common/types/HoldingWithTimeVal";

//If we can't find early transaction.
//May have to fix this.

const DEFAULT_BALANCE = 1_000_000;

const DATE_OFFSET = 4;

export async function getPortfolioValsOverPeriod(uid: string, range: string) {
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

function getAllHeldDates(
  holdingStartDate: Date,
  holdingEndDate: Date | null,
  dateList: string[]
) {
  const heldDates = [];
  for (let i = 0; i < dateList.length; i++) {
    const currDate = new Date(dateList[i] as string);
    if (
      currDate >= holdingStartDate &&
      (holdingEndDate === null ||
        new Date(currDate.getDate() + 1) < holdingEndDate)
    ) {
      heldDates.push(currDate.toUTCString());
    }
  }
  return heldDates;
}

async function getPortfolioValAtDate(
  user: User,
  dateIndex: number,
  range: string
) {
  if (range === "5d") {
    const dateList = STOCK_DAYS.slice(dateIndex, dateIndex + 5).reverse();
    const firstDay = dateList[0] as string;
    const beforeFirstDay = new Date(firstDay);
    beforeFirstDay.setDate(beforeFirstDay.getDate() - 1);
    const lastDay = dateList[dateList.length - 1] as string;
    const afterLastDay = new Date(lastDay);
    const finalMap = [[]] as HoldingWithTimeVal[][];
    afterLastDay.setDate(afterLastDay.getDate() + 1);
    const holdingsForRange = await getUserHoldingsFromRange(
      user.id,
      new Date(firstDay),
      new Date(lastDay)
    );
    if (isNullOrUndefined(holdingsForRange)) {
      return [];
    }
    //Group holdings into map
    //how do we handle getting prices?
    //should be fine to just get for each specific day,
    //use promise allsettled
    const dateStrMap = new Map<string, Holding[]>();
    for (let i = 0; i < holdingsForRange.length; i++) {
      const currHolding = holdingsForRange[i];
      if (isNullOrUndefined(currHolding)) {
        continue;
      }
      const heldDates = getAllHeldDates(
        new Date(currHolding.start_date),
        currHolding.end_date !== null
          ? new Date(currHolding.end_date.getTime() + 1)
          : null,
        dateList
      );
      for (let j = 0; j < heldDates.length; j++) {
        const holdingDateStr = heldDates[j] as string;
        let holdingAry = dateStrMap.get(holdingDateStr);
        if (isNullOrUndefined(holdingAry)) {
          holdingAry = [currHolding];
        } else {
          holdingAry.push(currHolding);
        }
        dateStrMap.set(holdingDateStr, holdingAry);
      }
    }
    //need last transactions
    const lastTransactionAry = [] as (Transaction | null)[];
    console.log(dateStrMap);
    for (let i = 0; i < dateList.length; i++) {
      const currDateStr = new Date(dateList[i] as string);
      const dateAfterCurr = new Date(new Date(currDateStr).getTime() + 1);
      const lastTransactionOfDay = await prisma?.transaction.findFirst({
        where: {
          uid: {
            equals: user.id,
          },
          timestamp: {
            lt: dateAfterCurr,
          },
        },
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
      });
      const holdingsForDay = dateStrMap.get(currDateStr.toUTCString());
      if (isNullOrUndefined(holdingsForDay)) {
        continue;
      }
      if (isNullOrUndefined(lastTransactionOfDay)) {
        lastTransactionAry.push(null);
      } else {
        lastTransactionAry.push(lastTransactionOfDay);
      }
      //get prices

      const holdingStrsForDay = holdingsForDay.map((val) => val.stock_symbol);
      const pricesForThisDay = await prisma?.stockTimeVal.findMany({
        where: {
          timestamp: {
            gte: new Date(currDateStr),
            lt: dateAfterCurr,
          },
          stock_symbol: {
            in: holdingStrsForDay,
          },
        },
      });
      if (isNullOrUndefined(pricesForThisDay)) {
        console.log("Error getting stvs");
        finalMap.push([]);
        continue;
      }
      const paired = await pairHoldingsWithStockTimeVal(
        holdingsForDay,
        new Date(currDateStr)
      );
      finalMap.push(paired);
      //Combine prices with holdings
    }
    const bing = finalMap.flatMap(function (val, index) {
      const totBalance = val.reduce(
        (prevVal, curVal) =>
          (prevVal += curVal.holding.quantity * (curVal?.price ?? 0)),
        0
      );
      const thisDayPortfolioVal: OneDayPortfolioVal = {
        freeBalance: lastTransactionAry[index]?.free_balance ?? 1_000_000,
        holdings: val,
        timestamp: new Date(dateList[index] as string),
        totalValue: totBalance,
        uid: user.id,
      };
      return thisDayPortfolioVal;
    });
    return bing;

    for (let i = 0; i < 5; i++) {
      /* //as string is needed in case out of bounds, need to fix.
      const currDate = new Date(STOCK_DAYS[dateIndex - i] as string);
      const oneDayAfterCurrDate = new Date(
        STOCK_DAYS[dateIndex - i - 1] as string
      );
      console.log(currDate);


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
      //Currently have value of holdings at buy time.
      //Need to join with stock time vals to get current val



      const thisDayPortfolioVal: OneDayPortfolioVal = {
        freeBalance: freeBalance,
        holdings: pairedHoldings,
        timestamp: currDate,
        totalValue: totalValue,
        uid: user.id,
      };

      /*       for(let j=0; j<holdingsForDay)
      const thisDayPortfolioVal:OneDayPortfolioVal=({

      });
      holdingList.push(thisDayPortfolioVal);
    }
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
