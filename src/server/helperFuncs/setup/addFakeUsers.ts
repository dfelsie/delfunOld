import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
import { v4 as uuidv4 } from "uuid";
export default async function addFakeUsers() {
  const FAKE_USER_NAMES = [
    "Alice",
    "Bob",
    "Carol",
    "Devin",
    "Emily",
    "Frank",
    "Gerda",
    "Hector",
    "Isabelle",
    "Jeremy",
  ];
  const NUMBER_FAKE_USERS_TO_MAKE = 10;
  for (let i = 0; i < NUMBER_FAKE_USERS_TO_MAKE; i++) {
    const fakeName =
      FAKE_USER_NAMES[i % FAKE_USER_NAMES.length] +
      new Date().getTime().toString();
    const fakeEmail = fakeName + "@fakemail.com";
    const portId = uuidv4();
    const newUser = await prisma?.user.create({
      data: {
        isTest: true,
        portfolioId: portId,
        email: fakeEmail,
        name: fakeName,
      },
    });
    if (isNullOrUndefined(newUser)) {
      throw Error("");
    }
    await prisma?.portfolio.create({
      data: {
        uid: newUser.id,
        id: portId,
      },
    });
  }
}
