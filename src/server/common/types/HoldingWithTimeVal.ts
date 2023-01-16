import type { Holding } from "@prisma/client";

type HoldingWithTimeVal = {
  holding: Holding;
  timestamp?: Date;
  price?: number;
};

export default HoldingWithTimeVal;
