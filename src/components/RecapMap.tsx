"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import USAMap from "react-usa-map";
import { GuessResult } from "../lib/gameLogic";
import { STATE_ABBREVIATIONS } from "../lib/stateAbbreviations";

type TooltipState = {
  name: string;
  x: number;
  y: number;
} | null;

const TOOLTIP_OFFSET_X = 14;
const HOVER_TOOLTIP_OFFSET_Y = 18;
const TAP_TOOLTIP_OFFSET_Y = 28;
const TOOLTIP_PADDING = 10;

export function RecapMap({ guesses }: { guesses: GuessResult[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [mapWidth, setMapWidth] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const customize: Record<string, { fill: string }> = {};
  const stateNamesByAbbr = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(STATE_ABBREVIATIONS).map(([name, abbr]) => [abbr, name])
      ) as Record<string, string>,
    []
  );

  guesses.forEach((g) => {
    const abbr = STATE_ABBREVIATIONS[g.state.name];
    if (!abbr) return;
    customize[abbr] = { fill: g.isWin ? "#2f8f68" : "#ab4747" };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    function updateWidth() {
      if (!containerRef.current) return;
      setMapWidth(Math.min(containerRef.current.clientWidth, 900));
    }

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    svg.querySelectorAll("title").forEach((node) => node.remove());

    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function resolveStateName(target: Element) {
      const abbr = target.getAttribute("data-name");
      if (!abbr) return null;
      if (abbr === "DC") return "District of Columbia";
      return stateNamesByAbbr[abbr] ?? abbr;
    }

    function getTooltipPoint(clientX: number, clientY: number, yOffset: number) {
      const rect = container.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current?.offsetWidth ?? 140;
      const tooltipHeight = tooltipRef.current?.offsetHeight ?? 36;
      const unclampedX = clientX - rect.left + TOOLTIP_OFFSET_X;
      const unclampedY = clientY - rect.top - yOffset;

      return {
        x: Math.max(
          TOOLTIP_PADDING,
          Math.min(unclampedX, rect.width - tooltipWidth - TOOLTIP_PADDING)
        ),
        y: Math.max(
          TOOLTIP_PADDING,
          Math.min(unclampedY, rect.height - tooltipHeight - TOOLTIP_PADDING)
        ),
      };
    }

    function showTooltip(target: Element, clientX: number, clientY: number, yOffset: number) {
      const name = resolveStateName(target);
      if (!name) return;
      const point = getTooltipPoint(clientX, clientY, yOffset);
      setTooltip({ name, x: point.x, y: point.y });
    }

    function handlePointerEnter(event: Event) {
      if (!supportsHover || !(event instanceof PointerEvent)) return;
      const target = event.currentTarget;
      if (!(target instanceof Element)) return;
      showTooltip(target, event.clientX, event.clientY, HOVER_TOOLTIP_OFFSET_Y);
    }

    function handlePointerMove(event: Event) {
      if (!supportsHover || !(event instanceof PointerEvent)) return;
      const target = event.currentTarget;
      if (!(target instanceof Element)) return;
      showTooltip(target, event.clientX, event.clientY, HOVER_TOOLTIP_OFFSET_Y);
    }

    function handlePointerLeave() {
      if (supportsHover) setTooltip(null);
    }

    function handleClick(event: Event) {
      if (!(event instanceof MouseEvent)) return;
      const target = event.currentTarget;
      if (!(target instanceof Element)) return;
      if (supportsHover && event.detail !== 0) return;
      showTooltip(target, event.clientX, event.clientY, TAP_TOOLTIP_OFFSET_Y);
    }

    function handleDocumentPointerDown(event: PointerEvent) {
      if (!container.contains(event.target as Node)) {
        setTooltip(null);
      }
    }

    const stateElements = Array.from(container.querySelectorAll("[data-name]"));
    stateElements.forEach((element) => {
      element.addEventListener("pointerenter", handlePointerEnter);
      element.addEventListener("pointermove", handlePointerMove);
      element.addEventListener("pointerleave", handlePointerLeave);
      element.addEventListener("click", handleClick);
    });
    document.addEventListener("pointerdown", handleDocumentPointerDown);

    return () => {
      stateElements.forEach((element) => {
        element.removeEventListener("pointerenter", handlePointerEnter);
        element.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerleave", handlePointerLeave);
        element.removeEventListener("click", handleClick);
      });
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
    };
  }, [guesses, mapWidth, stateNamesByAbbr]);

  const width = mapWidth || 320;
  const height = Math.round(width * 0.63);

  return (
    <div ref={containerRef} className="relative mt-4 flex w-full max-w-4xl flex-col items-center">
      <p className="text-md text-stone-900 text-center">Your guesses</p>
      <div className="w-full overflow-hidden">
        <USAMap customize={customize} defaultFill="#262322" width={width} height={height} />
      </div>
      {tooltip && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-10 rounded-full border border-stone-700 bg-stone-950/95 px-3 py-1 text-sm font-semibold text-stone-100 shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
