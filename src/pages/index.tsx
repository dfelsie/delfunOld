import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Appshell from "../Components/Appshell/Appshell";
import Welcome from "../Components/Welcome/Welcome";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();
  if (status === "loading") {
    return <></>;
  }
  return (
    <>
      <Appshell user={sessionData?.user}>
        <Welcome />
      </Appshell>
    </>
  );
};
export default Home;
