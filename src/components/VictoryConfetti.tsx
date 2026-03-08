"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface VictoryConfettiProps {
  active: boolean;
}

function getDocumentSize() {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  const { body, documentElement } = document;
  return {
    width: documentElement.clientWidth,
    height: Math.max(
      window.innerHeight,
      body.scrollHeight,
      body.offsetHeight,
      documentElement.scrollHeight,
      documentElement.offsetHeight,
    ),
  };
}

export function VictoryConfetti({ active }: VictoryConfettiProps) {
  const [{ width, height }, setViewport] = useState(getDocumentSize);

  useEffect(() => {
    function updateViewport() {
      setViewport(getDocumentSize());
    }

    const frame = window.requestAnimationFrame(updateViewport);
    const resizeObserver = new ResizeObserver(() => updateViewport());

    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", updateViewport);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const frame = window.requestAnimationFrame(() => {
      setViewport(getDocumentSize());
    });
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  if (!active || width === 0 || height === 0) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={500}
      recycle={false}
      gravity={0.22}
      tweenDuration={12000}
      className="pointer-events-none absolute inset-x-0 top-0 z-50"
    />
  );
}
