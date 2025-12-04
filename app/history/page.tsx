"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Survey {
  id: number;
  value: number;
  created_at: string;
}

// Emot untuk rata-rata
const valueToEmot = (val: number) => {
  if (val >= 4.5) return "😄";
  if (val >= 3.5) return "🙂";
  if (val >= 2.5) return "😐";
  if (val >= 1.5) return "😕";
  return "😡";
};

// Emot + label untuk setiap rating
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

interface Star {
  left: number;
  top: number;
  size: number;
  duration: number;
}

interface ShootingStar {
  top: number;
  delay: number;
}

export default function HistoryPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // ⭐ Generate floating small stars
  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      size: 2 + Math.random() * 3,
    }));
    setStars(generatedStars);
  }, []);

  // 🌠 Generate shooting stars
  useEffect(() => {
    const generated = Array.from({ length: 5 }).map(() => ({
      top: Math.random() * 100,
      delay: Math.random() * 8,
    }));
    setShootingStars(generated);
  }, []);

  // Fetch survei
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSurveys(data as Survey[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Hitung rata-rata
  const average =
    surveys.length > 0
      ? surveys.reduce((sum, s) => sum + s.value, 0) / surveys.length
      : 0;

  return (
    <div className="relative min-h-screen p-6 overflow-hidden text-gray-800">

      {/* 🌈 BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 animate-gradient-move -z-20"></div>

      {/* ⭐ BINTANG KECIL */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDuration: `${star.duration}s`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* 🌠 SHOOTING STARS */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {shootingStars.map((s, i) => (
          <div
            key={i}
            className="shooting-star"
            style={{
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 🔙 TOMBOL BALIK */}
      <div className="mb-4 relative z-10">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-700 text-white rounded-xl shadow hover:bg-gray-900 transition"
        >
          ⬅️ Kembali ke Home
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-blue-700 relative z-10">
        Riwayat Survei Pasien
      </h1>

      {/* TOMBOL STATISTIK */}
      <div className="flex justify-center mb-6 relative z-10">
        <Link
          href="/history/stats"
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
        >
          📊 Lihat Grafik
        </Link>
      </div>

      {/* RATA-RATA */}
      {surveys.length > 0 && (
        <div className="text-center mb-8 text-xl md:text-2xl font-semibold text-gray-700 relative z-10">
          Rata-rata Kepuasan:{" "}
          <span className="text-4xl">{valueToEmot(average)}</span>{" "}
          {average.toFixed(1)}
        </div>
      )}

      {/* ======================= */}
      {/* LIST + REKAP EMOT */}
      {/* ======================= */}

      {loading ? (
        <p className="text-center text-gray-600 relative z-10">Loading...</p>
      ) : surveys.length === 0 ? (
        <p className="text-center text-gray-600 relative z-10">
          Belum ada survei yang diisi.
        </p>
      ) : (
        <>
          {/* LIST SURVEY */}
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
            {surveys.map((survey) => {
              const { emot, label } = valueToEmotAndLabel(survey.value);
              return (
                <li
                  key={survey.id}
                  className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow hover:shadow-xl transition hover:scale-105 ring-1 ring-white/40"
                >
                  <span className="text-5xl">{emot}</span>
                  <p className="font-semibold mt-2">{label}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(survey.created_at).toLocaleString("id-ID")}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* ======================= */}
          {/* ✨ REKAP VOTE PER EMOT */}
          {/* ======================= */}
          <div className="relative z-10 mt-12">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Rekap Jumlah Vote
            </h2>

            {(() => {
              // safe counts object with numeric keys
              const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

              for (const s of surveys) {
                const v = Number(s.value);
                // defensive: only count 1..5
                if (v >= 1 && v <= 5) counts[v] = (counts[v] ?? 0) + 1;
              }

              return (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const { emot, label } = valueToEmotAndLabel(val);
                    return (
                      <div
                        key={val}
                        className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow text-center ring-1 ring-white/40"
                      >
                        <div className="text-4xl">{emot}</div>
                        <p className="font-semibold mt-2">{label}</p>
                        <p className="text-gray-700 text-lg mt-1 font-bold">
                          {counts[val] ?? 0} vote
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* CSS ANIMASI */}
      <style jsx>{`
        .animate-gradient-move {
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.8;
          animation: floatStar linear infinite;
        }
        @keyframes floatStar {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }

        .shooting-star {
          position: absolute;
          left: -10%;
          width: 120px;
          height: 2px;
          background: white;
          opacity: 0.8;
          border-radius: 50px;
          animation: shoot 3s linear infinite;
          filter: drop-shadow(0 0 6px white);
        }
        @keyframes shoot {
          0% { transform: translateX(0) translateY(0) rotate(20deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(150vw) translateY(30px) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
