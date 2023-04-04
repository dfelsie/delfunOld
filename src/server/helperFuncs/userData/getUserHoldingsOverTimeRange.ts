import type { holding } from "@prisma/client";

type HoldingWithDate = {
  date: Date;
  holdings: holding[];
};

export async function getUserHoldingsOverTime(uid: string, dates: Date[]) {
  dates.sort((a, b) => a.getTime() - b.getTime());
  const holdings = await prisma?.holding.findMany({
    //by: ["uid", "start_date"],
    where: {
      uid: uid,
      start_date: {
        lte: dates[dates.length - 1],
      },
      OR: [
        {
          end_date: {
            equals: null,
          },
        },
        {
          end_date: {
            gt: dates[0],
          },
        },
      ],
    },
    orderBy: {
      start_date: "asc",
    },
  });

  if (holdings === undefined) {
    return [];
  }

  const holdingsWithDates: HoldingWithDate[] = [];

  for (const date of dates) {
    const holdingsForDate = holdings.filter((holding) => {
      return (
        holding.start_date <= date &&
        (holding.end_date === null || holding.end_date > date)
      );
    });

    holdingsWithDates.push({
      date,
      holdings: holdingsForDate,
    });
  }

  return holdingsWithDates;
}
