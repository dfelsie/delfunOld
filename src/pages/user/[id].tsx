import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Appshell from "../../Components/Appshell/Appshell";
import UserProfile from "../../Components/UserProfile/UserProfile";
import StockData from "../../Core/Types/StockData";
import isNullOrUndefined from "../../server/common/utils/isNullOrUndefined";
import { trpc } from "../../utils/trpc";
export default function User() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const uid = router.query.id;
  const {
    data: portfolioDataRes,
    isLoading: portfolioIsLoading,
    isError: portfolioIsError,
  } = trpc.userdata.getUserPortfolio.useQuery({
    uid: (uid as string) ?? "",
  });
  const {
    data: userDataRes,
    isLoading: userIsLoading,
    isError: userIsError,
  } = trpc.userdata.getUserData.useQuery({
    uid: (uid as string) ?? "",
  });
  if (uid === undefined) {
    return <></>;
  }
  if (
    status === "loading" ||
    portfolioIsLoading ||
    portfolioIsError ||
    isNullOrUndefined(portfolioDataRes.data)
  ) {
    return <></>;
  }
  if (userIsLoading || userIsError || isNullOrUndefined(userDataRes)) {
    return <></>;
  }
  console.log(portfolioDataRes.data);
  return (
    <Appshell>
      <UserProfile
        stockData={portfolioDataRes.data}
        username={userDataRes?.name ?? "Anon"}
      />
    </Appshell>
  );
}

/* export const getServerSideProps: GetServerSideProps = async (context) => {
    const userData = await getServerSideSessionReq(context);

    const profData = (await getProfData(context.query.id as string))?.data;
    if (!profData?.name) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return { props: { userData, profData } };
  }; */
