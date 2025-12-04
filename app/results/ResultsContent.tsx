"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const value = searchParams.get("value");

  const [stars, setStars] = useState<any[]>([]);
  const [shootingStars, setShootingStars] = useState<any[]>([]);

  // ⭐ Static stars
  useEffect(() => {
    const generated = Array.from({ length: 25 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 6,
    }));
    setStars(generated);
  }, []);

  // 🌠 Shooting stars
  useEffect(() => {
    const generated = Array.from({ length: 4 }).map(() => ({
      top: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setShootingStars(generated);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 text-gray-900 overflow-hidden">

      {/* Background Soft Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 -z-20 animate-bg-flow" />

      {/* ⭐ Static Stars */}
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

      {/* 🌠 Shooting Stars */}
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

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-purple-700 drop-shadow-lg animate-fade-slide">
        Terima Kasih! ⭐
      </h1>

      {/* Score Display */}
      <p className="text-xl md:text-2xl mt-4 text-gray-800 animate-fade-delay">
        Anda memberi nilai:
      </p>

      <div className="mt-4 text-6xl md:text-7xl animate-pop">
        <span>{value}</span>
      </div>

      {/* Motivational Message */}
      <p className="mt-6 text-lg md:text-xl max-w-xl text-gray-700 font-medium animate-fade-delay2">
        “Masukan Anda sangat berarti bagi kami.  
        Dengan setiap klik, Anda membantu meningkatkan kualitas layanan untuk semua.” 💖
      </p>

      {/* BACK TO HOME BUTTON */}
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-10 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white rounded-full shadow-xl text-lg font-medium transition-all animate-fade-delay3"
      >
        ⬅️ Kembali ke Home
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        .animate-bg-flow {
          background-size: 300% 300%;
          animation: bgFlow 12s ease infinite;
        }
        @keyframes bgFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-fade-slide {
          animation: fadeSlide 0.8s ease forwards;
          opacity: 0;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-delay {
          animation: fadeIn 1s ease forwards;
          opacity: 0;
          animation-delay: 0.4s;
        }
        .animate-fade-delay2 {
          animation: fadeIn 1s ease forwards;
          opacity: 0;
          animation-delay: 0.8s;
        }
        .animate-fade-delay3 {
          animation: fadeIn 1s ease forwards;
          opacity: 0;
          animation-delay: 1.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-pop {
          animation: pop 0.5s ease forwards;
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.7;
          animation: starFloat ease-in-out infinite;
        }
        @keyframes starFloat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        .shooting-star {
          position: absolute;
          left: -20%;
          width: 140px;
          height: 2px;
          background: white;
          opacity: 0.9;
          border-radius: 50px;
          filter: drop-shadow(0 0 6px white);
          animation: shoot 2.5s linear infinite;
        }
        @keyframes shoot {
          0% { transform: translateX(0) rotate(20deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(160vw) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
