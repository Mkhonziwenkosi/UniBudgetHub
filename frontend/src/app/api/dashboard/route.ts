import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

type CardRow = {
  card_holder_name: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  balance: string;
  account_number: string;
  sort_code: string;
};

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

    const cardResult = await sql`
      SELECT
        c.card_holder_name,
        c.card_number,
        c.expiry_date,
        c.cvv,
        c.balance,
        c.account_number,
        c.sort_code
      FROM cards c
      WHERE c.user_id = ${Number(userId)}
      LIMIT 1
    `;

    const cards = cardResult as CardRow[];

    if (cards.length === 0) {
      return NextResponse.json(
        { error: "No card data found for this user." },
        { status: 404 }
      );
    }

    const transactionResult = await sql`
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
      LIMIT 5
    `;

    const transactions = transactionResult as TransactionRow[];

    return NextResponse.json(
      {
        card: cards[0],
        transactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard data." },
      { status: 500 }
    );
  }
}