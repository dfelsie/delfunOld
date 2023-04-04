import { z } from "zod";
import { timeRanges } from "../../common/types/dayRange";
import { getAllUsers } from "../../helperFuncs/otherUserData/getAllUsers";
import { getPortfolioValsOverTime } from "../../helperFuncs/userData/getPortfolioValsOverTime";
import { getTransactionsOverPeriod } from "../../helperFuncs/userData/getTransactionsOverPeriod";
import { router, publicProcedure } from "../trpc";

export const otherUserDataRouter = router({
  getAllUsers: publicProcedure.query(async () => {
    const userData = await getAllUsers();
    return userData;
  }),
});
