"use client";
import { useRouter } from "next/navigation";


export default function SurveyEmoji() {
const router = useRouter();


const options = [
{ value: 1, label: "😡", text: "Sangat Tidak Puas" },
{ value: 2, label: "😕", text: "Tidak Puas" },
{ value: 3, label: "😐", text: "Biasa Saja" },
{ value: 4, label: "😊", text: "Puas" },
{ value: 5, label: "🤩", text: "Sangat Puas" },
];


const handleClick = (value: number) => {
router.push(`/results?rating=${value}`);
};


return (
<div className="grid grid-cols-5 gap-4 text-5xl">
{options.map((opt) => (
<button
key={opt.value}
className="hover:scale-110 transition-transform p-2 rounded-xl bg-sky-50 border border-sky-100 shadow-sm"
onClick={() => handleClick(opt.value)}
>
{opt.label}
</button>
))}
</div>
);
}