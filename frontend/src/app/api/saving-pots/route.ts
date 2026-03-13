import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

type SavingPotRow = {
  id: number;
  title: string;
  target_amount: string;
  description: string | null;
  created_at: string;
  total_saved: string;
  members_count: string;
};

type NewPotRow = {
  id: number;
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
        sp.id,
        sp.title,
        sp.target_amount::text AS target_amount,
        sp.description,
        sp.created_at::text AS created_at,
        COALESCE(SUM(spc.amount), 0)::text AS total_saved,
        COUNT(DISTINCT spm.user_id)::text AS members_count
      FROM saving_pots sp
      JOIN saving_pot_members spm
        ON sp.id = spm.pot_id
      LEFT JOIN saving_pot_contributions spc
        ON sp.id = spc.pot_id
      WHERE sp.id IN (
        SELECT pot_id
        FROM saving_pot_members
        WHERE user_id = ${Number(userId)}
      )
      GROUP BY sp.id, sp.title, sp.target_amount, sp.description, sp.created_at
      ORDER BY sp.created_at DESC
    `;

    const savingPots = result as SavingPotRow[];

    return NextResponse.json({ savingPots }, { status: 200 });
  } catch (error) {
    console.error("Saving pots fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch saving pots." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 }
      );
    }

    const { title, targetAmount, description, memberIds } = await request.json();

    if (!title || !targetAmount) {
      return NextResponse.json(
        { error: "Title and target amount are required." },
        { status: 400 }
      );
    }

    const createdPotResult = await sql`
      INSERT INTO saving_pots (
        created_by_user_id,
        title,
        target_amount,
        description
      )
      VALUES (
        ${Number(userId)},
        ${title},
        ${targetAmount},
        ${description || null}
      )
      RETURNING id
    `;

    const createdPots = createdPotResult as NewPotRow[];

    if (createdPots.length === 0) {
      return NextResponse.json(
        { error: "Failed to create saving pot." },
        { status: 500 }
      );
    }

    const potId = createdPots[0].id;

    await sql`
      INSERT INTO saving_pot_members (pot_id, user_id)
      VALUES (${potId}, ${Number(userId)})
      ON CONFLICT (pot_id, user_id) DO NOTHING
    `;

    if (Array.isArray(memberIds)) {
      for (const memberId of memberIds) {
        await sql`
          INSERT INTO saving_pot_members (pot_id, user_id)
          VALUES (${potId}, ${Number(memberId)})
          ON CONFLICT (pot_id, user_id) DO NOTHING
        `;
      }
    }

    return NextResponse.json(
      {
        message: "Saving pot created successfully.",
        potId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Saving pot create error:", error);

    return NextResponse.json(
      { error: "Failed to create saving pot." },
      { status: 500 }
    );
  }
}