import type { user } from "@prisma/client";
import { default as NextLink } from "next/link";

import React from "react";

type Props = {
  userList: user[];
};

export default function UserList({ userList }: Props) {
  return (
    <div className="card mx-auto flex w-2/3 flex-col">
      <ul>
        {userList.map(function (user, i) {
          return (
            <li key={`userId${user.id}`}>
              <NextLink href={`user/${user.id}`}>
                {" "}
                {`${user.name ?? "Anon"}`}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
