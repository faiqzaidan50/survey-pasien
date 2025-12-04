"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

interface Survey {
  id: number;
  value: number;
  created_at: string;
}

const valueToEmot = (val: number) => {
  if (val >= 4.5) return "😄";
  if (val >= 3.5) return "🙂";
  if (val >= 2.5) return "😐";
  if (val >= 1.5) return "😕";
  return "😡";
};

const emotLabels: Record<number, string> = {
  1: "Marah",
  2: "Kurang puas",
  3: "Biasa saja",
  4: "Senang",
  5: "Sangat puas",
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

export default function HomePage() {
  const router = useRouter();
  const [showThankYou, setShowThankYou] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [average, setAverage] = useState(0);

  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [clicked, setClicked] = useState<number | null>(null);

  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      size: 2 + Math.random() * 3,
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const generated = Array.from({ length: 5 }).map(() => ({
      top: Math.random() * 100,
      delay: Math.random() * 8,
    }));
    setShootingStars(generated);
  }, []);

  const fetchSurveys = async () => {
    const { data, error } = await supabase.from("surveys").select("*");
    if (!error && data) {
      setSurveys(data as Survey[]);
      const avg =
        data.length > 0
          ? data.reduce((sum, s) => sum + s.value, 0) / data.length
          : 0;
      setAverage(avg);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const sendSurvey = async (value: number) => {
    setClicked(value);

    setTimeout(() => setClicked(null), 500);

    await supabase.from("surveys").insert({ value });

    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 1500);

    fetchSurveys();

    // 🚀 Tambahan: setelah 1.5 detik, pindah ke halaman results
    setTimeout(() => {
      router.push(`/results?value=${value}`);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-gray-800 overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 animate-gradient-move -z-20"></div>

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

      <button
        className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full shadow-lg transition-all duration-300"
        onClick={() => router.push("/history")}
      >
        Riwayat
      </button>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-blue-700">
        Survey Kepuasan Pasien
      </h1>

      <p className="mb-6 text-center text-lg md:text-xl text-pink-600">
        "Suara Anda sangat berarti untuk meningkatkan layanan kami 💖"
      </p>

      {surveys.length > 0 && (
        <div className="text-center mb-6 text-xl md:text-2xl font-semibold text-gray-700">
          Rata-rata Kepuasan:{" "}
          <span className="text-3xl">{valueToEmot(average)}</span>{" "}
          {average.toFixed(1)}
        </div>
      )}

      <div className="flex gap-8">
        {[1, 2, 3, 4, 5].map((val) => (
          <div key={val} className="flex flex-col items-center">
            <button
              onClick={() => sendSurvey(val)}
              className={`text-5xl md:text-6xl transition-transform relative
                ${clicked === val ? "scale-150 animate-click-pop" : "hover:scale-125"}
              `}
            >
              {val === 1 && "😡"}
              {val === 2 && "😕"}
              {val === 3 && "😐"}
              {val === 4 && "🙂"}
              {val === 5 && "😄"}
            </button>

            <span className="mt-2 text-sm md:text-base text-gray-800">
              {emotLabels[val]}
            </span>
          </div>
        ))}
      </div>

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
        }
        @keyframes scaleFade {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

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
          opacity: 0.7;
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

        .animate-click-pop {
          animation: clickPop 0.35s ease;
        }
        @keyframes clickPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
