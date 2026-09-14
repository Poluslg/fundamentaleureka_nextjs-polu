import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePasswordSchema = z.object({
  email: z.string().email(),
  otp: z.union([z.string(), z.number()]),
  password: z.string().min(8),
});

const updatepassword = async (req: NextRequest) => {
  const body = await req.json();
  const parsed = updatePasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 400 }
    );
  }

  const { email, otp, password } = parsed.data;

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 400 }
      );
    }

    if (
      user.forgotPasswordOtp === null ||
      user.forgotPasswordOtpExpire === null
    ) {
      return NextResponse.json(
        { message: "Please verify OTP again" },
        { status: 400 }
      );
    }

    if (Date.now() > new Date(user.forgotPasswordOtpExpire).getTime()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    if (
      user.totalForgotPasswordInputTry !== null &&
      user.totalForgotPasswordInputTry <= 0
    ) {
      return NextResponse.json(
        { message: "You have exceeded the limit of OTP attempts" },
        { status: 400 }
      );
    }

    if (Number(otp) !== user.forgotPasswordOtp) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          totalForgotPasswordInputTry: Math.max(
            (user.totalForgotPasswordInputTry ?? 1) - 1,
            0
          ),
        },
      });

      return NextResponse.json(
        {
          message: `Invalid OTP. Attempts left: ${updatedUser.totalForgotPasswordInputTry}`,
        },
        { status: 400 }
      );
    }

    const hwPassword = await hash(password, 10);
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        password: hwPassword,
        forgotPasswordOtp: null,
        forgotPasswordOtpExpire: null,
        totalForgotPasswordInputTry: null,
      },
    });

    if (updateUser)
      return NextResponse.json(
        { message: "Password Sucessfully Update" },
        { status: 200 }
      );

    return NextResponse.json(
      { message: "something went wrong" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Please try again latter" },
      { status: 400 }
    );
  }
};

export { updatepassword as POST };
