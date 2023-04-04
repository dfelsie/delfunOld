export async function getAllUsers(numToTake = 25) {
  const userList = await prisma?.user.findMany({
    take: numToTake,
  });
  return userList;
}
