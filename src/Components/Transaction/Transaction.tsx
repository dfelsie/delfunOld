import React, { useState } from "react";
import TransactionValDisplay from "./TransactionValDisplay";

type Props = {
  doTransaction: any;
};
export default function Transaction({ doTransaction }: Props) {
  const [isBuy, setIsBuy] = useState(true);
  const [transactionQuantity, setTransactionQuantity] = useState(0);
  const [stockName, setStockName] = useState("");
  return (
    <div className="my-[2%] flex flex-grow flex-col">
      <div className="card w-96 flex-grow-[2] bg-base-200 p-4 shadow-xl">
        {/* <h4 className="text-center text-4xl font-bold">Blorbo</h4> */}
        <input
          type={"text"}
          onChange={(e) => {
            setStockName(e.target.value);
          }}
          className="input-bordered input m-auto w-2/3"
        />
        <div>Buy</div>
        <p className="text-2xl font-bold">$83.21</p>
        <div className="m-auto flex w-1/2 justify-between">
          <div
            onClick={() => {
              setIsBuy(true);
            }}
            className={`btn mx-2 ${
              isBuy ? "bg-green-500 hover:bg-green-400" : "hover:bg-slate-500"
            }`}
          >
            Buy
          </div>
          <div
            onClick={() => {
              setIsBuy(false);
            }}
            className={`btn mx-2 ${
              !isBuy ? "bg-green-500 hover:bg-green-400" : "hover:bg-slate-500"
            }`}
          >
            Sell
          </div>
        </div>
        <input
          type={"number"}
          onChange={(e) => {
            setTransactionQuantity(parseInt(e.target.value));
          }}
          className="input-bordered input m-auto w-2/3"
        />
      </div>
      <div className="flex-grow"></div>
      <div className="card w-96 flex-grow-[1.5] bg-base-200 px-4 pt-2 shadow-xl">
        <p className="text-lg font-semibold">
          Currently own <br /> 100 units
        </p>
        <div className="mx-auto mt-8 flex">
          <div className="flex flex-col">
            <TransactionValDisplay headText={"Amount Owned"} bodyVal={0} />
            <TransactionValDisplay headText={"Amount Owned"} bodyVal={0} />
            <TransactionValDisplay headText={"Amount Owned"} bodyVal={0} />
          </div>
          <div className="px-4"></div>
          <div className="flex  flex-col">
            <TransactionValDisplay headText={"Amount Owned"} bodyVal={0} />
            <TransactionValDisplay headText={"Amount Owned"} bodyVal={0} />
            <TransactionValDisplay headText={"Amount Owned"} bodyVal={0} />
          </div>
          <div
            className="btn mx-2"
            onClick={async () => {
              doTransaction.mutate({
                quantity: transactionQuantity,
                symbol: stockName,
                isBuy: isBuy,
              });
              /* const res = await postTransaction(
                stockName.toUpperCase(),
                transactionQuantity,
                isBuy
              );
               */
            }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}
