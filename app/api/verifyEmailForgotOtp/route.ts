import {prisma} from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const verifyEmailForgotOtp = async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    const { otp, useremail } = await req.json();

    if (!otp || !useremail) {
      return NextResponse.json(
        { message: "OTP and email are required" },
        { status: 400 }
      );
    }

    const userotp = Number(otp);

    const user = await prisma.user.findFirst({
      where: {
        email: useremail,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const currentTime = Date.now();

    if (currentTime > new Date(user.forgotPasswordOtpExpire!).getTime()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    if (
      user.totalForgotPasswordInputTry &&
      user.totalForgotPasswordInputTry <= 0
    ) {
      return NextResponse.json(
        { message: "You have exceeded the limit of OTP attempts" },
        { status: 400 }
      );
    }

    if (userotp !== user.forgotPasswordOtp) {
      const updatedUser = await prisma.user.update({
        where: { email: useremail },
        data: {
          totalForgotPasswordInputTry: Math.max(user.totalForgotPasswordInputTry! - 1, 0),
        },
      });

      return NextResponse.json(
        {
          message: `Invalid OTP. Attempts left: ${updatedUser.totalForgotPasswordInputTry}`,
        },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email: useremail },
      data: {
        forgotPasswordOtp: null,
        forgotPasswordOtpExpire: null,
        totalForgotPasswordInputTry: null,
      },
    });

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
};

export { verifyEmailForgotOtp as POST };
