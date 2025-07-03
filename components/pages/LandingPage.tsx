"use client";
import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Footer from "../Footer";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

function LandingPage() {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const tiers = [
    {
      name: "FREE",
      id: "tier-hobby",
      href: "/auth/login",
      priceMonthly: "₹0",
      description:
        "The perfect plan if you're just getting started with our product.",
      features: [
        "Limited Notes",
        "Global Community",
        "Advanced analytics",
        "24-hour support response time",
      ],
      featured: false,
    },
    {
      name: "PREMIUM",
      id: "tier-enterprise",
      href: "/auth/login",
      priceMonthly: "₹99",
      description: "Dedicated support and infrastructure for your ",
      features: [
        "Unlimited Notes",
        "Mentors",
        "Practical Learning",
        // 'Unlimited subscribers',
        "In-Depth Concepts",
        "Career Advancement",
        "Expert Resources",
        "Dedicated support representative",
      ],
      featured: true,
    },
  ];
  const features = [
    {
      icon: "⚙️",
      title: "Practical Learning",
      paragraph:
        "Dive into real-world engineering problems with hands-on projects and simulations.",
    },
    {
      icon: "📚",
      title: "Expert Resources",
      paragraph:
        " Access curated content from industry professionals and experienced educators.",
    },
    {
      icon: "🌐",
      title: "Global Community",
      paragraph:
        "Connect with a network of aspiring engineers and mentors from across the globe.",
    },
    {
      icon: "🔍",
      title: "In-Depth Concepts",
      paragraph:
        " Master core engineering subjects through easy-to-understand explanations and examples.",
    },
    {
      icon: "💻",
      title: "Cutting-Edge Tools",
      paragraph:
        "Learn to use the latest engineering software and technologies to stay ahead.",
    },
    {
      icon: "🚀",
      title: "Career Advancement",
      paragraph:
        "Gain practical skills and certifications that enhance your employability.",
    },
  ];
  function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(" ");
  }
  const handleClick = (index: number) => {
    setValue(index);
  };
  const { data: session } = useSession();
  // console.log(session);

  return (
    <main className=" h-screen">
      {/* Navbar */}
      <Header />
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-evenly py-16">
        <Image
          width={500}
          height={500}
          quality={100}
          priority
          src="/images/image-removebg-preview.png"
          alt="Laptop Img"
        />
        <div className="flex flex-col items-center md:items-start">
          <p className="text-4xl md:text-5xl font-semibold font-serif text-gray-700">
            <span>You </span>
            can learn <br /> anything.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-700 mt-5"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h3 className="md:text-3xl sm:text-2xl font-bold text-center text-gray-800 mb-10">
          Why Choose FundaMentalEureka?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              className={`text-center group cursor-pointer transition duration-300 p-2 rounded-md hover:bg-gray-200 ${
                index === value && "bg-gray-200"
              }`}
              onClick={() => handleClick(index)}
              key={index}
            >
              <div className="text-blue-600 text-5xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-gray-800">
                {feature.title}
              </h4>
              <p
                className={`text-gray-600 mt-2 transition-opacity duration-300 ${
                  index === value
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {feature.paragraph}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Learn with image section */}
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#75d6b6] to-[#ff0202] opacity-30"
          />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
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
                  tier.featured ? "text-indigo-400" : "text-indigo-600",
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
                        tier.featured ? "text-indigo-400" : "text-indigo-600",
                        "h-6 w-5 flex-none"
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={session ? `/buyplane/${tier.name}` : tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? "bg-indigo-500 text-gray-100 shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                    : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600",
                  "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                )}
              >
                Get started today
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* <SignInForm /> */}
      {/* Footer */}
      <Footer />
    </main>
  );
}

export default LandingPage;
