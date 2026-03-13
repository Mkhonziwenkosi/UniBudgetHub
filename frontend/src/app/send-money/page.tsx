"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, UserCircle2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type CardData = {
  card_holder_name: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  balance: string;
};

type DashboardResponse = {
  card: CardData;
};

type ContactData = {
  id: number;
  full_name: string;
  email: string;
};

function getFirstName(fullName: string) {
  return fullName.trim().split(" ")[0] || fullName;
}

export default function SendMoneyPage() {
  const router = useRouter();
  const [card, setCard] = useState<CardData | null>(null);
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [amount, setAmount] = useState("100.00");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, contactsResponse] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/contacts"),
        ]);

        const dashboardData: DashboardResponse | { error: string } =
          await dashboardResponse.json();
        const contactsData: ContactData[] | { error: string } =
          await contactsResponse.json();

        if (dashboardResponse.ok) {
          setCard((dashboardData as DashboardResponse).card);
        }

        if (contactsResponse.ok) {
          setContacts(contactsData as ContactData[]);
        }

        if (!dashboardResponse.ok) {
          setError(
            "error" in dashboardData ? dashboardData.error : "Failed to load card."
          );
        } else if (!contactsResponse.ok) {
          setError(
            "error" in contactsData ? contactsData.error : "Failed to load contacts."
          );
        }
      } catch {
        setError("Failed to load page data.");
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-white">
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-xl font-semibold">Send Money</h1>

          <div className="text-xs text-white/50">UBH</div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#2F3192] px-5 pt-5 pb-5 shadow-2xl">
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

            <div className="mt-7 flex justify-end">
              <div className="flex items-center">
                <div className="h-7 w-7 rounded-full bg-[#EB001B]" />
                <div className="-ml-3 h-7 w-7 rounded-full bg-[#F79E1B]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white/5 p-4">
          <p className="text-sm text-white/70">Send to</p>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            <div className="flex w-14 flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Plus size={20} className="text-[#1E73FF]" />
              </div>
              <span className="mt-2 text-[10px] text-white/60">Add</span>
            </div>

            {contacts.map((person) => {
              const isSelected = selectedContactId === person.id;

              return (
                <button
                  key={person.id}
                  onClick={() => setSelectedContactId(person.id)}
                  className="flex w-14 flex-col items-center"
              >
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                      isSelected ? "bg-[#1E73FF]/20" : "bg-white/10"
                    }`}
                  >
                    <UserCircle2 size={28} className="text-white/80" />

                    {isSelected && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1E73FF]">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-[10px] text-white/60">
                    {getFirstName(person.full_name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/45">Enter Your Amount</p>
            <button className="text-xs text-[#FF5B7F]">Change Currency?</button>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-semibold">GBP</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-4xl font-semibold outline-none"
            />
          </div>
        </div>

        <button className="mt-8 w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold">
          Send Money
        </button>

        <AppFooterNav />
      </div>
    </main>
  );
}