import { z } from "zod";
import { getCsvData } from "../../helperFuncs/setup/addAllCsvData";
import addFakeTransactions, {
  makeFakeTransactions,
} from "../../helperFuncs/setup/addFakeTransactions";
import addFakeUsers from "../../helperFuncs/setup/addFakeUsers";
import { router, publicProcedure } from "../trpc";

export const setupRouter = router({
  hello: publicProcedure.query(() => {
    console.log("Big Chungus");
  }),
  setupCsv: publicProcedure.mutation(async ({}) => {
    //This add SO MUCH data to the DB
    //I don't want to re run this by mistake.

    //return;
    try {
      await getCsvData();
      return;
    } catch (error) {
      console.log(error);
    }
  }),
  addFakeUsers: publicProcedure.mutation(async ({}) => {
    try {
      await addFakeUsers();
    } catch (error) {
      console.log(error);
    }
  }),
  addFakeTransactions: publicProcedure.mutation(async ({}) => {
    try {
      //addFakeTransactions();
      makeFakeTransactions();
    } catch (error) {
      console.log(error);
    }
  }),
  /*   getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }), */
});
