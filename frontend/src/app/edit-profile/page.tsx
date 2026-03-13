"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, UserCircle2, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type ProfileData = {
  id: number;
  full_name: string;
  phone: string | null;
  email: string;
  birth_date: string | null;
};

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

function getMonthName(monthNumber: string) {
  const monthIndex = Number(monthNumber) - 1;
  return monthNames[monthIndex] || "";
}

function getMonthNumber(monthName: string) {
  const monthIndex = monthNames.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1) return "";
  return String(monthIndex + 1).padStart(2, "0");
}

export default function EditProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data: ProfileData | { error: string } = await response.json();

        if (response.ok) {
          const profile = data as ProfileData;

          setFullName(profile.full_name);
          setPhone(profile.phone || "");
          setEmail(profile.email);

          if (profile.birth_date) {
            const [year, month, day] = profile.birth_date.split("-");
            setBirthYear(year || "");
            setBirthMonth(getMonthName(month || ""));
            setBirthDay(day || "");
          }

          setMessage("");
        } else {
          setMessage("error" in data ? data.error : "Failed to load profile.");
        }
      } catch {
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const monthNumber = getMonthNumber(birthMonth);
    const formattedBirthDate =
      birthYear && monthNumber && birthDay
        ? `${birthYear}-${monthNumber}-${birthDay.padStart(2, "0")}`
        : null;

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          birthDate: formattedBirthDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">
          Edit Profile
        </h1>

        <div className="relative z-10 mt-8 flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <UserCircle2 size={56} className="text-white/85" strokeWidth={1.6} />
          </div>
        </div>

        {loading ? (
          <p className="relative z-10 mt-8 text-sm text-white/60">
            Loading profile...
          </p>
        ) : (
          <div className="relative z-10 mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm text-white/85">Full Name</label>
              <div className="flex items-center border-b border-white/20 pb-3">
                <User size={18} className="mr-3 text-white/70" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/85">Email Address</label>
              <div className="flex items-center border-b border-white/20 pb-3">
                <Mail size={18} className="mr-3 text-white/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/85">Phone Number</label>
              <div className="flex items-center border-b border-white/20 pb-3">
                <Phone size={18} className="mr-3 text-white/70" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm text-white/85">Birth Date</label>
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

            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("success")
                    ? "text-[#1E73FF]"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        <AppFooterNav />
      </div>
    </main>
  );
}