import forgotPasswordTemplate from "@/components/ui/forgotPasswordTemplate";
import sendEmail from "@/hooks/sendEmail";
import {prisma} from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const forgotPassword = async (req: NextRequest) => {
  const { email } = await req.json();
  // console.log(email);

  const generatedOtp = () => {
    return Math.floor(Math.random() * 900000) + 100000;
  };
  const totalForgotPasswordInputTry = 3;
  if (email)
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        const otp = generatedOtp();
        const expireTime = new Date().getTime() + 60 * 60 * 1000;

        const update = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            forgotPasswordOtp: otp,
            forgotPasswordOtpExpire: new Date(expireTime).toISOString(),
            totalForgotPasswordInputTry,
          },
        });

        if (update) {
          const send = await sendEmail({
            sendTo: email,
            subject: "Forgot Password",
            html: forgotPasswordTemplate({
              name: user.name as string,
              otp: otp,
            }),
          });
          if (send)
            return NextResponse.json(
              { message: "OTP send To Your Email" },
              { status: 200 }
            );
        }
      } else {
        return NextResponse.json(
          { message: "User Not Found" },
          { status: 200 }
        );
      }
    } catch {
      return NextResponse.json(
        { message: "Please try again latter" },
        { status: 400 }
      );
    }
};

export { forgotPassword as GET, forgotPassword as POST };
