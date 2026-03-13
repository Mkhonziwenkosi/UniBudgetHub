"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type CardData = {
  card_holder_name: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  balance: string;
  account_number: string;
  sort_code: string;
};

export default function CardsPage() {
  const router = useRouter();

  const [card, setCard] = useState<CardData | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        if (response.ok) {
          setCard(data.card ? data.card : data);
          setError("");
        } else {
          setError(data.error || "Failed to load card details.");
        }
      } catch {
        setError("Failed to load card details.");
      }
    };

    fetchCardData();
  }, []);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);

      setTimeout(() => {
        setCopiedField("");
      }, 1200);
    } catch {
      setCopiedField("");
    }
  };

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-40 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">My Cards</h1>

        {error && (
          <p className="relative z-10 mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="relative z-10 mt-8 overflow-hidden rounded-3xl bg-[#2F3192] px-5 pt-5 pb-5 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-8 top-2 h-28 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -right-5 top-4 h-24 w-36 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 left-24 h-24 w-44 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="absolute inset-2.5 rounded-[1.25rem] bg-[#1D1D4F]/20" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-white/10 p-2">
                <CreditCard size={18} className="text-white/80" />
              </div>

              <p className="text-xs font-medium text-white/60">UniBudgetHub</p>
            </div>

            <p className="mt-8 whitespace-nowrap text-2xl font-medium tracking-[0.14em] text-white/90">
              {card ? card.card_number : "0000 0000 0000 0000"}
            </p>

            <div className="mt-7 flex items-end justify-between text-white/90">
              <div>
                <p className="text-[10px] text-white/50">Card Holder</p>
                <p className="mt-1 text-sm font-medium text-white/95">
                  {card ? card.card_holder_name : "User"}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-white/50">Expiry</p>
                <p className="mt-1 text-sm font-medium text-white/95">
                  {card ? card.expiry_date : "--/--"}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-white/50">CVV</p>
                <p className="mt-1 text-sm font-medium text-white/95">
                  {card ? card.cvv : "---"}
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[11px] uppercase tracking-wide text-white/55">
                  Current Balance
                </p>
                <p className="text-4xl font-semibold leading-none">
                  £{card ? card.balance : "0.00"}
                </p>
              </div>

              <div className="flex items-center">
                <div className="h-7 w-7 rounded-full bg-[#EB001B]" />
                <div className="-ml-3 h-7 w-7 rounded-full bg-[#F79E1B]" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 space-y-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Account Number
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold text-white/95">
                {card ? card.account_number : "--------"}
              </p>

              <button
                onClick={() =>
                  card && handleCopy(card.account_number, "account")
                }
                className="flex items-center gap-1 text-sm text-[#1E73FF]"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Sort Code
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold text-white/95">
                {card ? card.sort_code : "-- -- --"}
              </p>

              <button
                onClick={() => card && handleCopy(card.sort_code, "sort")}
                className="flex items-center gap-1 text-sm text-[#1E73FF]"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Card Type
            </p>
            <p className="mt-2 text-lg font-semibold text-white/95">
              Mastercard Debit
            </p>
          </div>

          {copiedField && (
            <p className="text-center text-sm text-[#1E73FF]">
              {copiedField === "account"
                ? "Account number copied"
                : "Sort code copied"}
            </p>
          )}
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}