"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  UserCircle2,
  ArrowUp,
  ArrowDown,
  HandCoins,
  Upload,
  Apple,
  Music2,
  Film,
  Bus,
  Wallet,
  HeartPulse,
  UtensilsCrossed,
  ShoppingBasket,
  CreditCard,
} from "lucide-react";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type CardData = {
  card_holder_name: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  balance: string;
};

type TransactionData = {
  id: number;
  merchant_name: string;
  category: string;
  amount: string;
  transaction_type: "income" | "expense";
  transaction_date: string;
};

type DashboardResponse = {
  card: CardData;
  transactions: TransactionData[];
};

const actions = [
  { label: "Send", icon: ArrowUp, href: "/send-money" },
  { label: "Receive", icon: ArrowDown, href: "/request-money" },
  { label: "Loan", icon: HandCoins, href: "/loan" },
  { label: "Topup", icon: Upload, href: "/topup" },
];

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

export default function Dashboard() {
  const router = useRouter();
  const [card, setCard] = useState<CardData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data: DashboardResponse | { error: string } = await response.json();

        if (response.ok) {
          const dashboardData = data as DashboardResponse;
          setCard(dashboardData.card);
          setTransactions(dashboardData.transactions);
          setError("");
        } else {
          setError("error" in data ? data.error : "Failed to load dashboard.");
        }
      } catch {
        setError("Failed to load dashboard.");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-4 pb-28">
        <div className="pointer-events-none absolute -right-28 top-44 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40">
              <UserCircle2
                size={28}
                className="text-white/90"
                strokeWidth={1.8}
              />
            </div>

            <div className="leading-tight">
              <p className="text-xs text-white/45">Welcome back,</p>
              <h1 className="mt-0.5 text-2xl font-semibold">
                {card ? card.card_holder_name : "User"}
              </h1>
            </div>
          </div>

          <button
            onClick={() => router.push("/search")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <Search size={18} className="text-white/80" strokeWidth={2.2} />
          </button>
        </div>

        {error && (
          <p className="relative z-10 mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="relative z-10 mt-7 overflow-hidden rounded-3xl bg-[#2F3192] px-5 pt-5 pb-5 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-8 top-2 h-28 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -right-5 top-4 h-24 w-36 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 left-24 h-24 w-44 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="absolute inset-2.5 rounded-[1.25rem] bg-[#1D1D4F]/20" />

          <div className="relative z-10">
            <p className="mt-4 whitespace-nowrap text-2xl font-medium tracking-[0.14em] text-white/90">
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

        <div className="relative z-10 mt-7 grid grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <div key={action.label} className="flex flex-col items-center">
                <button
                  onClick={() => router.push(action.href)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10"
                >
                  <Icon size={20} className="text-white/80" strokeWidth={2.1} />
                </button>
                <span className="mt-2 text-xs text-white/60">
                  {action.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mt-8 rounded-2xl bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white/95">Savings Pots</p>
              <p className="mt-1 text-sm text-white/50">
                Save together for rent, groceries and more
              </p>
            </div>

            <button
              onClick={() => router.push("/saving-pots")}
              className="rounded-xl bg-[#1E73FF] px-4 py-2 text-sm font-medium"
            >
              Open
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Transaction</h2>
            <button
              onClick={() => router.push("/transactions")}
              className="text-sm font-medium text-[#1976FF]"
            >
              See All
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {transactions.map((item) => {
              const Icon = getTransactionIcon(item.category, item.merchant_name);
              const { wrapperClass, iconClass, amountClass } =
                getTransactionStyles(item.category, item.transaction_type);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${wrapperClass}`}
                    >
                      <Icon
                        size={18}
                        className={iconClass}
                        strokeWidth={2.1}
                      />
                    </div>

                    <div>
                      <p className="text-xl font-semibold leading-none">
                        {item.merchant_name}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {item.category}
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
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}