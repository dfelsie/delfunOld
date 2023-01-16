import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
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
    const newUser = await prisma?.user.create({
      data: {
        isTest: true,
        email: fakeEmail,
        name: fakeName,
      },
    });
    if (isNullOrUndefined(newUser)) {
      throw Error("");
    }
  }
}
