/* type HoldingWithDate = {
  uid: string;
  start_date: Date;
  holding: Holding[];
};

export async function getUserHoldingsOverTime(uid: string, dates: Date[]) {
  const holdings = await prisma.holding.groupBy({
    by: ["uid", "start_date"],
    where: {
      uid: uid,
      start_date: {
        lte: new Date(Math.max(...dates)),
      },
      OR: [
        {
          end_date: {
            equals: null,
          },
        },
        {
          end_date: {
            gt: new Date(Math.min(...dates)),
          },
        },
      ],
    },
    orderBy: {
      uid: "asc",
      start_date: "asc",
    },
  });

  const holdingsWithDates: HoldingWithDate[] = [];

  for (const date of dates) {
    const holdingsForDate: Holding[] = [];

    for (const holding of holdings) {
      if (holding.uid === uid && holding.start_date <= date) {
        holdingsForDate.push(holding);
      }
    }

    holdingsWithDates.push({
      uid: uid,
      start_date: date,
      holding: holdingsForDate,
    });
  }

  return holdingsWithDates;
}
 */
