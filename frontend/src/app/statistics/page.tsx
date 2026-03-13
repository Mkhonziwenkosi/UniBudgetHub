"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type TransactionData = {
  id: number;
  merchant_name: string;
  category: string;
  amount: string;
  transaction_type: "income" | "expense";
  transaction_date: string;
};

type CategorySummary = {
  category: string;
  total: number;
  percentage: number;
  color: string;
};

const chartColors = [
  "#B06CFF",
  "#FF9AD5",
  "#60E6C5",
  "#FFB26B",
  "#57C7FF",
  "#8EF0B5",
  "#FFD66B",
  "#7B8CFF",
];

function formatCurrency(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function StatisticsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();

        if (response.ok) {
          setTransactions(data);
          setError("");
        } else {
          setError(data.error || "Failed to load statistics.");
        }
      } catch {
        setError("Failed to load statistics.");
      }
    };

    fetchTransactions();
  }, []);

  const expenseTransactions = useMemo(() => {
    return transactions.filter((item) => item.transaction_type === "expense");
  }, [transactions]);

  const totalSpent = useMemo(() => {
    return expenseTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenseTransactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((item) => item.transaction_type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);
  }, [transactions]);

  const categorySummary = useMemo(() => {
    if (expenseTransactions.length === 0 || totalSpent === 0) {
      return [] as CategorySummary[];
    }

    const grouped = expenseTransactions.reduce<Record<string, number>>((acc, item) => {
      const amount = Number(item.amount);
      acc[item.category] = (acc[item.category] || 0) + amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, total], index) => ({
        category,
        total,
        percentage: (total / totalSpent) * 100,
        color: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenseTransactions, totalSpent]);

  const donutBackground = useMemo(() => {
    if (categorySummary.length === 0) {
      return "conic-gradient(#1f2f3a 0deg 360deg)";
    }

    let currentAngle = 0;

    const segments = categorySummary.map((item) => {
      const angle = (item.percentage / 100) * 360;
      const segment = `${item.color} ${currentAngle}deg ${currentAngle + angle}deg`;
      currentAngle += angle;
      return segment;
    });

    return `conic-gradient(${segments.join(", ")})`;
  }, [categorySummary]);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">Statistics</h1>

        {error && (
          <p className="relative z-10 mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="relative z-10 mt-8 rounded-3xl bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-white/90">Category Chart</p>
            <p className="text-xs text-white/45">Expenses only</p>
          </div>

          <div className="mt-6 flex justify-center">
            <div
              className="relative flex h-52 w-52 items-center justify-center rounded-full"
              style={{ background: donutBackground }}
            >
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#1B1F47]">
                <p className="text-4xl font-semibold leading-none">
                  {totalSpent > 0 ? `${Math.round((categorySummary[0]?.percentage ?? 0))}%` : "0%"}
                </p>
                <p className="mt-1 text-sm text-white/60">Top category</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
            {categorySummary.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-xs text-white/85">{item.category}</p>
                  <p className="text-[11px] text-white/45">
                    {item.percentage.toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Total Spent
            </p>
            <p className="mt-2 text-2xl font-semibold text-white/95">
              {formatCurrency(totalSpent)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Total Income
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#1976FF]">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6 rounded-2xl bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-white/95">Top Categories</p>
            <p className="text-xs text-white/45">
              {categorySummary.length} categories
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {categorySummary.slice(0, 5).map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-white/90">{item.category}</p>
                  <p className="text-sm text-white/60">{formatCurrency(item.total)}</p>
                </div>

                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {categorySummary.length === 0 && !error && (
              <p className="text-sm text-white/50">No expense data available yet.</p>
            )}
          </div>
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}