"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateAiInsights } from "./dashboard";
import sendEmail from "@/hooks/sendEmail";
import accountSetupTemplate from "@/components/ui/accountSetupTemplate";
import { compare, hash } from "bcryptjs";

interface UpdateResult {
  updatedUser?: any;
  industryInsight?: any;
}

interface Updatinguser {
  industry: string;
  subIndustry?: string;
  bio?: string;
  experience?: number;
  skills?: Array<string>;
}

export async function updateUser(data: Updatinguser): Promise<any> {
  console.log("Updating user with data:", data);
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      IndustryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");

  try {
    const result: UpdateResult = await prisma.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findFirst({
          where: {
            industry: data.industry,
          },
        });
        if (!industryInsight) {
          // industryInsight = await prisma.industryInsight.create({
          //   data: {
          //     industry: data.industry,
          //     salaryRanges: [],
          //     growthRate: 0,
          //     demandLevel: "Medium",
          //     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          //     topSkills: [],
          //     keyTrends: [],
          //     marketOutlook: "Neutral",
          //     recommendedSkills: [],
          //   },
          // });
          const insights = await generateAiInsights(data?.industry);
          industryInsight = await prisma.industryInsight.create({
            data: {
              industry: data?.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }
        //  else {
        //   const insights = await generateAiInsights(data?.industry);
        //   industryInsight = await tx.industryInsight.update({
        //     where: {
        //       id: industryInsight.id,
        //     },

        //     data: {
        //       industry: data?.industry,
        //       ...insights,
        //       nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        //     },
        //   });
        // }

        const updatedUser = await tx.user.update({
          where: {
            email,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updatedUser, industryInsight };
      },
      {
        timeout: 1000,
      }
    );
    // console.log("User updated successfully", result);
    return user;
  } catch {
    throw new Error("Something went wrong");
  }
}
export async function getUserOnBoardingStatus() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        industry: true,
      },
    });
    return {
      isOnBoarded: !!user?.industry || false,
    };
  } catch {
    // console.error("Error fetching user onboarding status", error);
    throw new Error("Error fetching user onboarding status");
  }
}

export async function getUserAccountSetup() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        accountSetup: true,
      },
    });
    return {
      isAccountSetup: !!user?.accountSetup || false,
    };
  } catch {
    throw new Error("Error fetching user Account setup");
  }
}

export async function generateOtp() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const hwOtp = await hash(otp.toString(), 10);
    const expireTime = new Date().getTime() + 60 * 60 * 1000;
    const totalForgotPasswordInputTry = 3;
    const update = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountSetupPasswordOtp: hwOtp,
        accountSetupPasswordOtpExpire: new Date(expireTime).toISOString(),
        totalaccountSetupInputTry: totalForgotPasswordInputTry,
      },
    });
    if (update) {
      await sendEmail({
        sendTo: email,
        subject: "Account Setup OTP",
        html: accountSetupTemplate({
          name: "User",
          otp: otp,
        }),
      });
    }
  } catch {
    throw new Error("Error generating OTP");
  }
}

export async function checkOtp() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        accountSetupPasswordOtp: true,
      },
    });

    return user?.accountSetupPasswordOtp === null
      ? { isOtpAviable: false }
      : { isOtpAviable: true };
  } catch {
    throw new Error("Error fetching user Account setup");
  }
}

export async function verifyOtp(otp: string) {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        accountSetupPasswordOtp: true,
        accountSetupPasswordOtpExpire: true,
        totalaccountSetupInputTry: true,
      },
    });
    if (!user) throw new Error("User not found");

    if (user.totalaccountSetupInputTry && user.totalaccountSetupInputTry <= 0) {
      throw new Error("You have exceeded the maximum number of attempts");
    }
    const currentTime = Date.now();
    if (currentTime > new Date(user.accountSetupPasswordOtpExpire!).getTime()) {
      throw new Error("OTP has expired");
    }
    const isMatch = await compare(otp, user.accountSetupPasswordOtp!);
    if (isMatch) {
      await prisma.user.update({
        where: { email: email },
        data: {
          accountSetupPasswordOtp: null,
          accountSetupPasswordOtpExpire: null,
          totalaccountSetupInputTry: null,
          accountSetup: true,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          totalaccountSetupInputTry: Math.max(
            user.totalaccountSetupInputTry! - 1,
            0
          ),
        },
      });
      const totalaccountSetupInputTry = user.totalaccountSetupInputTry! - 1;
      throw new Error(
        `Invalid OTP. Attempts left: ${totalaccountSetupInputTry}`
      );
    }
    return "Otp Varified Successfully";
  } catch {
    throw new Error("Error verifying OTP");
  }
}

export async function getUserRole() {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      role: true,
    },
  });
  if (!user) throw new Error("User not found");
  return user.role;
}
export const getUserDetails = async () => {
  const session = await auth();
  const email = session?.user?.email as string;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      industry: true,
      bio: true,
      experience: true,
      skills: true,
      role: true,
    },
  });
  if (!user) throw new Error("User not found");
  return user;
};
