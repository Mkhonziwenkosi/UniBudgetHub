import Image from "next/image";
import Link from "next/link";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#031924]">

      <StatusBar />

      <div className="flex-1 flex items-center justify-center px-6">
        <Image
          src="/logo.png"
          alt="UniBudgetHub Logo"
          width={340}
          height={340}
          priority
        />
      </div>

      <div className="px-6 pb-10">
        <Link
          href="/signin"
          className="block w-full rounded-xl bg-[#1E73FF] py-4 text-center text-white font-semibold"
        >
          Sign In
        </Link>
      </div>

    </main>
  );
}