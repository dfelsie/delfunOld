import type { Holding } from "@prisma/client";
import React from "react";

type Props = {
  holding: Holding;
};

export default function UserTransactionItem({ holding }: Props) {
  return (
    <div>
      <p>{`${holding.stock_symbol} ${holding.buy_price}, ${holding.quantity}`}</p>
    </div>
  );
}
