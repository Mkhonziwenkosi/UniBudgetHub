import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

type SavingPotDetailRow = {
  id: number;
  title: string;
  target_amount: string;
  description: string | null;
  created_at: string;
  total_saved: string;
  members_count: string;
};

type MemberRow = {
  user_id: number;
  full_name: string;
};

type ContributionRow = {
  id: number;
  user_id: number;
  full_name: string;
  amount: string;
  contribution_date: string;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 }
      );
    }

    const potId = Number(id);

    const accessResult = await sql`
      SELECT 1
      FROM saving_pot_members
      WHERE pot_id = ${potId}
        AND user_id = ${Number(userId)}
      LIMIT 1
    `;

    if (accessResult.length === 0) {
      return NextResponse.json(
        { error: "You do not have access to this saving pot." },
        { status: 403 }
      );
    }

    const potResult = await sql`
      SELECT
        sp.id,
        sp.title,
        sp.target_amount::text AS target_amount,
        sp.description,
        sp.created_at::text AS created_at,
        COALESCE(SUM(spc.amount), 0)::text AS total_saved,
        COUNT(DISTINCT spm.user_id)::text AS members_count
      FROM saving_pots sp
      LEFT JOIN saving_pot_members spm
        ON sp.id = spm.pot_id
      LEFT JOIN saving_pot_contributions spc
        ON sp.id = spc.pot_id
      WHERE sp.id = ${potId}
      GROUP BY sp.id, sp.title, sp.target_amount, sp.description, sp.created_at
      LIMIT 1
    `;

    const pots = potResult as SavingPotDetailRow[];

    if (pots.length === 0) {
      return NextResponse.json(
        { error: "Saving pot not found." },
        { status: 404 }
      );
    }

    const membersResult = await sql`
      SELECT
        u.id AS user_id,
        u.full_name
      FROM saving_pot_members spm
      JOIN users u
        ON spm.user_id = u.id
      WHERE spm.pot_id = ${potId}
      ORDER BY u.full_name ASC
    `;

    const contributionsResult = await sql`
      SELECT
        spc.id,
        u.id AS user_id,
        u.full_name,
        spc.amount::text AS amount,
        spc.contribution_date::text AS contribution_date
      FROM saving_pot_contributions spc
      JOIN users u
        ON spc.user_id = u.id
      WHERE spc.pot_id = ${potId}
      ORDER BY spc.contribution_date DESC
    `;

    return NextResponse.json(
      {
        pot: pots[0],
        members: membersResult as MemberRow[],
        contributions: contributionsResult as ContributionRow[],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Saving pot detail fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch saving pot details." },
      { status: 500 }
    );
  }
}