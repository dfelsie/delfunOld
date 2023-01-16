import type { Holding, StockTimeVal, User } from "@prisma/client";
import { STOCK_DAYS } from "../../common/consts/stockTradingDates";
import getRandValueFromArray from "../../common/utils/getRandValueFromArray";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { doBuy, doSell } from "../transact/handleTransaction";
import { pairHoldingWithStockTimeVal } from "../utils/PairHoldingWithStockTimeVal";

//TODO: This sucks, redo
//Specifically: Either precompute, or make more human version.

//const DEFAULT_DATE_STR = "2022-11-07";

type UserHolding = {
  stock_symbol: string;
  quantity: number;
  buy_price: number;
  free_balance: number;
  start_date: Date;
  end_date?: Date;
  uid: string;
};
type UserTransaction = {
  stock_symbol: string;
  quantity: number;
  is_buy: boolean;
  timestamp: Date;
  unit_price: number;
  free_balance: number;
  uid: string;
};

type UserHoldingLog = {
  user: User;
  holdingDateStrMap: Map<string, UserHolding[]>;
};

function updateUserTransLogWithBuy(
  user: User,
  uidToTransactionLogMap: Map<string, UserHoldingLog>,
  dateStr: string,
  newHolding: UserHolding
) {
  const allUserHoldings = uidToTransactionLogMap.get(user.id);
  //User has no holdings at all.
  if (isNullOrUndefined(allUserHoldings)) {
    const newHoldingDateMap = new Map<string, UserHolding[]>();
    newHoldingDateMap.set(dateStr, [newHolding]);
    const newUserLog: UserHoldingLog = {
      holdingDateStrMap: newHoldingDateMap,
      user: user,
    };
    uidToTransactionLogMap.set(user.id, newUserLog);
    return;
  }
  const userHoldingsForDay = allUserHoldings.holdingDateStrMap.get(dateStr);

  //Create holding ary for this day
  if (isNullOrUndefined(userHoldingsForDay)) {
    const newHoldingAry = [newHolding];
    allUserHoldings.holdingDateStrMap.set(dateStr, newHoldingAry);
    return;
  }
  const oldIndex = userHoldingsForDay.findIndex(
    (val) => val.stock_symbol === newHolding.stock_symbol
  );
  if (oldIndex !== -1) {
    //userHoldingsForDay[oldIndex]!.quantity += newHolding.quantity;
    const oldHold = userHoldingsForDay[oldIndex];
    if (!isNullOrUndefined(oldHold)) {
      oldHold.end_date = newHolding.start_date;
      userHoldingsForDay[oldIndex] = oldHold;
    }
  }
  userHoldingsForDay.push(newHolding);

  uidToTransactionLogMap
    .get(user.id)
    ?.holdingDateStrMap.set(dateStr, userHoldingsForDay);
}

/*TODO: Needs work.
We want to be able to sell any possible old holding,
even from multiple days prior.
*/

//Find user's transaction log,
//Find date log,
//subtract from quantity, remove if quantity 0
function updateUserTransLogWithSell(
  user: User,
  dateStrToUserHoldingMap: Map<string, UserHolding[]>,
  oldHoldingDateStr: string,
  dateStr: string,
  newHolding: UserHolding,
  transactionIndex: number
) {
  const userHoldings = dateStrToUserHoldingMap.get(oldHoldingDateStr);
  /*   const dayOldUserHoldings = uidToTransactionLogMap
    .get(user.id)
    ?.holdingDateStrMap.get(dateStr); */
  //Shouldn't be possible
  if (isNullOrUndefined(userHoldings)) {
    console.log("userHoldings shouldn't be empty for sells");
    return;
  }
  const oldIndex = userHoldings.findIndex(
    (val) => val.stock_symbol === newHolding.stock_symbol
  );
  if (oldIndex !== -1) {
    const currHolding = userHoldings[oldIndex];
    if (currHolding === undefined) {
      throw Error("How can the oldIndex be not neg one?");
    }
    //Set end date of currHolding to now,
    //add new holding to proper date
    const endDate = new Date(dateStr);
    endDate.setMilliseconds(transactionIndex);
    currHolding.end_date = endDate;
    userHoldings[oldIndex] = currHolding;
    //If we haven't sold all of it, create a new holding
    if (currHolding.quantity > newHolding.quantity) {
      const newUserHoldings = dateStrToUserHoldingMap.get(dateStr) ?? [];
      newUserHoldings.push(newHolding);
      dateStrToUserHoldingMap.set(dateStr, newUserHoldings);
    }
    dateStrToUserHoldingMap.set(
      currHolding.start_date.toUTCString(),
      userHoldings
    );
    return;
  }
  //Code should never get here
  console.log("Error selling: EOF");
}

//Instead of all sellable stocks, maybe just return
//All the stocks we WILL actually sell w values for today
function getSellableStocksForThisUserToday(
  timeToStvMap: Map<string, StockTimeVal[]>,
  uidToTransactionLogMap: Map<string, UserHoldingLog>,
  uid: string,
  //all possible dates to sell from
  //Tod
  dateList: string[],
  todayDateStr: string,
  numSellableStocksToGet: number
) {
  return;
  /*   const allAvailableHoldings = [] as UserHolding[];
  const holdingPriceMap = new Map<UserHolding, StockTimeVal>();

  for (let i = 0; i < dateList.length; i++) {
    const val = uidToTransactionLogMap
      .get(uid)
      ?.holdingDateStrMap.get(dateList[i] ?? "");
    const pricesToday = timeToStvMap.get(todayDateStr);
    if (isNullOrUndefined(pricesToday)) {
      continue;
      //return new Map<UserHolding, StockTimeVal>();
    }

    if (isNullOrUndefined(val)) {
      continue;
      //return new Map<UserHolding, StockTimeVal>();
    }
    allAvailableHoldings.push(...val);
  }

  for (let i = 0; i < dateList.length; i++) {
    const holdingsToday=allAvailableHoldings.filter((val)=>val.start_date.toUTCString()===dateList[i])
    for(let j=0; j<holdingsToday.length; j++){
      const priceFor = pricesToday.find(
        (stv) => stv.stock_symbol === val[i]?.stock_symbol
      );
      if (priceFor === undefined) {
        continue;
      }
      holdingPriceMap.set(val[i] as UserHolding, priceFor);

    }
  }

  return holdingPriceMap; */
}

export function getSellableStock(
  dateList: string[],
  uidToHoldingMap: Map<string, UserHoldingLog>,
  user: User,
  timeToStvMap: Map<string, StockTimeVal[]>
) {
  const currUserHoldings = uidToHoldingMap.get(user.id);
  //Can happen, esp on first day.
  if (isNullOrUndefined(currUserHoldings)) {
    return null;
    //throw Error("Somehow, there were no holdings");
  }
  const prevDayHoldings = [] as UserHolding[];
  for (let i = 0; i < dateList.length; i++) {
    const nonEndedHoldings = currUserHoldings.holdingDateStrMap
      .get(dateList[i] as string)
      ?.filter((val) => val.end_date === undefined);
    prevDayHoldings.push(...(nonEndedHoldings ?? []));
  }

  //Is this the best way?
  const allHoldings = [...currUserHoldings.holdingDateStrMap.values()]
    .flat()
    .filter((holding) => holding.end_date === undefined);
  //No possible sells
  if (allHoldings.length < 1) {
    return null;
  }
  const holdingToGet = getRandValueFromArray(prevDayHoldings);
  const currDate = holdingToGet.start_date;
  const rightDayStvMap = timeToStvMap.get(currDate.toUTCString());
  if (isNullOrUndefined(rightDayStvMap)) {
    throw Error("Shouldn't be possible: getSellableStock");
  }
  const correctStv = rightDayStvMap.find(
    (val) => val.stock_symbol === holdingToGet.stock_symbol
  );
  if (isNullOrUndefined(correctStv)) {
    throw Error("Couldn't find right stv");
  }

  return { correctStv, holdingToGet };
}

//Now we'd like to go through each user, and pick possibilities to buy and sell each day.
//Need user transaction type, a log of each day's purchases.
//We want to insert this into the db at the end.
//We create a map of uid to (date to holding array map) and (User so we have freebalance),
//as well as a big array of all transactions.
//We use prev days holding array to pick current day transactions, then gather
//all transactions and insert them at the end.
export async function createUserTransactionLogs(
  timeToStvMap: Map<string, StockTimeVal[]>,
  userList: User[],
  dateList: string[],
  numTransactions: number,
  numToTransact: number
) {
  const uidToTransactionLogMap = new Map<string, UserHoldingLog>();
  const transactionAry: UserTransaction[] = [];
  for (let i = 0; i < dateList.length; i++) {
    const currDate = dateList[i] as string;
    const buyableStocksToday = timeToStvMap.get(currDate);
    const listOfDatesIncludingToday = dateList.slice(0, i + 1);
    if (
      isNullOrUndefined(buyableStocksToday) ||
      buyableStocksToday.length < 1
    ) {
      console.log("No buyable stocks today");
      continue;
    }
    const prevDate = i <= 0 ? null : (dateList[i - 1] as string);
    for (let j = 0; j < userList.length; j++) {
      const currUser = userList[j] as User;
      getSellableStocksForThisUserToday(
        timeToStvMap,
        uidToTransactionLogMap,
        currUser.id,
        listOfDatesIncludingToday,
        currDate,
        numTransactions
      );
      for (let n = 0; n < numTransactions; n++) {
        const buyableStocksForThisUserToday = buyableStocksToday.filter(
          (val) => val.price * numToTransact <= currUser.balance
        );
        const stockToSell = getSellableStock(
          listOfDatesIncludingToday,
          uidToTransactionLogMap,
          currUser,
          timeToStvMap
        );
        if (Math.random() > 0.5 && !isNullOrUndefined(stockToSell)) {
          //Do a sell
          const { correctStv, holdingToGet } = stockToSell;

          currUser.balance += numToTransact * correctStv.price;
          const currUserHoldings = uidToTransactionLogMap.get(currUser.id);
          if (isNullOrUndefined(currUserHoldings)) {
            throw "Couldn't sell: currUserHoldings undef";
          }
          const updateHoldingDate = new Date(currDate);
          updateHoldingDate.setMilliseconds(n);
          updateUserTransLogWithSell(
            currUser,
            currUserHoldings.holdingDateStrMap,
            holdingToGet.start_date.toUTCString(),
            currDate,
            {
              quantity: numToTransact,
              stock_symbol: correctStv.stock_symbol,
              buy_price: correctStv.price,
              uid: currUser.id,
              free_balance: currUser.balance,
              start_date: new Date(currDate),
            },
            n
          );
          transactionAry.push({
            free_balance: currUser.balance,
            is_buy: false,
            quantity: numToTransact,
            stock_symbol: correctStv.stock_symbol,
            timestamp: new Date(currDate),
            uid: currUser.id,
            unit_price: correctStv.price,
          });
        } else if (!(buyableStocksForThisUserToday.length < 1)) {
          //Do a buy
          const stockToBuy = getRandValueFromArray(
            buyableStocksForThisUserToday
          );
          currUser.balance -= numToTransact * stockToBuy.price;
          const updateHoldingDate = new Date(currDate);
          updateHoldingDate.setMilliseconds(n);

          updateUserTransLogWithBuy(
            currUser,
            uidToTransactionLogMap,
            currDate,
            {
              quantity: numToTransact,
              stock_symbol: stockToBuy.stock_symbol,
              buy_price: stockToBuy.price,
              free_balance: currUser.balance,
              uid: currUser.id,
              start_date: updateHoldingDate,
            }
          );
          transactionAry.push({
            free_balance: currUser.balance,
            is_buy: true,
            quantity: numToTransact,
            stock_symbol: stockToBuy.stock_symbol,
            timestamp: new Date(currDate),
            uid: currUser.id,
            unit_price: stockToBuy.price,
          });
        } else {
          console.log(currDate, currUser.balance, " Nothing to be done!");
        }
      }
    }
  }
  //Go through transactions and holdings and add to DB.

  //Holdings
  //const holdingLogs = [...uidToTransactionLogMap.values()];
  const allHoldingsAry = [] as UserHolding[];
  for (let i = 0; i < userList.length; i++) {
    const currUser = userList[i] as User;
    //const currLogs = holdingLogs[i]?.holdingDateStrMap.get(dateList[i]);
    const userLogs = uidToTransactionLogMap.get(currUser.id) as UserHoldingLog;

    const currHoldings = [
      ...(userLogs.holdingDateStrMap.values() ?? []),
    ].flat();
    allHoldingsAry.push(...currHoldings);
    /*     for (let j = 0; j < currHoldings.length; j++) {
      const bingus = currHoldings[j]?.[1] as UserHolding[];
      allHoldingsAry.push(...bingus);
    } */
  }
  await prisma?.holding.createMany({
    data: allHoldingsAry,
  });
  await prisma?.transaction.createMany({
    data: transactionAry,
  });
  return;
}

//Only works with new users
export async function makeFakeTransactions() {
  //
  let NUMBER_FAKE_USERS = 6;
  const DAYS_OF_TRANSACTIONS = 8;
  const USER_TRANSACTIONS_PER_DAY = 5;
  const QUANTITY_TO_BUY = 5;
  const DAY_OFFSET = 3;
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
  //Reversed so earlier days are first in array
  const dateList = STOCK_DAYS.slice(
    DAY_OFFSET,
    DAY_OFFSET + DAYS_OF_TRANSACTIONS
  )

    .map((dateStr) => new Date(dateStr).toUTCString())
    .reverse();
  const allBuyPossibilities = await prisma?.stockTimeVal.findMany({
    where: {
      timestamp: {
        gte: new Date(dateList[0] as string),
        lte: new Date(dateList[dateList.length - 1] as string),
      },
    },
  });
  if (isNullOrUndefined(allBuyPossibilities)) {
    throw Error("No Buy Possibilities");
  }
  const dateTimeValMap = new Map<string, StockTimeVal[]>();
  //Now with all possibilites, we'd like to group by day.
  for (let i = 0; i < allBuyPossibilities.length; i++) {
    const currVal = allBuyPossibilities[i] as StockTimeVal;
    if (dateTimeValMap.has(currVal.timestamp.toUTCString())) {
      const tempAry = dateTimeValMap.get(
        currVal.timestamp.toUTCString()
      ) as StockTimeVal[];
      tempAry.push(currVal);
      dateTimeValMap.set(currVal.timestamp.toUTCString(), [...tempAry]);
    } else {
      dateTimeValMap.set(currVal.timestamp.toUTCString(), [currVal]);
    }
  }
  //const groupedVals = groupTimeValByDate(allBuyPossibilities);
  //Now we'd like to go through each user, and pick possibilities to buy and sell each day.
  //Need user transaction type, a log of each day's purchases.
  //We want to insert this into the db at the end.
  //We create a map of uid to (date to holding array map) and (User so we have freebalance),
  //as well as a big array of all transactions.
  //We use prev days holding array to pick current day transactions, then gather
  //all transactions and insert them at the end.
  //const transactionAry: Transaction[] = [];
  await createUserTransactionLogs(
    dateTimeValMap,
    fakeUsers,
    dateList,
    USER_TRANSACTIONS_PER_DAY,
    QUANTITY_TO_BUY
  );
  return;
}

function groupSalePossibilitiesByUser(holdingList: Holding[]) {
  const holdingsGroupedByIds: { [key: string]: Holding[] } = {};
  for (let i = 0; i < holdingList.length; i++) {
    const currHolding = holdingList[i] as Holding;
    if (holdingsGroupedByIds[currHolding.uid]) {
      holdingsGroupedByIds[currHolding.uid]?.push(currHolding);
    } else {
      holdingsGroupedByIds[currHolding.uid] = [currHolding];
    }
  }
  return holdingsGroupedByIds;
}

export default async function addFakeTransactions() {
  let NUMBER_FAKE_USERS = 6;
  const DAYS_OF_TRANSACTIONS = 8;
  const USER_TRANSACTIONS_PER_DAY = 5;
  const QUANTITY_TO_BUY = 5;
  const DAY_OFFSET = 3;
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
    const dayStr = STOCK_DAYS[DAY_OFFSET + (DAYS_OF_TRANSACTIONS - dayIndex)];
    const dayDate = new Date(dayStr as string);
    const dayBeforeDayDate = new Date(
      STOCK_DAYS[DAY_OFFSET + (DAYS_OF_TRANSACTIONS - dayIndex + 1)] as string
    );
    //TODO: Figure out how to handle selling.
    //Keep in mind, rerunning this function will cause multiple transactions for the same day.
    //Problem, cuz will mean difficulty seeing where real free balance is
    const fakeUserIds = fakeUsers.map((user) => user.id);

    const stockPossibilitiesForThisDay = await prisma?.stockTimeVal.findMany({
      where: {
        timestamp: {
          lte: dayDate,
          gt: dayBeforeDayDate,
        },
      },
    });

    if (
      isNullOrUndefined(stockPossibilitiesForThisDay) ||
      stockPossibilitiesForThisDay.length < 1
    ) {
      console.log(dayDate, dayBeforeDayDate);
      throw Error("Couldn't find valid stocks for this day");
    }
    const salePossibilitesForThisDay = await prisma?.holding.findMany({
      where: {
        start_date: {
          lte: dayDate,
          gt: dayBeforeDayDate,
        },
        uid: {
          in: fakeUserIds,
        },
      },
    });
    let salePossibilitesForThisDayByUid;
    if (isNullOrUndefined(salePossibilitesForThisDay)) {
      salePossibilitesForThisDayByUid = null;
    } else {
      salePossibilitesForThisDayByUid = groupSalePossibilitiesByUser(
        salePossibilitesForThisDay
      );
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
        //Mod date so we can tell latest transaction
        //Do we really need this?
        const offsetDayDate = dayDate;
        offsetDayDate.setMilliseconds(transIndex);
        //First part of condition checks if there are any possible stocks to sell
        //Second checks if there are any for the current user (is there a conditional index we can use?)
        //Third is just a random roll to see if we're selling or buying.
        if (
          !isNullOrUndefined(salePossibilitesForThisDayByUid) &&
          !isNullOrUndefined(salePossibilitesForThisDayByUid[currUser.id]) &&
          0.5 < Math.random()
        ) {
          //Cast is to set it as not undefined, since the if cond above already checks that
          const salePossibilitesForThisUser = salePossibilitesForThisDayByUid[
            currUser.id
          ] as Holding[];
          await addFakeSell(
            QUANTITY_TO_BUY,
            salePossibilitesForThisUser,
            currUser,
            offsetDayDate,
            dayBeforeDayDate
          );
          //In above, we don't have stockTimeVal yet.
          //If we want the same optimization as below, we may need to get that.
        }
        /*Note: in below func we use doBuy which will look up stockTimeVal
      that we already have.
      Be faster if we had a custom function that didn't
      do this.
      */
        await addFakeBuy(
          QUANTITY_TO_BUY,
          stockPossibilitiesForThisDay,
          currUser,
          offsetDayDate
        );
      }
    }
  }

  return;
}

async function addFakeBuy(
  quantity: number,
  stockPossibilities: StockTimeVal[],
  currUser: User,
  date: Date
) {
  const stockToTransact = getRandValueFromArray(stockPossibilities);

  await doBuy(quantity, stockToTransact.stock_symbol, currUser, date, false);
  currUser.balance -= stockToTransact.price * quantity;

  return;
}

async function addFakeSell(
  quantity: number,
  stockPossibilities: Holding[],
  currUser: User,
  date: Date,
  oneDayBeforeDate: Date
) {
  const holdingToTransact = getRandValueFromArray(stockPossibilities);
  const holdingWithTimeVal = await pairHoldingWithStockTimeVal(
    holdingToTransact,
    date,
    oneDayBeforeDate
  );
  if (isNullOrUndefined(holdingWithTimeVal.price)) {
    console.log("Error getting stock sale value!");
    return;
  }
  await doSell(
    quantity,
    holdingWithTimeVal.holding.stock_symbol,
    currUser,
    date,
    false
  );
  currUser.balance += holdingWithTimeVal.price * quantity;

  return;
}
