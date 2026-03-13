"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Apple,
  Music2,
  Film,
  Bus,
  Wallet,
  HeartPulse,
  UtensilsCrossed,
  ShoppingBasket,
  CreditCard,
  ArrowDown,
} from "lucide-react";
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

function getTransactionIcon(category: string, merchantName: string) {
  const normalizedCategory = category.toLowerCase();
  const normalizedMerchant = merchantName.toLowerCase();

  if (normalizedMerchant.includes("apple")) return Apple;
  if (normalizedMerchant.includes("spotify")) return Music2;
  if (normalizedMerchant.includes("netflix")) return Film;
  if (normalizedMerchant.includes("youtube")) return Film;
  if (normalizedCategory === "music") return Music2;
  if (normalizedCategory === "shopping") return ShoppingBasket;
  if (normalizedCategory === "groceries") return ShoppingBasket;
  if (normalizedCategory === "food") return UtensilsCrossed;
  if (normalizedCategory === "transport") return Bus;
  if (normalizedCategory === "health") return HeartPulse;
  if (normalizedCategory === "finance") return Wallet;
  if (normalizedCategory === "income") return ArrowDown;
  if (normalizedCategory === "transaction") return ArrowDown;
  if (normalizedCategory === "entertainment") return Film;

  return CreditCard;
}

function getTransactionStyles(
  category: string,
  transactionType: "income" | "expense"
) {
  const normalizedCategory = category.toLowerCase();

  if (transactionType === "income") {
    return {
      wrapperClass: "bg-white/10",
      iconClass: "text-white/85",
      amountClass: "text-[#1976FF]",
    };
  }

  if (normalizedCategory === "music") {
    return {
      wrapperClass: "bg-[#1A2C2B]",
      iconClass: "text-[#2DD36F]",
      amountClass: "text-white/75",
    };
  }

  if (normalizedCategory === "shopping" || normalizedCategory === "health") {
    return {
      wrapperClass: "bg-[#2B1A22]",
      iconClass: "text-[#FF5B7F]",
      amountClass: "text-white/75",
    };
  }

  return {
    wrapperClass: "bg-white/10",
    iconClass: "text-white/85",
    amountClass: "text-white/75",
  };
}

function formatTransactionAmount(
  amount: string,
  transactionType: "income" | "expense"
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return transactionType === "income" ? "$0.00" : "- $0.00";
  }

  return transactionType === "income"
    ? `$${numericAmount.toFixed(2)}`
    : `- $${numericAmount.toFixed(2)}`;
}

function formatTransactionDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionsPage() {
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
          setError(data.error || "Failed to load transactions.");
        }
      } catch {
        setError("Failed to load transactions.");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="mx-auto min-h-screen w-full max-w-sm bg-[#031924] px-6 pt-6 pb-28">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="mt-8 text-4xl font-semibold">Transactions</h1>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-8 space-y-5">
          {transactions.map((item) => {
            const Icon = getTransactionIcon(item.category, item.merchant_name);
            const { wrapperClass, iconClass, amountClass } =
              getTransactionStyles(item.category, item.transaction_type);

            return (
              <div key={item.id} className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${wrapperClass}`}
                  >
                    <Icon size={18} className={iconClass} strokeWidth={2.1} />
                  </div>

                  <div>
                    <p className="text-xl font-semibold leading-none">
                      {item.merchant_name}
                    </p>
                    <p className="mt-1 text-xs text-white/40">{item.category}</p>
                    <p className="mt-1 text-[11px] text-white/30">
                      {formatTransactionDate(item.transaction_date)}
                    </p>
                  </div>
                </div>

                <p className={`text-base font-semibold ${amountClass}`}>
                  {formatTransactionAmount(item.amount, item.transaction_type)}
                </p>
              </div>
            );
          })}

          {transactions.length === 0 && !error && (
            <p className="text-sm text-white/50">No transactions found.</p>
          )}
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}