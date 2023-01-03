import { STOCK_DAYS } from "../../common/consts/stockTradingDates";
import getRandValueFromArray from "../../common/utils/getRandValueFromArray";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { doBuy } from "../transact/handleTransaction";

export default async function addFakeTransactions() {
  let NUMBER_FAKE_USERS = 6;
  const DAYS_OF_TRANSACTIONS = 8;
  const USER_TRANSACTIONS_PER_DAY = 5;
  const QUANTITY_TO_BUY = 5;
  const fakeUsers = await prisma?.user.findMany({
    where: {
      isTest: true,
    },
    take: NUMBER_FAKE_USERS,
  });
  if (isNullOrUndefined(fakeUsers) || fakeUsers.length < 1) {
    throw Error("Couldn't get fake users");
  }
  NUMBER_FAKE_USERS = Math.min(NUMBER_FAKE_USERS, fakeUsers.length);
  for (let dayIndex = 0; dayIndex < DAYS_OF_TRANSACTIONS; dayIndex++) {
    const dayStr = STOCK_DAYS[DAYS_OF_TRANSACTIONS - dayIndex];
    const dayDate = new Date(dayStr ?? "2022-11-07");
    const dayDateMinusOne = new Date(dayDate.getTime());
    dayDateMinusOne.setDate(dayDate.getDate() - 1);
    //TODO: Figure out how to handle selling.
    //Keep in mind, rerunning this function will cause multiple transactions for the same day.
    //Problem, cuz will mean difficulty seeing where real free balance is

    const stockPossibilitiesForThisDay = await prisma?.stockTimeVal.findMany({
      where: {
        timestamp: {
          lte: dayDate,
          gt: dayDateMinusOne,
        },
      },
    });
    if (
      isNullOrUndefined(stockPossibilitiesForThisDay) ||
      stockPossibilitiesForThisDay.length < 1
    ) {
      console.log(dayDate, dayDateMinusOne);
      throw Error("Couldn't find valid stocks for this day");
    }
    for (let userIndex = 0; userIndex < NUMBER_FAKE_USERS; userIndex++) {
      const currUser = fakeUsers[userIndex % fakeUsers.length];
      if (isNullOrUndefined(currUser)) {
        throw "Error getting user";
      }
      for (
        let transIndex = 0;
        transIndex < USER_TRANSACTIONS_PER_DAY;
        transIndex++
      ) {
        const isBuy = 0.5 < Math.random();
        if (isBuy) {
          //Remember to change back to stockPossibilitiesForThisDay

          //1: See what can be sold
          //1a: If nothing, buy instead
          //2: await doSell
          const stockPossibilitiesForThisDayNow =
            await prisma?.holding.findMany({
              where: {
                end_date: {
                  not: null,
                  gt: dayDate,
                },
                start_date: {
                  lte: dayDate,
                },
              },
            });
          console.log(stockPossibilitiesForThisDayNow);
        }

        const stockToTransact = getRandValueFromArray(
          stockPossibilitiesForThisDay
        );
        //Mod date so we can tell latest transaction
        const offsetDayDate = dayDate;
        offsetDayDate.setMilliseconds(transIndex);
        await doBuy(
          QUANTITY_TO_BUY,
          stockToTransact.stock_symbol,
          currUser,
          dayDate,
          false
        );
      }
      /*Note: we use doBuy which will look up stockTimeVal
      that we already have.
      Be faster if we had a custom function that didn't
      do this.

      */
    }
  }

  return;
}

async function addFakeBuy() {
  return;
}

async function addFakeSell() {
  return;
}
