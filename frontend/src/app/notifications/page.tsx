"use client";

import { useState } from "react";
import { ArrowLeft, Bell, ShieldCheck, Wallet, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type NotificationItemProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function NotificationItem({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
          <Icon size={18} className="text-white/85" />
        </div>

        <div>
          <p className="text-base font-medium text-white/90">{title}</p>
          <p className="mt-1 text-sm text-white/45">{description}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${
          enabled ? "bg-[#1E73FF]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [budgetEnabled, setBudgetEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(false);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="relative mx-auto min-h-screen w-full max-w-sm overflow-hidden bg-[#031924] px-6 pt-6 pb-28">
        <div className="pointer-events-none absolute -right-28 top-36 h-96 w-96 rounded-full bg-cyan-700/10 blur-3xl" />

        <button onClick={() => router.back()} className="relative z-10 text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="relative z-10 mt-8 text-4xl font-semibold">
          Notifications
        </h1>

        <p className="relative z-10 mt-3 text-sm text-white/55">
          Manage which updates and alerts you want to receive.
        </p>

        <div className="relative z-10 mt-8 space-y-4">
          <NotificationItem
            icon={Bell}
            title="Push Notifications"
            description="Receive alerts for important account activity."
            enabled={pushEnabled}
            onToggle={() => setPushEnabled(!pushEnabled)}
          />

          <NotificationItem
            icon={ShieldCheck}
            title="Security Alerts"
            description="Be notified of login attempts and account changes."
            enabled={securityEnabled}
            onToggle={() => setSecurityEnabled(!securityEnabled)}
          />

          <NotificationItem
            icon={Wallet}
            title="Budget Reminders"
            description="Get reminders to stay on track with your spending."
            enabled={budgetEnabled}
            onToggle={() => setBudgetEnabled(!budgetEnabled)}
          />

          <NotificationItem
            icon={CreditCard}
            title="Card Activity"
            description="Get alerts whenever your card is used."
            enabled={cardEnabled}
            onToggle={() => setCardEnabled(!cardEnabled)}
          />
        </div>

        <AppFooterNav />
      </div>
    </main>
  );
}