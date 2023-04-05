import type { holding, stockTimeVal } from "@prisma/client";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import type HoldingWithTimeVal from "../../common/types/HoldingWithTimeVal";
import { HoldingWithDate } from "../userData/getUserHoldingsOverTimeRange";
import HoldingWithVal from "../../common/types/HoldingWithVal";

export type HoldingWithValAtTime = {
  holdings: HoldingWithVal[];
  time: Date;
};

//One
//Used in useless addFakeTransaction file and nowhere else
export async function pairHoldingWithStockTimeVal(
  holding: holding,
  date: Date,
  dayBeforeDate: Date
): Promise<HoldingWithTimeVal> {
  const mostRecentTimeVal = await prisma?.stockTimeVal.findFirst({
    where: {
      stock_symbol: { equals: holding.stock_symbol },
      timestamp: {
        lte: date,
        gt: dayBeforeDate,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  if (isNullOrUndefined(mostRecentTimeVal)) {
    return {
      holding: holding,
    };
  } else {
    return {
      holding: holding,
      price: mostRecentTimeVal.price,
      timestamp: mostRecentTimeVal.timestamp,
    };
  }
}

export async function pairAllHoldingsWithStockTimeVal(
  allHoldings: HoldingWithDate[]
) {
  const dateList = allHoldings.map((holdingsForDay) => holdingsForDay.date);
  const perDaySymbolList = allHoldings.map((holdingsForDay) =>
    holdingsForDay.holdings.map((holding) => holding.stock_symbol)
  );
  const promises = [];

  for (let i = 0; i < dateList.length; i++) {
    try {
      const currDate = dateList[i];
      const holdingList = perDaySymbolList[i];
      const allStockTimeVals = prisma?.stockTimeVal.findMany({
        where: {
          timestamp: {
            equals: currDate,
          },
          AND: {
            stock_symbol: {
              in: holdingList,
            },
          },
        },
      });
      promises.push(allStockTimeVals);
    } catch (e) {
      console.log(e);
      promises.push(undefined);
    }
  }
  const valAry = await Promise.all(promises);
  const retAry: HoldingWithValAtTime[] = valAry.map(function (val, valIndex) {
    const currDate = dateList[valIndex];
    if (val === undefined) {
      return { holdings: [], time: currDate as Date };
    }
    const holdingMap = new Map<string, stockTimeVal>();
    val.forEach((element) => {
      holdingMap.set(element.stock_symbol, element);
    });

    const holdingsWithVal: HoldingWithVal[] = [];
    allHoldings[valIndex]?.holdings.forEach(function (val, j) {
      const pairedTimeVal = holdingMap.get(val.stock_symbol);
      if (pairedTimeVal === undefined) {
        console.log("Weird problem pairing!");
        return;
      }
      holdingsWithVal.push({ holding: val, price: pairedTimeVal?.price });
    });
    return { holdings: holdingsWithVal, time: currDate as Date };
  });
  return retAry;
}
