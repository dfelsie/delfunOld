import { StockTimeVal } from "@prisma/client";

//Both of these methods are unused.

//Note: property must either be string, or have toString method.
export function groupByStringProp(
  propertyName: string,
  objAry: { [key: string]: any }[]
) {
  const groupedAry: { [key: string]: any[] } = {};
  for (let i = 0; i < objAry.length; i++) {
    const currHolding = objAry[i] as { [key: string]: any };
    let currHoldingPropVal = currHolding[propertyName];
    if (typeof currHoldingPropVal !== "string") {
      currHoldingPropVal = currHoldingPropVal.toString();
    }
    if (groupedAry[currHoldingPropVal]) {
      groupedAry[currHoldingPropVal]?.push(currHolding);
    } else {
      groupedAry[currHoldingPropVal] = [currHolding];
    }
  }
  return groupedAry;
}
export function groupTimeValByDate(objAry: StockTimeVal[]) {
  const groupedAry: { [key: string]: StockTimeVal[] } = {};
  for (let i = 0; i < objAry.length; i++) {
    const currStockTimeVal = objAry[i] as StockTimeVal;
    const currStockTimeValDateStr = currStockTimeVal.timestamp.toUTCString();
    if (groupedAry[currStockTimeValDateStr]) {
      groupedAry[currStockTimeValDateStr]?.push(currStockTimeVal);
    } else {
      groupedAry[currStockTimeValDateStr] = [currStockTimeVal];
    }
  }
  return groupedAry;
}
