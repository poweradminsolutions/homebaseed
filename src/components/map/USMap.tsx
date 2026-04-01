"use client";

import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { states, regulationColors, regulationLabels } from "@/data/states";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// FIPS code to state abbreviation mapping
const fipsToAbbr: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "12": "FL", "13": "GA",
  "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD",
  "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO",
  "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ",
  "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
  "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC",
  "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT",
  "51": "VA", "53": "WA", "54": "WV", "55": "WI", "56": "WY",
  "11": "DC",
};

const stateMap = new Map(states.map((s) => [s.abbreviation, s]));

function USMapInner() {
  const router = useRouter();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getStateFill = (abbr: string, isHovered: boolean) => {
    const state = stateMap.get(abbr);
    if (!state) return "#e5e7eb";
    const colors = regulationColors[state.regulationLevel];
    if (isHovered) {
      // Return a slightly darker shade on hover
      const darkerFills: Record<string, string> = {
        none: "#4ade80",
        low: "#86efac",
        moderate: "#fde047",
        high: "#fca5a5",
      };
      return darkerFills[state.regulationLevel] || colors.fill;
    }
    return colors.fill;
  };

  const handleClick = (abbr: string) => {
    const state = stateMap.get(abbr);
    if (state) {
      router.push(`/states/${state.slug}`);
    }
  };

  return (
    <div className="w-full">
      <div
        className="relative"
        onMouseMove={(e) => {
          setTooltipPos({ x: e.clientX, y: e.clientY });
        }}
      >
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={800}
          height={500}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const fips = geo.id;
                const abbr = fipsToAbbr[fips] || "";
                const state = stateMap.get(abbr);
                const isHovered = hoveredState === abbr;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateFill(abbr, isHovered)}
                    stroke="#ffffff"
                    strokeWidth={0.75}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      setHoveredState(abbr);
                      if (state) {
                        const level = regulationLabels[state.regulationLevel];
                        setTooltipContent(`${state.name} - ${level}`);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredState(null);
                      setTooltipContent("");
                    }}
                    onClick={() => handleClick(abbr)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="fixed bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm pointer-events-none z-50"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 12,
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
        {(["none", "low", "moderate", "high"] as const).map((level) => {
          const colors = regulationColors[level];
          return (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{
                  backgroundColor: colors.fill,
                  borderColor: "#d1d5db",
                }}
              />
              <span className="text-sm text-muted">
                {regulationLabels[level]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile fallback: state dropdown */}
      <div className="mt-6 sm:hidden">
        <label htmlFor="state-select" className="block text-sm font-medium text-foreground mb-2">
          Or select your state:
        </label>
        <select
          id="state-select"
          className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              router.push(`/states/${e.target.value}`);
            }
          }}
        >
          <option value="" disabled>
            Choose a state...
          </option>
          {states.map((s) => (
            <option key={s.abbreviation} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export const USMap = memo(USMapInner);
