"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import StatusBar from "@/components/StatusBar";
import Header from "@/components/Header";

import { User, Phone, Mail, Lock } from "lucide-react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthNumber(monthName: string) {
  const monthIndex = monthNames.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1) return "";
  return String(monthIndex + 1).padStart(2, "0");
}

export default function SignUp() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    setMessage("");

    const monthNumber = getMonthNumber(birthMonth);
    const birthDate =
      birthYear && monthNumber && birthDay
        ? `${birthYear}-${monthNumber}-${birthDay.padStart(2, "0")}`
        : "";

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        password,
        birthDate,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Account created successfully.");

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />
      <Header title="" showBack />

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-semibold">Sign Up</h1>

        <div className="mt-10 space-y-8">
          <div>
            <label className="mb-2 block text-sm text-white/90">
              Full Name
            </label>

            <div className="flex items-center border-b border-white/20 pb-3">
              <User size={18} className="mr-3 text-white/70" />

              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-white/60 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/90">
              Phone Number
            </label>

            <div className="flex items-center border-b border-white/20 pb-3">
              <Phone size={18} className="mr-3 text-white/70" />

              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-white/60 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/90">
              Email Address
            </label>

            <div className="flex items-center border-b border-white/20 pb-3">
              <Mail size={18} className="mr-3 text-white/70" />

              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-white/60 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm text-white/90">
              Birth Date
            </label>

            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="DD"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="border-b border-white/20 bg-transparent pb-3 text-center text-sm text-white/90 outline-none placeholder:text-white/35"
              />

              <input
                type="text"
                placeholder="Month"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="border-b border-white/20 bg-transparent pb-3 text-center text-sm text-white/90 outline-none placeholder:text-white/35"
              />

              <input
                type="text"
                placeholder="YYYY"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="border-b border-white/20 bg-transparent pb-3 text-center text-sm text-white/90 outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/90">
              Password
            </label>

            <div className="flex items-center border-b border-white/20 pb-3">
              <Lock size={18} className="mr-3 text-white/70" />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-white/60 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSignUp}
            className="w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold"
          >
            Sign Up
          </button>

          {message && (
            <p className="text-center text-sm text-white/70">{message}</p>
          )}

          <p className="text-center text-sm text-white/60">
            Already have an account.{" "}
            <span
              onClick={() => router.push("/signin")}
              className="cursor-pointer text-[#1E73FF]"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}