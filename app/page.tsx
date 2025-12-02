"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

interface Survey {
  id: number;
  value: number;
  created_at: string;
}

// Helper: angka → emot
const valueToEmot = (val: number) => {
  if (val >= 4.5) return "😄";
  if (val >= 3.5) return "🙂";
  if (val >= 2.5) return "😐";
  if (val >= 1.5) return "😕";
  return "😡";
};

export default function HomePage() {
  const router = useRouter();
  const [showThankYou, setShowThankYou] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [average, setAverage] = useState(0);

  // Fetch data untuk menghitung rata-rata
  const fetchSurveys = async () => {
    const { data, error } = await supabase
      .from("surveys")
      .select("*");

    if (!error && data) {
      setSurveys(data as Survey[]);
      const avg =
        data.length > 0
          ? (data.reduce((sum, s) => sum + s.value, 0) / data.length)
          : 0;
      setAverage(avg);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const sendSurvey = async (value: number) => {
    await supabase.from("surveys").insert({ value });
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);

    // Update rata-rata setelah submit
    fetchSurveys();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 px-4">
      {/* Tombol Riwayat */}
      <button
        className="absolute top-6 right-6 bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => router.push("/history")}
      >
        Riwayat
      </button>

      {/* Judul Survey */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-blue-700">
        Survey Kepuasan Pasien
      </h1>

      {/* Rata-rata live */}
      {surveys.length > 0 && (
        <div className="text-center mb-6 text-xl md:text-2xl font-semibold text-gray-700">
          Rata-rata Kepuasan: <span className="text-3xl">{valueToEmot(average)}</span> {average.toFixed(1)}
        </div>
      )}

      {/* Emoticons */}
      <div className="flex gap-6">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            className="text-5xl md:text-6xl hover:scale-125 transition-transform"
            onClick={() => sendSurvey(val)}
          >
            {val === 1 && "😡"}
            {val === 2 && "😕"}
            {val === 3 && "😐"}
            {val === 4 && "🙂"}
            {val === 5 && "😄"}
          </button>
        ))}
      </div>

      {/* Notifikasi */}
      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-xl text-lg animate-scale-fade">
            Terimakasih telah mengisi survei ini!
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-scale-fade {
          animation: scaleFade 0.4s ease forwards;
          opacity: 0;
          transform: scale(0.8);
        }
        @keyframes scaleFade {
          to { opacity: 1; transform: scale(1); }
          from { opacity: 0; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
