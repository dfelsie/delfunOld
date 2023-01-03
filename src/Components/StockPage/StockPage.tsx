import React from "react";

type Props = {
  symbol: string;
};

export default function StockPage({ symbol }: Props) {
  return (
    <div>
      <h4>{symbol}</h4>
      <label
        className="btn"
        onClick={async () => {
          /*                 const res = await fetch(BACKEND_ROUTE + "logout", {
                  ...FETCH_BODY,
                }); */
        }}
      >
        Buy/Sell
      </label>
    </div>
  );
}
