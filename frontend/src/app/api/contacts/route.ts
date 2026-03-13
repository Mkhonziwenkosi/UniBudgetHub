import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

type ContactRow = {
  id: number;
  full_name: string;
  email: string;
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
      SELECT id, full_name, email
      FROM users
      WHERE id <> ${Number(userId)}
      ORDER BY full_name ASC
    `;

    const contacts = result as ContactRow[];

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Contacts fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch contacts." },
      { status: 500 }
    );
  }
}