"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface Survey {
  id: number;
  value: number;
  created_at: string;
}

// Konversi angka ke emot + label
const valueToEmotAndLabel = (val: number) => {
  switch (val) {
    case 1: return { emot: "😡", label: "Sangat Buruk" };
    case 2: return { emot: "😕", label: "Buruk" };
    case 3: return { emot: "😐", label: "Biasa Saja" };
    case 4: return { emot: "😊", label: "Baik" };
    case 5: return { emot: "🤩", label: "Sangat Baik" };
    default: return { emot: "❓", label: "Tidak Diketahui" };
  }
};

// Motivasi berdasarkan nilai
const motivationText = (val: number) => {
  switch (val) {
    case 1: return "Terima kasih sudah memberi masukan — kami akan berbenah lebih baik 💙";
    case 2: return "Masukanmu berarti! Kami terus memperbaiki demi kamu 🌱";
    case 3: return "Not bad! Kami akan membuat pengalamanmu lebih baik lagi ✨";
    case 4: return "Senang kamu puas! Kami akan terus mempertahankannya 😊💙";
    case 5: return "Kamu keren! Terima kasih sudah menyebarkan energi positif 🤩🌟";
    default: return "Terima kasih sudah mengisi survei!";
  }
};

export default function ResultsPage() {
  const [latest, setLatest] = useState<Survey | null>(null);
  const [stars, setStars] = useState<number[]>([]);

  // Generate bintang animasi
  const generateStars = () => {
    const arr = Array.from({ length: 20 }, () => Math.random());
    setStars(arr);
  };

  useEffect(() => {
    generateStars();

    const fetchLatest = async () => {
      const { data } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) setLatest(data[0]);
    };

    fetchLatest();
  }, []);

  if (!latest)
    return <p className="text-center mt-20 text-lg">Memuat hasil...</p>;

  const result = valueToEmotAndLabel(latest.value);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 overflow-hidden px-4">

      {/* ⭐ Bintang bergerak */}
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 text-2xl"
          initial={{ opacity: 0, x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 }}
          animate={{
            opacity: [0, 1, 0],
            y: ["0%", "-150%"],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Kartu Hasil */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 text-center max-w-md"
      >
        <div className="text-6xl mb-3">{result.emot}</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          {result.label}
        </h1>

        <p className="text-gray-600 mt-3 text-md leading-relaxed">
          {motivationText(latest.value)}
        </p>

        <p className="text-xs text-gray-400 mt-4">
          Terakhir diisi: {new Date(latest.created_at).toLocaleString()}
        </p>
      </motion.div>
    </div>
  );
}
