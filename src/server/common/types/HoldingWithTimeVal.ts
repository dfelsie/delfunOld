import type { holding } from "@prisma/client";

type HoldingWithTimeVal = {
  holding: holding;
  timestamp?: Date;
  price?: number;
};

export default HoldingWithTimeVal;
