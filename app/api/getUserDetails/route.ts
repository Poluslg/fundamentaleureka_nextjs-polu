import {prisma} from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const getUserDetails = async (req: NextRequest) => {
  const { email } = await req.json();
  if (email)
    try {
      const user = await prisma.user.findFirst({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
        },
      });
      if (user) {
        return NextResponse.json(
          { message: "User Found", data: user },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "User not Found" },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
};

export { getUserDetails as GET, getUserDetails as POST };
