import { router } from "../trpc";
import { authRouter } from "./auth";
import { otherUserDataRouter } from "./otherUserData";
import { setupRouter } from "./setup";
import { transactRouter } from "./transact";
import { userDataRouter } from "./userData";
export const appRouter = router({
  auth: authRouter,
  setup: setupRouter,
  userdata: userDataRouter,
  transact: transactRouter,
  otheruserdata: otherUserDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
