"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  CircleDollarSign,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type ContactData = {
  id: number;
  full_name: string;
  email: string;
};

function getFirstName(fullName: string) {
  return fullName.trim().split(" ")[0] || fullName;
}

export default function RequestMoneyPage() {
  const router = useRouter();

  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [payerName, setPayerName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        const data: ContactData[] | { error: string } = await response.json();

        if (response.ok) {
          setContacts(data as ContactData[]);
          setError("");
        } else {
          setError("error" in data ? data.error : "Failed to load contacts.");
        }
      } catch {
        setError("Failed to load contacts.");
      }
    };

    fetchContacts();
  }, []);

  const handleSelectContact = (contact: ContactData) => {
    setPayerName(contact.full_name);
    setEmail(contact.email);
  };

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-white">
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-xl font-semibold">Request Money</h1>

          <div className="text-xs text-white/50">UBH</div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6">
          <p className="mb-3 text-sm text-white/70">Quick Select</p>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {contacts.map((person) => (
              <button
                key={person.id}
                onClick={() => handleSelectContact(person)}
                className="flex w-14 flex-col items-center"
                >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <UserCircle2 size={28} className="text-white/80" />
                </div>
                <span className="mt-2 text-[10px] text-white/60">
                  {getFirstName(person.full_name)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <label className="mb-2 block text-sm text-white/90">Payer Name</label>
            <div className="flex items-center border-b border-white/20 pb-3">
              <User size={18} className="mr-3 text-white/70" />
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/90">Email Address</label>
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
            <label className="mb-2 block text-sm text-white/90">Description</label>
            <div className="flex items-center border-b border-white/20 pb-3">
              <CircleDollarSign size={18} className="mr-3 text-white/70" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm text-white/90">Monthly Due By</label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="border-b border-white/20 bg-transparent pb-3 text-center text-sm text-white/90 outline-none placeholder:text-white/35"
              />
              <input
                type="text"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border-b border-white/20 bg-transparent pb-3 text-center text-sm text-white/90 outline-none placeholder:text-white/35"
              />
              <input
                type="text"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border-b border-white/20 bg-transparent pb-3 text-center text-sm text-white/90 outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-5">
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

          <button className="w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold">
            Request Money
          </button>
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}