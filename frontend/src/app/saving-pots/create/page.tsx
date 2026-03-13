"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type ContactData = {
  id: number;
  full_name: string;
  email: string;
};

export default function CreateSavingPotPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        const data = await response.json();

        if (response.ok) {
          setContacts(data);
        } else {
          setMessage(data.error || "Failed to load contacts.");
        }
      } catch {
        setMessage("Failed to load contacts.");
      }
    };

    fetchContacts();
  }, []);

  const toggleMember = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreatePot = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/saving-pots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          targetAmount,
          description,
          memberIds: selectedMembers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/saving-pots/${data.potId}`);
      } else {
        setMessage(data.error || "Failed to create saving pot.");
      }
    } catch {
      setMessage("Failed to create saving pot.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button
          onClick={() => router.back()}
          className="relative z-10 text-white"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">
          Create Pot
        </h1>

        <div className="relative z-10 mt-8 space-y-8">
          <div>
            <label className="mb-2 block text-sm text-white/90">
              Pot Title
            </label>
            <input
              type="text"
              placeholder="Groceries, Rent, Bills..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl bg-white/10 px-4 py-4 text-sm outline-none placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/90">
              Target Amount
            </label>
            <input
              type="text"
              placeholder="300.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full rounded-2xl bg-white/10 px-4 py-4 text-sm outline-none placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/90">
              Description
            </label>
            <textarea
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-28 w-full rounded-2xl bg-white/10 px-4 py-4 text-sm outline-none placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm text-white/90">
              Invite Members
            </label>
            <div className="space-y-3">
              {contacts.map((contact) => {
                const isSelected = selectedMembers.includes(contact.id);

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => toggleMember(contact.id)}
                    className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 text-left"
                  >
                    <div>
                      <p className="text-base font-medium text-white/90">
                        {contact.full_name}
                      </p>
                      <p className="mt-1 text-sm text-white/45">
                        {contact.email}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        isSelected ? "bg-[#1E73FF]" : "bg-white/10"
                      }`}
                    >
                      {isSelected && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {message && (
            <p className="text-center text-sm text-red-400">{message}</p>
          )}

          <button
            onClick={handleCreatePot}
            disabled={saving}
            className="w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Pot"}
          </button>
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}