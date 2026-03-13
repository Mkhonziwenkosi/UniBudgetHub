import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

type UserRow = {
  id: number;
  full_name: string;
  phone: string | null;
  email: string;
  birth_date: string | null;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 }
      );
    }

    const result = await sql`
      SELECT
        id,
        full_name,
        phone,
        email,
        birth_date::text AS birth_date
      FROM users
      WHERE id = ${Number(userId)}
      LIMIT 1
    `;

    const users = result as UserRow[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0], { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 }
      );
    }

    const { fullName, phone, email, birthDate } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const existingEmailResult = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
        AND id <> ${Number(userId)}
      LIMIT 1
    `;

    const existingEmails = existingEmailResult as { id: number }[];

    if (existingEmails.length > 0) {
      return NextResponse.json(
        { error: "That email is already in use." },
        { status: 409 }
      );
    }

    await sql`
      UPDATE users
      SET
        full_name = ${fullName},
        phone = ${phone || null},
        email = ${email},
        birth_date = ${birthDate || null}
      WHERE id = ${Number(userId)}
    `;

    await sql`
      UPDATE cards
      SET card_holder_name = ${fullName}
      WHERE user_id = ${Number(userId)}
    `;

    return NextResponse.json(
      { message: "Profile updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}