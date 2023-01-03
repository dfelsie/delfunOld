import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { handleTransaction } from "../../helperFuncs/transact/handleTransaction";
export const transactRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  buyOrSell: protectedProcedure
    .input(
      z.object({
        quantity: z.number(),
        symbol: z.string(),
        isBuy: z.boolean(),
        transactionTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { quantity, symbol, isBuy, transactionTime } = input;
      try {
        return await handleTransaction(
          quantity,
          symbol,
          ctx.session.user,
          isBuy,
          transactionTime ?? undefined
        );
      } catch (error) {
        return { success: false, msg: error };
      }
    }),
});
