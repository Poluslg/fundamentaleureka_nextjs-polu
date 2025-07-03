"use client";
import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { tiers } from "./tier";
import { useSession } from "next-auth/react";
import { signIn } from "@/auth";

function PremiumPlan() {
  function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(" ");
  }
  const { data: session } = useSession();
  const handleBuyButton = async () => {
    if (!session) signIn();
    const response = await fetch("/api/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: 90,
        email: session?.user?.email,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create checkout session");
      return;
    }
    const data = await response.json();
    window.location.href = data.paymentIntent.url;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 place-content-center place-items-center">
      <div className="flex flex-wrap gap-6 justify-center">
        {tiers.map((tier, tierIdx) => (
          <div key={tierIdx}>
            {tier.priceMonthly === "₹99" && (
              <div
                className={classNames(
                  tier.featured
                    ? "relative bg-gray-900 shadow-2xl"
                    : "bg-white/60 sm:mx-8 lg:mx-0",
                  tier.featured
                    ? ""
                    : tierIdx === 0
                    ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                    : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
                  "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
                )}
              >
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.featured ? "text-cyan-400" : "text-cyan-600",
                    "text-base/7 font-semibold"
                  )}
                >
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span
                    className={classNames(
                      tier.featured ? "text-white" : "text-gray-900",
                      "text-5xl font-semibold tracking-tight"
                    )}
                  >
                    {tier.priceMonthly}
                  </span>
                  <span
                    className={classNames(
                      tier.featured ? "text-gray-400" : "text-gray-500",
                      "text-base"
                    )}
                  >
                    /month
                  </span>
                </p>
                <p
                  className={classNames(
                    tier.featured ? "text-gray-300" : "text-gray-600",
                    "mt-6 text-base/7"
                  )}
                >
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className={classNames(
                    tier.featured ? "text-gray-300" : "text-gray-600",
                    "mt-8 space-y-3 text-sm/6 sm:mt-10"
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <IoMdCheckmarkCircleOutline
                        aria-hidden="true"
                        className={classNames(
                          tier.featured ? "text-cyan-400" : "text-cyan-600",
                          "h-6 w-5 flex-none"
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleBuyButton}
                  aria-describedby={tier.id}
                  className={classNames(
                    tier.featured
                      ? "bg-cyan-500 text-gray-100 shadow-sm hover:bg-cyan-400 focus-visible:outline-cyan-500"
                      : "text-cyan-600 ring-1 ring-inset ring-cyan-200 hover:ring-cyan-300 focus-visible:outline-cyan-600",
                    "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                  )}
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PremiumPlan;
