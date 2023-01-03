import { router } from "../trpc";
import { authRouter } from "./auth";
import { setupRouter } from "./setup";
import { transactRouter } from "./transact";
import { userDataRouter } from "./userData";
export const appRouter = router({
  auth: authRouter,
  setup: setupRouter,
  userdata: userDataRouter,
  transact: transactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
