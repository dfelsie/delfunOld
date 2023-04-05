import type { holding } from "@prisma/client";

type HoldingWithVal = {
  holding: holding;
  price?: number;
};

export default HoldingWithVal;
