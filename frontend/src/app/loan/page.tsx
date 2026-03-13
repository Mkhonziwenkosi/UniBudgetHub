"use client";

import { ArrowLeft, HandCoins, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

const loanOptions = [
  { title: "Short-Term Loan", subtitle: "Borrow up to £500" },
  { title: "Tuition Support", subtitle: "Flexible student repayment" },
  { title: "Emergency Cash", subtitle: "Fast approval for urgent needs" },
];

export default function LoanPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">Loan</h1>

        <div className="relative z-10 mt-8 rounded-3xl bg-white/5 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <HandCoins size={30} className="text-[#1E73FF]" />
          </div>

          <h2 className="mt-4 text-2xl font-semibold">Borrow Smarter</h2>
          <p className="mt-2 text-sm text-white/60">
            Explore student-friendly loan options designed to support your budget.
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          {loanOptions.map((option) => (
            <button
              key={option.title}
              className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 text-left"
            >
              <div>
                <p className="text-base font-medium text-white/90">
                  {option.title}
                </p>
                <p className="mt-1 text-sm text-white/45">{option.subtitle}</p>
              </div>
              <ChevronRight size={18} className="text-white/45" />
            </button>
          ))}
        </div>

        <button className="relative z-10 mt-8 w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold">
          Apply Now
        </button>

        <AppFooterNav />
      </div>
    </main>
  );
}