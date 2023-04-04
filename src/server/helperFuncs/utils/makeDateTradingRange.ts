import { STOCK_DAYS } from "../../common/consts/stockTradingDates";

//expand to handle months, currently only does 5 days

//first item in STOCK_DAYS is most recent date
export default function makeDateTradingRange(
  startDateIndex: number,
  range: string
) {
  if (range == "5d") {
    return STOCK_DAYS.slice(startDateIndex - 4, startDateIndex + 1).map(
      (dateStr) => new Date(dateStr)
    );
  } else {
    return STOCK_DAYS.slice(startDateIndex - 4, startDateIndex + 1).map(
      (dateStr) => new Date(dateStr)
    );
  }
}
