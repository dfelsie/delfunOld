import type { stockTimeVal } from "@prisma/client";
import type { User as NextUser } from "next-auth";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";

export async function handleTransaction(
  quantity: number,
  symbol: string,
  user: NextUser,
  isBuy = true,
  transactionTime?: Date
) {
  if (isBuy) {
    return await doBuy(
      quantity,
      symbol,
      user,
      transactionTime ?? new Date(),
      transactionTime === undefined
    );
  }
  return await doSell(
    quantity,
    symbol,
    user,
    transactionTime ?? new Date(),
    transactionTime === undefined
  );
}

export async function doBuy(
  quantity: number,
  symbol: string,
  user: NextUser,
  transactionTime: Date,
  isCurrent = true
) {
  try {
    const transactionTimeDayOnly = transactionTime;
    const transactionTimeDayOnlyMinusOne = new Date(transactionTime.getTime());
    transactionTimeDayOnlyMinusOne.setDate(
      transactionTimeDayOnlyMinusOne.getDate() - 1
    );

    //transactionTimeDayOnly.setHours(0, 0, 0, 0);
    let timeVal;
    if (!isCurrent) {
      timeVal = await prisma?.stockTimeVal.findFirst({
        where: {
          stock_symbol: {
            equals: symbol,
          },
          timestamp: {
            lte: transactionTimeDayOnly,
            gt: transactionTimeDayOnlyMinusOne,
          },
        },
      });
    } else {
      timeVal = await prisma?.stockTimeVal.findFirst({
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
        where: {
          stock_symbol: {
            equals: symbol,
          },
        },
      });
    }

    if (typeof timeVal === "undefined" || timeVal === null) {
      throw new Error("Couldn't find that stock at that time");
    }
    const prismaUserVal = await prisma?.user.findFirst({
      where: {
        id: {
          equals: user.id,
        },
      },
    });
    if (typeof prismaUserVal === "undefined" || prismaUserVal === null) {
      throw new Error("Couldn't find that user");
    }
    const totPrice = timeVal.price * quantity;
    if (totPrice > prismaUserVal.balance) {
      throw new Error("Balance insufficient");
    }
    /* const prismaPortfolioVal = await prisma?.portfolio.findFirst({
      where: {
        uid: {
          equals: user.id,
        },
      },
    }); */
    await addStockToPortfolio(
      user.id,
      quantity,
      timeVal,
      transactionTime,
      prismaUserVal.balance
    );
    await prisma?.user.update({
      where: {
        id: prismaUserVal.id,
      },
      data: {
        balance: prismaUserVal.balance - totPrice,
      },
    });
  } catch (e) {
    throw e;
  }
}
export async function doSell(
  quantity: number,
  symbol: string,
  user: NextUser,
  transactionTime: Date,
  isCurrent = true
) {
  const transactionTimeDayOnly = transactionTime;
  const transactionTimeDayOnlyMinusOne = new Date(transactionTime.getTime());
  transactionTimeDayOnlyMinusOne.setDate(
    transactionTimeDayOnlyMinusOne.getDate() - 1
  );

  //transactionTimeDayOnly.setHours(0, 0, 0, 0);
  let timeVal;
  if (!isCurrent) {
    timeVal = await prisma?.stockTimeVal.findFirst({
      orderBy: [
        {
          timestamp: "desc",
        },
      ],
      where: {
        stock_symbol: {
          equals: symbol,
        },
        timestamp: {
          lte: transactionTimeDayOnly,
          gt: transactionTimeDayOnlyMinusOne,
        },
      },
    });
  } else {
    timeVal = await prisma?.stockTimeVal.findFirst({
      orderBy: [
        {
          timestamp: "desc",
        },
      ],
      where: {
        stock_symbol: {
          equals: symbol,
        },
      },
    });
  }

  if (typeof timeVal === "undefined" || timeVal === null) {
    throw new Error("Couldn't find that stock at that time");
  }
  const prismaUserVal = await prisma?.user.findFirst({
    where: {
      id: {
        equals: user.id,
      },
    },
  });
  if (typeof prismaUserVal === "undefined" || prismaUserVal === null) {
    throw new Error("Couldn't find that user");
  }

  /*   const prismaPortfolioVal = await prisma?.portfolio.findFirst({
    where: {
      uid: {
        equals: user.id,
      },
    },
  });
  if (isNullOrUndefined(prismaPortfolioVal)) {
    throw new Error("No existing portfolio");
  }*/
  const currHolding = await prisma?.holding.findFirst({
    where: {
      uid: {
        equals: user.id,
      },
      stock_symbol: {
        equals: symbol,
      },
      end_date: {
        equals: null,
      },
    },
  });
  if (isNullOrUndefined(currHolding)) {
    throw new Error("No such holding owned");
  }
  if (currHolding.quantity < quantity) {
    throw new Error("Insufficient amount owned");
  }

  //Now we know we can sell
  await prisma?.holding.update({
    where: {
      id: currHolding.id,
    },
    data: {
      end_date: transactionTime,
    },
  });
  const totSaleVal = quantity * timeVal.price;
  if (currHolding.quantity !== quantity) {
    await prisma?.holding.create({
      data: {
        buy_price: currHolding.buy_price,
        quantity: currHolding.quantity - quantity,
        stock_symbol: currHolding.stock_symbol,
        free_balance: prismaUserVal.balance + totSaleVal,
        uid: user.id,
      },
    });
  }
  await prisma?.user.update({
    where: {
      id: prismaUserVal.id,
    },
    data: {
      balance: prismaUserVal.balance + totSaleVal,
    },
  });

  return await prisma?.transaction.create({
    data: {
      is_buy: false,
      uid: user.id,
      quantity: quantity,
      stock_symbol: timeVal.stock_symbol,
      unit_price: timeVal.price,
      timestamp: transactionTime,
      free_balance: prismaUserVal.balance + totSaleVal,
    },
  });
}

async function addStockToPortfolio(
  uid: string,
  quantity: number,
  timeVal: stockTimeVal,
  transactionTime: Date,
  prevBalance: number,
  portfolioIsNew = false
) {
  const totCost = timeVal.price * quantity;
  if (!portfolioIsNew) {
    const prevHolding = await prisma?.holding.findFirst({
      where: {
        uid: {
          equals: uid,
        },
        stock_symbol: {
          equals: timeVal.stock_symbol,
        },

        end_date: {
          equals: null,
        },
      },
    });
    if (!isNullOrUndefined(prevHolding)) {
      prisma?.holding.update({
        where: {
          id: prevHolding.id,
        },
        data: {
          end_date: transactionTime,
          quantity: prevHolding.quantity + quantity,
        },
      });
    } else {
      await prisma?.holding.create({
        data: {
          start_date: transactionTime,
          buy_price: timeVal.price,
          stock_symbol: timeVal.stock_symbol,
          quantity: quantity,
          uid: uid,
          free_balance: prevBalance - totCost,
        },
      });
    }
  } else {
    await prisma?.holding.create({
      data: {
        start_date: transactionTime,
        buy_price: timeVal.price,
        stock_symbol: timeVal.stock_symbol,
        quantity: quantity,
        uid: uid,
        free_balance: prevBalance - totCost,
      },
    });
  }
  return await prisma?.transaction.create({
    data: {
      is_buy: true,
      uid: uid,
      quantity: quantity,
      stock_symbol: timeVal.stock_symbol,
      unit_price: timeVal.price,
      free_balance: prevBalance - timeVal.price * quantity,
      timestamp: transactionTime,
    },
  });
}
