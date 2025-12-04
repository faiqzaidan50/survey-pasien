"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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

export default function StatsPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // ⭐ floating stars
  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 6 + Math.random() * 10,
    }));
    setStars(generatedStars);
  }, []);

  // 🌠 shooting stars
  useEffect(() => {
    const generated = Array.from({ length: 5 }).map(() => ({
      top: Math.random() * 100,
      delay: Math.random() * 8,
    }));
    setShootingStars(generated);
  }, []);

  // fetch data survei
  useEffect(() => {
    const fetchSurveys = async () => {
      const { data, error } = await supabase.from("surveys").select("*");
      if (!error) setSurveys(data || []);
      setLoading(false);
    };
    fetchSurveys();
  }, []);

  // count kategori
  const counts = {
    1: surveys.filter(s => s.value === 1).length,
    2: surveys.filter(s => s.value === 2).length,
    3: surveys.filter(s => s.value === 3).length,
    4: surveys.filter(s => s.value === 4).length,
    5: surveys.filter(s => s.value === 5).length,
  };

  const chartData = [
    { name: "😡", count: counts[1] },
    { name: "😕", count: counts[2] },
    { name: "😐", count: counts[3] },
    { name: "🙂", count: counts[4] },
    { name: "😄", count: counts[5] },
  ];

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">

      {/* BACKGROUND GRADIENT */}
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
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
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

      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Statistik Kepuasan Pasien
      </h1>

      {/* BACK BUTTON */}
      <div className="text-center mb-4">
        <Link
          href="/history"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
        >
          ← Kembali ke Riwayat
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading grafik...</p>
      ) : (
        <div className="w-full h-72 md:h-96 bg-white/70 backdrop-blur-md rounded-xl shadow p-4 ring-1 ring-white/40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
          opacity: 0.9;
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
 