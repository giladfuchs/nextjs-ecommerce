"use client";

import { useState, useEffect } from "react";

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}%`;
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("grayscale", grayscale);
    document.documentElement.classList.toggle(
      "underline-links",
      underlineLinks,
    );
  }, [fontSize, highContrast, grayscale, underlineLinks]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        נגישות
      </button>
      {open && (
        <div className="mt-2 w-64 p-4 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-xl space-y-2">
          <div className="flex justify-between items-center">
            <span>גודל טקסט</span>
            <div className="space-x-2">
              <button
                onClick={() => setFontSize((s) => Math.max(80, s - 10))}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(200, s + 10))}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={() => setHighContrast(!highContrast)}
            />
            <span>ניגודיות גבוהה</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={grayscale}
              onChange={() => setGrayscale(!grayscale)}
            />
            <span>גווני אפור</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={underlineLinks}
              onChange={() => setUnderlineLinks(!underlineLinks)}
            />
            <span>קו תחתון לקישורים</span>
          </label>
        </div>
      )}
    </div>
  );
}
