"use client";

import { ArrowLeft, Wallet, Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

const topupOptions = [
  { title: "Bank Transfer", subtitle: "Top up from your linked bank" },
  { title: "Debit Card", subtitle: "Instant money top up" },
  { title: "Saved Payment Method", subtitle: "Use your preferred method" },
];

export default function TopupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">Topup</h1>

        <div className="relative z-10 mt-8 rounded-3xl bg-white/5 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Wallet size={30} className="text-[#1E73FF]" />
          </div>

          <h2 className="mt-4 text-2xl font-semibold">Add Money</h2>
          <p className="mt-2 text-sm text-white/60">
            Choose how you would like to top up your UniBudgetHub balance.
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          {topupOptions.map((option) => (
            <button
              key={option.title}
              className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Plus size={18} className="text-[#1E73FF]" />
                </div>

                <div>
                  <p className="text-base font-medium text-white/90">
                    {option.title}
                  </p>
                  <p className="mt-1 text-sm text-white/45">{option.subtitle}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/45" />
            </button>
          ))}
        </div>

        <button className="relative z-10 mt-8 w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold">
          Continue
        </button>

        <AppFooterNav />
      </div>
    </main>
  );
}