import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

type UserRow = {
  id: number;
  full_name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id, full_name, email, password
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    const users = result as UserRow[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Sign in successful.",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("userId", String(user.id), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);

    return NextResponse.json(
      { error: "Failed to sign in." },
      { status: 500 }
    );
  }
}