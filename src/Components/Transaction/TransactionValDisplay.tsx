import React from "react";

type Props = {
  headText: string;
  bodyVal: number;
};

export default function TransactionValDisplay({ bodyVal, headText }: Props) {
  return (
    <div className="flex flex-col">
      <h6>{headText}</h6>
      <p>{bodyVal.toString()}</p>
    </div>
  );
}
