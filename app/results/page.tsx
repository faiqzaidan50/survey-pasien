"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import BackButton from "@/components/BackButton";


export default function ResultsPage() {
  const params = useSearchParams();
  const rating = params.get("rating");

  useEffect(() => {
    const saveToSupabase = async () => {
      if (!rating) return;

      await supabase.from("survey").insert({
        rating: Number(rating),
      });
    };

    saveToSupabase();
  }, [rating]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-blue-50 to-white">

      <BackButton />

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2 text-blue-700">Terima kasih! 🎉</h1>
        <p className="text-gray-600 mb-4">Kamu memberikan rating:</p>

        <div className="text-5xl mb-4">{rating}</div>

        <a
          href="/history"
          className="w-full block bg-blue-600 text-white py-2 rounded-xl font-semibold"
        >
          Lihat Riwayat Survei
        </a>
      </div>
    </div>
  );
}
