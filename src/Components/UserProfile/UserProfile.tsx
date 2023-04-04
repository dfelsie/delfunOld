import type { holding, user } from "@prisma/client";
import React from "react";
import UserTransactionItem from "./UserTransactionItem";
import Link from "next/link";

type Props = {
  user: user;
  stockData?: holding[];
};

export default function UserProfile({ stockData, user }: Props) {
  return (
    <div className="mx-2 my-[5%] flex w-full flex-grow flex-col">
      <div className="card mx-auto flex w-96 flex-grow flex-col bg-base-100 shadow-xl">
        <h4>{user.name}</h4>
        <h5>My Balance</h5>
        <h5>My Picks</h5>
        <Link href={`/user/${user.id}/performance`}>
          <h5>My Performance</h5>
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
