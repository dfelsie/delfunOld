import { type NextApiRequest, type NextApiResponse } from "next";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

const setup = async (req: NextApiRequest, res: NextApiResponse) => {
  trpc.setup.setupCsv.useMutation({}).mutate();
};

export default setup;
