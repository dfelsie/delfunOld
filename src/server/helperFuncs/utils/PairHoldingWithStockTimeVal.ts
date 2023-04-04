import type { holding } from "@prisma/client";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import type HoldingWithTimeVal from "../../common/types/HoldingWithTimeVal";

//One
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

//Multiple
export async function pairHoldingsWithStockTimeVal(
  holdings: holding[],
  date: Date
) {
  let currHolding;
  let mostRecentTimeVal;
  const HoldingsWithTimeVal = [];
  for (let i = 0; i < holdings.length; i++) {
    //Shouldn't be undefined.
    currHolding = holdings[i] as holding;

    mostRecentTimeVal = await prisma?.stockTimeVal.findFirst({
      where: {
        stock_symbol: { equals: currHolding?.stock_symbol },
        timestamp: { equals: date },
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    let holdingWithTimeVal: HoldingWithTimeVal;
    if (isNullOrUndefined(mostRecentTimeVal)) {
      holdingWithTimeVal = {
        holding: currHolding,
      };
    } else {
      holdingWithTimeVal = {
        holding: currHolding,
        price: mostRecentTimeVal.price,
        timestamp: mostRecentTimeVal.timestamp,
      };
    }
    HoldingsWithTimeVal.push(holdingWithTimeVal);
  }
  return HoldingsWithTimeVal;
}
