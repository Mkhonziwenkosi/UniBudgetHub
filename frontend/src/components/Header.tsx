"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  title?: string;
  showBack?: boolean;
};

export default function Header({ title, showBack }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center px-6 pt-6">

      {showBack && (
        <button
          onClick={() => router.back()}
          className="text-white"
        >
          <ArrowLeft size={22} />
        </button>
      )}

      {title && (
        <h2 className="text-lg font-semibold ml-4">{title}</h2>
      )}

    </div>
  );
}