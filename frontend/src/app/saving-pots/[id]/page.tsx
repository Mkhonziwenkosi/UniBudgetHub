"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, PiggyBank, Users } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type PotData = {
  id: number;
  title: string;
  target_amount: string;
  description: string | null;
  created_at: string;
  total_saved: string;
  members_count: string;
};

type MemberData = {
  user_id: number;
  full_name: string;
};

type ContributionData = {
  id: number;
  user_id: number;
  full_name: string;
  amount: string;
  contribution_date: string;
};

type SavingPotDetailResponse = {
  pot: PotData;
  members: MemberData[];
  contributions: ContributionData[];
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

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function SavingPotDetailPage() {
  const router = useRouter();
  const params = useParams();
  const potId = params.id;

  const [pot, setPot] = useState<PotData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPotDetail = async () => {
      try {
        const response = await fetch(`/api/saving-pots/${potId}`);
        const data: SavingPotDetailResponse | { error: string } =
          await response.json();

        if (response.ok) {
          const result = data as SavingPotDetailResponse;
          setPot(result.pot);
          setMembers(result.members);
          setContributions(result.contributions);
          setError("");
        } else {
          setError("error" in data ? data.error : "Failed to load saving pot.");
        }
      } catch {
        setError("Failed to load saving pot.");
      }
    };

    if (potId) {
      fetchPotDetail();
    }
  }, [potId]);

  const progress = pot ? getProgress(pot.total_saved, pot.target_amount) : 0;

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        {error && (
          <p className="relative z-10 mt-8 text-sm text-red-400">{error}</p>
        )}

        {pot && (
          <>
            <div className="relative z-10 mt-8 rounded-3xl bg-white/5 p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <PiggyBank size={30} className="text-[#1E73FF]" />
              </div>

              <h1 className="mt-4 text-3xl font-semibold">{pot.title}</h1>
              <p className="mt-2 text-sm text-white/55">
                {pot.description || "Shared savings goal"}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/45">
                    Total Saved
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white/95">
                    {formatCurrency(pot.total_saved)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-white/45">
                    Target
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white/95">
                    {formatCurrency(pot.target_amount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-[#1E73FF]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                <Users size={14} />
                <span>{pot.members_count} members</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white/95">Members</p>
                <p className="text-xs text-white/45">{members.length} total</p>
              </div>

              <div className="mt-4 space-y-3">
                {members.map((member) => (
                  <div
                    key={member.user_id}
                    className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/85"
                  >
                    {member.full_name}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white/95">
                  Contributions
                </p>
                <p className="text-xs text-white/45">
                  {contributions.length} entries
                </p>
              </div>

              <div className="mt-4 space-y-4">
                {contributions.map((contribution) => (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-white/90">
                        {contribution.full_name}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {formatDate(contribution.contribution_date)}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#1E73FF]">
                      {formatCurrency(contribution.amount)}
                    </p>
                  </div>
                ))}

                {contributions.length === 0 && (
                  <p className="text-sm text-white/50">
                    No contributions yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        <AppFooterNav />
      </div>
    </main>
  );
}