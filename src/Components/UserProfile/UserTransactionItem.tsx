import type { holding } from "@prisma/client";
import React from "react";

type Props = {
  holding: holding;
};

export default function UserTransactionItem({ holding }: Props) {
  return (
    <div>
      <p>{`${holding.stock_symbol} ${holding.buy_price}, ${holding.quantity}`}</p>
    </div>
  );
}
