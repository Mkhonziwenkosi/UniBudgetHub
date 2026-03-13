import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

type NewUserRow = {
  id: number;
};

function randomDigits(length: number) {
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10).toString();
  }

  return result;
}

function generateCardNumber() {
  return `${randomDigits(4)} ${randomDigits(4)} ${randomDigits(4)} ${randomDigits(4)}`;
}

function generateExpiryDate() {
  const now = new Date();
  const futureYear = now.getFullYear() + Math.floor(Math.random() * 5) + 1;
  const futureMonth = Math.floor(Math.random() * 12) + 1;

  const month = futureMonth.toString().padStart(2, "0");
  const year = futureYear.toString().slice(-2);

  return `${month}/${year}`;
}

function generateCvv() {
  return randomDigits(3);
}

function generateAccountNumber() {
  return randomDigits(8);
}

function generateSortCode() {
  return `${randomDigits(2)}-${randomDigits(2)}-${randomDigits(2)}`;
}

export async function POST(request: Request) {
  try {
    const { fullName, phone, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUsersResult = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    const existingUsers = existingUsersResult as { id: number }[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedUserResult = await sql`
      INSERT INTO users (full_name, phone, email, password)
      VALUES (${fullName}, ${phone || null}, ${email}, ${hashedPassword})
      RETURNING id
    `;

    const insertedUsers = insertedUserResult as NewUserRow[];

    if (insertedUsers.length === 0) {
      return NextResponse.json(
        { error: "Failed to create user." },
        { status: 500 }
      );
    }

    const newUser = insertedUsers[0];

    const cardNumber = generateCardNumber();
    const expiryDate = generateExpiryDate();
    const cvv = generateCvv();
    const accountNumber = generateAccountNumber();
    const sortCode = generateSortCode();
    const balance = "0.00";

    await sql`
      INSERT INTO cards (
        user_id,
        card_holder_name,
        card_number,
        expiry_date,
        cvv,
        balance,
        account_number,
        sort_code
      )
      VALUES (
        ${newUser.id},
        ${fullName},
        ${cardNumber},
        ${expiryDate},
        ${cvv},
        ${balance},
        ${accountNumber},
        ${sortCode}
      )
    `;

    return NextResponse.json(
      {
        message: "User created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}