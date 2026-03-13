"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import AppFooterNav from "@/components/AppFooterNav";

type SearchResult = {
  id: number;
  merchant_name: string;
  category: string;
  amount: string;
  transaction_type: "income" | "expense";
};

export default function SearchPage() {

  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const searchTransactions = async () => {

      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {

        setLoading(true);

        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();

        if (res.ok) {
          setResults(data.results || []);
        }

      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }

    };

    const debounce = setTimeout(searchTransactions, 300);

    return () => clearTimeout(debounce);

  }, [query]);

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />

      <div className="mx-auto min-h-screen w-full max-w-sm bg-[#031924] px-6 pt-6 pb-28">

        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={22} />
        </button>

        <h1 className="mt-8 text-4xl font-semibold">
          Search
        </h1>

        {/* Search Input */}

        <div className="mt-8 flex items-center rounded-2xl bg-white/10 px-4 py-3">

          <Search size={18} className="text-white/60 mr-3" />

          <input
            type="text"
            placeholder="Search transactions or contacts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder:text-white/50"
          />

        </div>

        {/* Results */}

        <div className="mt-8 space-y-4">

          {loading && (
            <p className="text-sm text-white/50">
              Searching...
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-sm text-white/50">
              No results found.
            </p>
          )}

          {!loading && results.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-white/10 p-4"
            >

              <div>
                <p className="text-sm font-semibold">
                  {item.merchant_name}
                </p>

                <p className="text-xs text-white/50">
                  {item.category}
                </p>
              </div>

              <p
                className={`text-sm font-semibold ${
                  item.transaction_type === "income"
                    ? "text-[#1976FF]"
                    : "text-white/80"
                }`}
              >
                {item.transaction_type === "income" ? "+" : "-"}£
                {Number(item.amount).toFixed(2)}
              </p>

            </div>

          ))}

          {!query && (
            <p className="text-sm text-white/50">
              Start typing to search transactions or contacts.
            </p>
          )}

        </div>

        <AppFooterNav />

      </div>
    </main>
  );
}