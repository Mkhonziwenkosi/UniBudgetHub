"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  UserCircle2,
  ChevronRight,
  User,
  Bell,
  Shield,
  LogOut,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type SettingsUserData = {
  card_holder_name: string;
};

type SettingsData = {
  card: SettingsUserData;
};

export default function SettingsPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@email.com");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data: SettingsData | { error: string } = await response.json();

        if (response.ok) {
          const dashboardData = data as SettingsData;
          setUserName(dashboardData.card.card_holder_name);

          const generatedEmail =
            dashboardData.card.card_holder_name
              .toLowerCase()
              .replace(/\s+/g, ".") + "@testmail.com";

          setUserEmail(generatedEmail);
          setError("");
        } else {
          setError("error" in data ? data.error : "Failed to load settings.");
        }
      } catch {
        setError("Failed to load settings.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/signin");
      } else {
        setError("Failed to log out.");
      }
    } catch {
      setError("Failed to log out.");
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems = [
  {
    label: "Edit Profile",
    icon: User,
    onClick: () => router.push("/edit-profile"),
  },
  {
    label: "Notifications",
    icon: Bell,
    onClick: () => router.push("/notifications"),
  },
  {
    label: "Security",
    icon: Shield,
    onClick: () => router.push("/security"),
  },
];

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">Settings</h1>

        {error && (
          <p className="relative z-10 mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="relative z-10 mt-8 rounded-3xl bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <UserCircle2 size={56} className="text-white/85" strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-white/95">
              {userName}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-white/55">
              <Mail size={14} />
              <span>{userEmail}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 text-left backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Icon size={18} className="text-white/85" />
                  </div>

                  <span className="text-base font-medium text-white/90">
                    {item.label}
                  </span>
                </div>

                <ChevronRight size={18} className="text-white/45" />
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-between rounded-2xl bg-[#2B1A22] p-4 text-left disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3A202A]">
                <LogOut size={18} className="text-[#FF6B8A]" />
              </div>

              <span className="text-base font-medium text-[#FFB3C2]">
                {loggingOut ? "Logging out..." : "Log Out"}
              </span>
            </div>

            <ChevronRight size={18} className="text-[#FF8FA8]" />
          </button>
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}