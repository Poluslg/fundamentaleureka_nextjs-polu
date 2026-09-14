import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const checkEmail = async (req: NextRequest) => {
  const { email } = await req.json();
  if (email)
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        if (user.Authenticator === "google") {
          return NextResponse.json(
            { message: "Please try to login using google" },
            { status: 200 }
          );
        }
        return NextResponse.json({ message: "Email Found" }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Email not Found" },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("checkEmail error:", error);
      return NextResponse.json(
        { message: "Please try again later" },
        { status: 400 }
      );
    }
};

export { checkEmail as GET, checkEmail as POST };
