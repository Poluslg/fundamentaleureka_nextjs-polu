import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import {prisma} from "@/lib/prisma";
const updatepassword = async (req: NextRequest) => {
  const { email, password } = await req.json();
  if (email || password)
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        const hwPassword = await hash(password, 10);
        const updateUser = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            password: hwPassword,
          },
        });
        if (updateUser)
          return NextResponse.json(
            { message: "Password Sucessfully Update" },
            { status: 200 }
          );
      }
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

export { updatepassword as GET, updatepassword as POST };
