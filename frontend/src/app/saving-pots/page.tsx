"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PiggyBank, Users, ChevronRight } from "lucide-react";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type SavingPot = {
  id: number;
  title: string;
  target_amount: string;
  description: string | null;
  created_at: string;
  total_saved: string;
  members_count: string;
};

type SavingPotsResponse = {
  savingPots: SavingPot[];
};

function formatCurrency(value: string) {
  return `£${Number(value).toFixed(2)}`;
}

function getProgress(saved: string, target: string) {
  const savedAmount = Number(saved);
  const targetAmount = Number(target);

  if (!targetAmount || targetAmount <= 0) return 0;

  return Math.min((savedAmount / targetAmount) * 100, 100);
}

export default function SavingPotsPage() {
  const router = useRouter();
  const [savingPots, setSavingPots] = useState<SavingPot[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavingPots = async () => {
      try {
        const response = await fetch("/api/saving-pots");
        const data: SavingPotsResponse | { error: string } = await response.json();

        if (response.ok) {
          setSavingPots((data as SavingPotsResponse).savingPots);
          setError("");
        } else {
          setError("error" in data ? data.error : "Failed to load saving pots.");
        }
      } catch {
        setError("Failed to load saving pots.");
      }
    };

    fetchSavingPots();
  }, []);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">
          Saving Pots
        </h1>

        <p className="relative z-10 mt-3 text-sm text-white/55">
          Save together for shared goals like groceries, rent or bills.
        </p>

        {error && (
          <p className="relative z-10 mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          onClick={() => router.push("/saving-pots/create")}
          className="relative z-10 mt-6 w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold"
        >
          Create New Pot
        </button>

        <div className="relative z-10 mt-6 space-y-4">
          {savingPots.map((pot) => {
            const progress = getProgress(pot.total_saved, pot.target_amount);

            return (
              <button
                key={pot.id}
                onClick={() => router.push(`/saving-pots/${pot.id}`)}
                className="w-full rounded-2xl bg-white/5 p-4 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                      <PiggyBank size={18} className="text-[#1E73FF]" />
                    </div>

                    <div>
                      <p className="text-base font-medium text-white/90">
                        {pot.title}
                      </p>
                      <p className="mt-1 text-sm text-white/45">
                        {pot.description || "Shared savings goal"}
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-white/45" />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-white/70">
                    {formatCurrency(pot.total_saved)} saved
                  </p>
                  <p className="text-white/45">
                    Target {formatCurrency(pot.target_amount)}
                  </p>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#1E73FF]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  <Users size={14} />
                  <span>{pot.members_count} members</span>
                </div>
              </button>
            );
          })}

          {savingPots.length === 0 && !error && (
            <div className="rounded-2xl bg-white/5 p-5 text-center">
              <p className="text-sm text-white/50">
                No saving pots yet.
              </p>
            </div>
          )}
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}