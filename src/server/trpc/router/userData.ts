import { z } from "zod";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { router, publicProcedure } from "../trpc";

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
      const userPort = await prisma?.portfolio.findFirst({
        where: {
          uid: {
            equals: input.uid,
          },
        },
      });
      if (isNullOrUndefined(userPort)) {
        return { success: true, data: [] };
      }
      return {
        data: await prisma?.holding.findMany({
          where: {
            portfolio_id: {
              equals: userPort.id,
            },
            end_date: {
              equals: null,
            },
          },
        }),
        success: true,
      };
    }),
  /*   getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }), */
});
