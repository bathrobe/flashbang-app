import { getLevelSvgLook } from "@/components/course/atomTokenLook";
import type { TodaySummary } from "@/server/queries/getTodaySummary";

const viewBoxSize = 240;
const circleRadius = 85; // the ring the points sit on
const pointRadius = 14;

// Where point number `index` of `count` sits: evenly spaced round the ring,
// the first at the top, going clockwise.
function getPointPosition(index: number, count: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / count;
  const centre = viewBoxSize / 2;
  return { x: centre + circleRadius * Math.cos(angle), y: centre + circleRadius * Math.sin(angle) };
}

// Today's atoms as numbered points on a circle, each in its level's look, with
// a line between two atoms that share an active question. Drawn by hand in
// SVG (no graph library); colours come from theme tokens through classes.
export function SessionMap({ map }: { map: TodaySummary["map"] }) {
  const positionById = new Map(
    map.nodes.map((node, index) => [node.atomId, getPointPosition(index, map.nodes.length)]),
  );

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl">Today&apos;s map</h2>
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="mx-auto w-full max-w-xs text-outline"
        role="img"
        aria-label={`${map.nodes.length} ideas reviewed today, with ${map.edges.length} lines between ideas that share a question`}
      >
        <g data-map-edges={map.edges.length}>
          {map.edges.map(([fromAtomId, toAtomId]) => {
            const from = positionById.get(fromAtomId)!;
            const to = positionById.get(toAtomId)!;
            return (
              <line
                key={`${fromAtomId}|${toAtomId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="currentColor"
                strokeWidth={2}
              />
            );
          })}
        </g>
        <g data-map-points={map.nodes.length}>
          {map.nodes.map((node, index) => {
            const { x, y } = positionById.get(node.atomId)!;
            const look = getLevelSvgLook(node.level);
            return (
              <g key={node.atomId}>
                <circle cx={x} cy={y} r={pointRadius} className={look.point} strokeWidth={3} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className={`font-number text-xs ${look.label}`}>
                  {index + 1}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* The legend: which number is which idea */}
      <ol className="flex flex-col gap-1 text-sm">
        {map.nodes.map((node, index) => (
          <li key={node.atomId} className="flex gap-2">
            <span className="font-number">{index + 1}.</span>
            <span>
              {node.sentence} <span className="text-ink-muted">(Level {node.level})</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
