import HoldingWithTimeVal from "../../server/common/types/HoldingWithTimeVal";

type OneDayPortfolioVal = {
  holdings: HoldingWithTimeVal[];
  freeBalance: number;
  timestamp: Date;
  totalValue: number;
  uid?: string;
};
export default OneDayPortfolioVal;
