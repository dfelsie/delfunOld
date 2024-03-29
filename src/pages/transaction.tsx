import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Appshell from "../Components/Appshell/Appshell";
import Transaction from "../Components/Transaction/Transaction";
import isNullOrUndefined from "../server/common/utils/isNullOrUndefined";

const TransactionPage: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const doTransaction = trpc.transact.buyOrSell.useMutation();

  if (status === "loading") {
    return <></>;
  }
  const uid = sessionData?.user?.id;
  if (isNullOrUndefined(uid)) {
    return <></>;
  }
  const { data: portfolioData, isFetched } =
    trpc.userdata.getUserPortfolio.useQuery({
      uid: uid,
    });
  if (isFetched === false) {
    return <></>;
  }
  console.log(portfolioData);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Appshell user={sessionData?.user}>
        <Transaction doTransaction={doTransaction} />
      </Appshell>
    </>
  );
};
export default TransactionPage;
