"use client";

export default function HoroscopeCard({
  title,
  content,
  onSave,
}: { title: string; content: string; onSave?: () => void }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-700">{content}</p>
      {onSave && (
        <button onClick={onSave} className="mt-4 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90">
          Save report
        </button>
      )}
    </div>
  );
}
