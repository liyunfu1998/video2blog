import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/UpgradeYourPlan";
import UploadForm from "@/components/upload/UploadForm";
import { plansMap } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // update the user id
  let userId = null;
  let hasUserCancelled = false;
  let priceId = null;
  const hasUserCancelledQuery = await prisma.user.findUnique({
    where: {
      email: email,
      status: "canceled",
    },
  });
  if (user) {
    userId = clerkUser?.id;
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        user_id: userId,
      },
    });

    priceId = user.price_id;
  }

  if (hasUserCancelledQuery) {
    hasUserCancelled = true;
  }

  const { id: planTypeId, name: planTypeName } =
    plansMap?.find((plan) => plan.priceId === priceId) || {};

  const isBasicPlan = planTypeId === "basic";
  const isProPlan = planTypeId === "pro";

  return (
    <BgGradient>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize rounded-full">
            {planTypeName} Plan
          </Badge>
          <h2 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start creating amazing content
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            Upload your audio or video file and let our AI do the magic!
          </p>
          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center sm:text-4xl">
            You get{" "}
            <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
              {isBasicPlan ? "3" : isProPlan ? "Unlimited" : "0"} blog posts
            </span>{" "}
            as part of the{" "}
            <span className="font-bold capitalize">{planTypeName}</span> Plan
          </p>

          {hasUserCancelled ? (
            <UpgradeYourPlan />
          ) : (
            <BgGradient>
              <UploadForm />
            </BgGradient>
          )}
        </div>
      </div>
    </BgGradient>
  );
}
