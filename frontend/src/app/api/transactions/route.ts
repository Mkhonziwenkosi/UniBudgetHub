import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

type TransactionRow = {
  id: number;
  merchant_name: string;
  category: string;
  amount: string;
  transaction_type: "income" | "expense";
  transaction_date: string;
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
        t.id,
        t.merchant_name,
        t.category,
        t.amount,
        t.transaction_type,
        t.transaction_date
      FROM transactions t
      WHERE t.user_id = ${Number(userId)}
      ORDER BY t.transaction_date DESC
    `;

    const transactions = result as TransactionRow[];

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Transactions fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}