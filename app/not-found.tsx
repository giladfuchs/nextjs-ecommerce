"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">404 - עמוד לא נמצא</h1>
      <p className="text-lg mb-8">העמוד שחיפשת לא קיים.</p>
      <Link href="/" className="text-blue-500 underline">
        חזור לעמוד הבית
      </Link>
    </div>
  );
}
