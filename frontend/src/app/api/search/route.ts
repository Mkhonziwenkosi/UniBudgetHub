import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 }
      );
    }

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const results = await sql`
      SELECT
        id,
        merchant_name,
        category,
        amount,
        transaction_type
      FROM transactions
      WHERE user_id = ${Number(userId)}
      AND (
        merchant_name ILIKE ${"%" + query + "%"}
        OR category ILIKE ${"%" + query + "%"}
      )
      ORDER BY transaction_date DESC
      LIMIT 20
    `;

    return NextResponse.json(
      { results },
      { status: 200 }
    );

  } catch (error) {

    console.error("Search error:", error);

    return NextResponse.json(
      { error: "Failed to perform search." },
      { status: 500 }
    );
  }
}