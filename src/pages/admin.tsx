import React from "react";
import { trpc } from "../utils/trpc";

export default function admin() {
  const addFakeUsers = trpc.setup.addFakeUsers.useMutation();
  const addFakeTransactions = trpc.setup.addFakeTransactions.useMutation();
  const addStockTimeVals = trpc.setup.setupCsv.useMutation();
  return (
    <div className="mx-auto flex h-full w-1/3 flex-col pt-5 text-center">
      Admin Page: Don{"'"}t leave this up!
      <button
        className="btn-primary btn mt-4"
        onClick={async () => {
          await addFakeUsers.mutateAsync();
        }}
      >
        Create fake users
      </button>
      <button
        className="btn-primary btn mt-4"
        onClick={async () => {
          await addFakeTransactions.mutateAsync();
        }}
      >
        Create fake transactions
      </button>
      <button
        className="btn-primary btn mt-4 bg-red-800"
        onClick={async () => {
          await addStockTimeVals.mutateAsync();
        }}
      >
        Add all stock vals ()
      </button>
    </div>
  );
}
