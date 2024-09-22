import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress ?? "";
  const userData = await prisma.user.findUnique({
    where: {
      email: email,
      status: "active",
    },
  });
  return <section>Dashboard status: {JSON.stringify(userData)}</section>;
}
