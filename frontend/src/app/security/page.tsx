"use client";

import { ArrowLeft, Shield, KeyRound, Smartphone, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

const securityOptions = [
  {
    icon: KeyRound,
    title: "Change Password",
    description: "Update your password to keep your account secure.",
  },
  {
    icon: Smartphone,
    title: "Two-Factor Authentication",
    description: "Add an extra layer of protection to your account.",
  },
  {
    icon: LockKeyhole,
    title: "Biometric Login",
    description: "Use fingerprint or face recognition on supported devices.",
  },
];

export default function SecurityPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">
          Security
        </h1>

        <div className="relative z-10 mt-8 rounded-3xl bg-white/5 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Shield size={30} className="text-[#1E73FF]" />
          </div>

          <h2 className="mt-4 text-2xl font-semibold">Your Account Security</h2>
          <p className="mt-2 text-sm text-white/60">
            Review the security tools available to protect your UniBudgetHub account.
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          {securityOptions.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.title}
                className="rounded-2xl bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Icon size={18} className="text-white/85" />
                  </div>

                  <div>
                    <p className="text-base font-medium text-white/90">
                      {option.title}
                    </p>
                    <p className="mt-1 text-sm text-white/45">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="relative z-10 mt-8 w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold">
          Review Security Settings
        </button>

        <AppFooterNav />
      </div>
    </main>
  );
}