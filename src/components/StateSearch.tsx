"use client";

import { useState } from "react";
import Image from "next/image";
import { State } from "../lib/gameLogic";

const STATE_PICS_FOLDER = "state-pics";
const STATE_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const;

interface StateSearchProps {
  value: string;
  remaining: State[];
  onChange: (value: string) => void;
  onSubmit: (name: string) => void;
  disabled?: boolean;
}

function stateImagePath(name: string, ext: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `/${STATE_PICS_FOLDER}/${slug}${ext}`;
}

function StateThumb({ name }: { name: string }) {
  const [extIndex, setExtIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const ext = STATE_IMAGE_EXTENSIONS[extIndex];
  const hasNext = extIndex + 1 < STATE_IMAGE_EXTENSIONS.length;

  if (failed || !ext) {
    return (
      <div
        className="w-12 h-12 flex-shrink-0"
        title={`Place image in public/${STATE_PICS_FOLDER}/ as ${name.toLowerCase().replace(/\s+/g, "-")}.png (or .jpg)`}
      />
    );
  }

  return (
    <Image
      src={stateImagePath(name, ext)}
      alt=""
      width={48}
      height={48}
      className="w-12 h-12 object-contain flex-shrink-0"
      onError={() => {
        if (hasNext) setExtIndex((i) => i + 1);
        else setFailed(true);
      }}
      unoptimized
    />
  );
}

export function StateSearch({ value, remaining, onChange, onSubmit, disabled }: StateSearchProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const query = value.trim().toLowerCase();
  const suggestions =
    query === ""
      ? []
      : remaining
          .filter((s) => {
            const nameLower = s.name.toLowerCase();
            const words = nameLower.split(/\s+/);
            return nameLower.startsWith(query) || words.some((w) => w.startsWith(query));
          })
          .slice(0, 12);

  // Ghost text: show first suggestion whose name starts with the typed value
  const ghostMatch =
    query !== "" ? suggestions.find((s) => s.name.toLowerCase().startsWith(query)) : undefined;
  const ghostText = ghostMatch ? value + ghostMatch.name.slice(value.length) : "";

  return (
    <div className={`relative w-full max-w-sm mb-6 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Ghost suggestion layer (behind) */}
      <div className="w-full px-3 py-2 text-base text-stone-400 pointer-events-none whitespace-nowrap overflow-hidden select-none border border-transparent rounded" aria-hidden="true">
        {ghostText || "\u00A0"}
      </div>
      <input
        value={value}
        placeholder="Type a state..."
        onChange={(e) => {
          onChange(e.target.value);
          setIsPickerOpen(true);
        }}
        onFocus={() => setIsPickerOpen(true)}
        onBlur={() => {
          // Let suggestion clicks land before closing.
          window.setTimeout(() => setIsPickerOpen(false), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab" && suggestions.length > 0) {
            e.preventDefault();
            onChange(suggestions[0].name);
          } else if (e.key === "Enter") {
            const exact = remaining.find(
              (s) => s.name.toLowerCase() === value.trim().toLowerCase()
            );
            if (exact) {
              onSubmit(exact.name);
              setIsPickerOpen(false);
            } else if (suggestions.length > 0) {
              onSubmit(suggestions[0].name);
              setIsPickerOpen(false);
            }
          }
        }}
        className="absolute inset-0 w-full px-3 py-2 text-base bg-white/30 text-stone-900 border border-stone-600 rounded outline-none placeholder-stone-500 focus:border-stone-900"
      />
      {isPickerOpen && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-80 overflow-y-auto bg-stone-900 border border-stone-700 rounded shadow-lg">
          {suggestions.map((s) => (
            <button
              key={s.name}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSubmit(s.name);
                setIsPickerOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-base text-white hover:bg-stone-800 cursor-pointer"
            >
              <StateThumb name={s.name} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
