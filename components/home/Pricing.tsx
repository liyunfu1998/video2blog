import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { plansMap } from "@/lib/constants";

export default function Pricing() {
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center w-full pb-6">
            <h2 className="font-bold text-xl uppercase mb-8 text-purple-600">
              Pricing
            </h2>
          </div>

          <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
            {plansMap.map((plan, idx) => (
              <div key={idx} className="relative w-full max-w-lg">
                <div
                  className={cn(
                    "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 rounded-2xl border border-gray-500/20",
                    plan.id === "pro" && "border-violet-500 gap-5 border-2"
                  )}
                >
                  <p className="text-lg lg:text-xl font-bold capitalize">
                    {plan.name}
                  </p>
                  <p className="text-base-content/80 mt-2">
                    {plan.description}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-5xl tracking-tight font-extrabold">
                      ${plan.price}
                    </p>
                    <div className="flex flex-col justify-end mb-1">
                      <p className="text-xs text-base-content/60 uppercase font-semibold">
                        USD
                      </p>
                      <p className="text-xs text-base-content/60">/month</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan?.items?.map((item, idx) => (
                      <li className="flex gap-2 items-center" key={idx}>
                        <CheckIcon size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <Button
                      variant={"link"}
                      className={cn(
                        "border-2 rounded-full flex gap-2 bg-black text-gray-100",
                        plan.id === "pro" && "border-amber-300 px-4"
                      )}
                    >
                      <Link
                        href={plan.paymentLink}
                        className="flex gap-1 items-center"
                      >
                        Get Started
                        <ArrowRightIcon size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
