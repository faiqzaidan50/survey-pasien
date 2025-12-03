"use client";

import { useSearchParams } from "next/navigation";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const value = searchParams.get("value");

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-3xl font-bold text-green-600">Hasil Penilaian</h1>
      <p className="text-xl mt-4">
        Terima kasih! Anda memberi nilai: <strong>{value}</strong>
      </p>
    </div>
  );
}

