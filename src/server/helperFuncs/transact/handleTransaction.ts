import type { Portfolio, StockTimeVal } from "@prisma/client";
import type { User } from "next-auth";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";

export async function handleTransaction(
  quantity: number,
  symbol: string,
  user: User,
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
  user: User,
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
    const prismaPortfolioVal = await prisma?.portfolio.findFirst({
      where: {
        uid: {
          equals: user.id,
        },
      },
    });
    if (
      typeof prismaPortfolioVal === "undefined" ||
      prismaPortfolioVal === null
    ) {
      const newPort = await prisma?.portfolio.create({
        data: {
          uid: user.id,
        },
      });
      if (typeof newPort === "undefined") {
        throw new Error("Couldn't create portfolio");
      }
      await prisma?.user.update({
        where: {
          id: prismaUserVal.id,
        },
        data: {
          balance: prismaUserVal.balance - totPrice,
        },
      });
      return await addStockToPortfolio(
        newPort,
        quantity,
        timeVal,
        transactionTime,
        prismaUserVal.balance,
        true
      );
    }
    await prisma?.user.update({
      where: {
        id: prismaUserVal.id,
      },
      data: {
        balance: prismaUserVal.balance - totPrice,
      },
    });
    return await addStockToPortfolio(
      prismaPortfolioVal,
      quantity,
      timeVal,
      transactionTime,
      prismaUserVal.balance
    );
  } catch (e) {
    throw e;
  }
}
export async function doSell(
  quantity: number,
  symbol: string,
  user: User,
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

  const prismaPortfolioVal = await prisma?.portfolio.findFirst({
    where: {
      uid: {
        equals: user.id,
      },
    },
  });
  if (isNullOrUndefined(prismaPortfolioVal)) {
    throw new Error("No existing portfolio");
  }
  const currHolding = await prisma?.holding.findFirst({
    where: {
      portfolio_id: {
        equals: prismaPortfolioVal.id,
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
  if (currHolding.quantity !== quantity) {
    await prisma?.holding.create({
      data: {
        buy_price: currHolding.buy_price,
        quantity: currHolding.quantity - quantity,
        stock_symbol: currHolding.stock_symbol,
        portfolio_id: currHolding.portfolio_id,
      },
    });
  }
  const totSaleVal = quantity * timeVal.price;
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
      is_buy: true,
      portfolio_id: currHolding.portfolio_id,
      quantity: quantity,
      stock_symbol: timeVal.stock_symbol,
      unit_price: timeVal.price,
      timestamp: transactionTime,
      free_balance: prismaUserVal.balance + totSaleVal,
    },
  });
}

async function addStockToPortfolio(
  portfolio: Portfolio,
  quantity: number,
  timeVal: StockTimeVal,
  transactionTime: Date,
  prevBalance: number,
  portfolioIsNew = false
) {
  if (!portfolioIsNew) {
    const prevHolding = await prisma?.holding.findFirst({
      where: {
        portfolio_id: {
          equals: portfolio.id,
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
          portfolio_id: portfolio.id,
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
        portfolio_id: portfolio.id,
      },
    });
  }
  return await prisma?.transaction.create({
    data: {
      is_buy: true,
      portfolio_id: portfolio.id,
      quantity: quantity,
      stock_symbol: timeVal.stock_symbol,
      unit_price: timeVal.price,
      free_balance: prevBalance + timeVal.price * quantity,
      timestamp: transactionTime,
    },
  });
}
