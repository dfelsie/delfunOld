import type { Holding } from "@prisma/client";
import React from "react";
import UserTransactionItem from "./UserTransactionItem";
import Link from "next/link";

type Props = {
  username: string;
  stockData?: Holding[];
};

export default function UserProfile({ stockData, username }: Props) {
  return (
    <div className="mx-2 my-[5%] flex w-full flex-grow flex-col">
      <div className="card mx-auto flex w-96 flex-grow flex-col bg-base-100 shadow-xl">
        <h4>{username}</h4>
        <h5>My Balance</h5>
        <h5>My Picks</h5>
        <Link href={"/performance"}>
          <h5>My Performanc</h5>
        </Link>
        <ul>
          {stockData &&
            stockData.slice(0, 10).map((val, i) => (
              <li key={`StockNum${i}`}>
                <UserTransactionItem holding={val} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
