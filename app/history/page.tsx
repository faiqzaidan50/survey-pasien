"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Survey {
  id: number;
  value: number;
  created_at: string;
}

// Helper: angka → emot + keterangan
const valueToEmotAndLabel = (val: number) => {
  switch (val) {
    case 1: return { emot: "😡", label: "Kecewa" };
    case 2: return { emot: "😕", label: "Kurang Puas" };
    case 3: return { emot: "😐", label: "Netral" };
    case 4: return { emot: "🙂", label: "Puas" };
    case 5: return { emot: "😄", label: "Sangat Puas" };
    default: return { emot: "❓", label: "Tidak Diketahui" };
  }
};

// Helper: angka → emot saja (untuk rata-rata)
const valueToEmot = (val: number) => {
  if (val >= 4.5) return "😄";
  if (val >= 3.5) return "🙂";
  if (val >= 2.5) return "😐";
  if (val >= 1.5) return "😕";
  return "😡";
};

export default function HistoryPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching surveys:", error.message);
      else setSurveys(data as Survey[]);

      setLoading(false);
    };

    fetchSurveys();
  }, []);

  // Hitung rata-rata
  const average =
    surveys.length > 0
      ? surveys.reduce((sum, s) => sum + s.value, 0) / surveys.length
      : 0;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Riwayat Survei Pasien
      </h1>

      {/* Rata-rata */}
      {surveys.length > 0 && (
        <div className="text-center mb-8 text-xl md:text-2xl font-semibold text-gray-700">
          Rata-rata Kepuasan: <span className="text-3xl">{valueToEmot(average)}</span> {average.toFixed(1)}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : surveys.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada survei yang diisi.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {surveys.map((survey, index) => {
            const { emot, label } = valueToEmotAndLabel(survey.value);
            return (
              <li
                key={survey.id}
                className="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center transition-transform duration-300 animate-fade-in hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-yellow-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-5xl mb-2">{emot}</span>
                <span className="font-medium text-gray-700 mb-1">{label}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(survey.created_at).toLocaleString("id-ID")}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to { opacity: 1; transform: scale(1); }
          from { opacity: 0; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}
