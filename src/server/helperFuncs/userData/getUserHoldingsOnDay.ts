export async function getUserHoldingsOnDay(
  uid: string,
  date: Date,
  dateOneDayAfter: Date
) {
  return await prisma?.holding.findMany({
    where: {
      OR: [
        {
          end_date: {
            equals: null,
          },
        },
        {
          end_date: {
            gt: dateOneDayAfter,
          },
        },
      ],
      uid: uid,

      start_date: {
        lt: dateOneDayAfter,
      },
    },
  });

  return;
}
