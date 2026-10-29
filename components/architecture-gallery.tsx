"use client";

import { useMemo, useState } from "react";
import { architectureCards } from "@/lib/portfolio";

/** Pick a system, then a stage; the right panel explains the tradeoffs for that stage. */
export function ArchitectureGallery() {
  const [selectedId, setSelectedId] = useState(architectureCards[0].id);
  const [nodeIndex, setNodeIndex] = useState(0);
  const selected = useMemo(() => architectureCards.find((item) => item.id === selectedId) ?? architectureCards[0], [selectedId]);
  const node = selected.nodes[nodeIndex] ?? selected.nodes[0];

  return (
    <div>
      <div role="group" aria-label="Choose a system" className="flex flex-wrap">
        {architectureCards.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selectedId}
            onClick={() => {
              setSelectedId(item.id);
              setNodeIndex(0);
            }}
            className="key-btn -mb-px -mr-px"
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="mt-8 grid border border-rule">
        <div className="border-b border-rule p-5 sm:p-7">
          <p className="measure m-0 text-graphite">{selected.summary}</p>
          <ol key={selected.id} className="mt-7 list-none p-0" aria-label={`${selected.title} stages`}>
            {selected.nodes.map((item, index) => {
              const active = index === nodeIndex;
              return (
                <li key={item.name} className="relative">
                  {index > 0 ? <span aria-hidden="true" className="ml-[1.05rem] block h-5 w-px bg-rule" /> : null}
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setNodeIndex(index)}
                    className={`grid w-full grid-cols-[2.2rem_1fr] items-start gap-3 border p-3 text-left transition-colors ${
                      active ? "border-ink bg-paper-2" : "border-rule hover:border-ink"
                    }`}
                  >
                    <span className={`mono grid h-8 w-8 place-items-center border ${active ? "border-ink bg-ink text-paper" : "border-rule"}`}>
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-medium">{item.name}</span>
                      <span className="mt-0.5 block text-[0.9rem] leading-snug text-graphite">{item.purpose}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div aria-live="polite" className="p-5 sm:p-7">
          <p className="mono m-0 text-graphite">
            Stage {nodeIndex + 1} of {selected.nodes.length}
          </p>
          <h3 className="mt-1 text-2xl font-medium tracking-[-0.025em]">{node.name}</h3>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Detail label="Why this" value={node.why} wide />
            <Detail label="Alternatives considered" value={node.alternatives.join(", ")} wide />
            <Detail label="Pros" value={node.pros.join("; ")} />
            <Detail label="Cons" value={node.cons.join("; ")} />
            <Detail label="Performance" value={node.performance} />
            <Detail label="Cost" value={node.cost} />
            <Detail label="Security" value={node.security} wide />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="mono text-graphite">{label}</dt>
      <dd className="m-0 mt-1 leading-snug">{value}</dd>
    </div>
  );
}
