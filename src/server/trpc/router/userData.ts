import { z } from "zod";
import { timeRanges } from "../../common/types/dayRange";
import { getPortfolioValsOverTime } from "../../helperFuncs/userData/getPortfolioValsOverTime";
import { router, publicProcedure } from "../trpc";

/* //TODO:
figure out how to do these queries in parallel/faster in
general. These routes are pretty slow. Look into query optimizing.
*/
export const userDataRouter = router({
  getUserData: publicProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ input }) => {
      const userData = await prisma?.user.findFirst({
        where: {
          id: input.uid,
        },
      });
      return userData;
    }),
  getUserPortfolio: publicProcedure
    .input(
      z.object({
        uid: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return {
        data: await prisma?.holding.findMany({
          where: {
            uid: {
              equals: input.uid,
            },
            end_date: {
              equals: null,
            },
          },
        }),
        success: true,
      };
    }),
  getPortfolioValuesOverTime: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        timeRange: z.enum(["timeRanges", ...timeRanges]),
      })
    )
    .query(async ({ ctx, input }) => {
      //Weird problem with zod enum
      //This expects a string, but I would prefer it to be an enum
      //of possible time ranges. Not a huge deal though.
      return await getPortfolioValsOverTime(input.uid, input.timeRange);
    }),
  /*   getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }), */
});
