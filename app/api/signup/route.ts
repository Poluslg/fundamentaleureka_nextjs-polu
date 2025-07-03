import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

const handleSignup = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { email, password, username, phone } = await req.json();

  if (!email || !password || !username || !phone) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      const hwPassword = await hash(password, 10);
      const saveUser = await prisma.user.create({
        data: {
          email: email as string,
          password: hwPassword,
          phoneNumber: phone,
          username: username,
          Authenticator: "Credentials",
        },
      });

      if (saveUser)
        return NextResponse.json(
          { message: "User Sucessfully registered" },
          { status: 200 }
        );
    }
    return NextResponse.json(
      { message: "Email already Registered" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Please try again latter" },
      { status: 400 }
    );
  }
};

export { handleSignup as POST };
