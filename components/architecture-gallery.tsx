"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeDollarSign, Gauge, Lock, Minus, Plus, ShieldCheck } from "lucide-react";
import { architectureCards } from "@/lib/portfolio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ArchitectureGallery() {
  const [selectedId, setSelectedId] = useState(architectureCards[0].id);
  const [nodeIndex, setNodeIndex] = useState(0);
  const selected = useMemo(() => architectureCards.find((item) => item.id === selectedId) ?? architectureCards[0], [selectedId]);
  const node = selected.nodes[nodeIndex] ?? selected.nodes[0];
  const diagramRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  // Only animate the flow while the diagram is actually visible.
  useEffect(() => {
    const el = diagramRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { rootMargin: "0px 0px -10% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Choose a system" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] xl:grid xl:grid-cols-5 xl:overflow-visible">
        {architectureCards.map((item) => {
          const Icon = item.icon;
          const active = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSelectedId(item.id);
                setNodeIndex(0);
              }}
              className={cn(
                "spotlight focus-ring flex shrink-0 items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-semibold transition",
                active ? "border-azure/60 bg-azure/10 text-white" : "border-white/10 bg-card/70 text-slate-300 hover:border-azure/40 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                  active ? "border-azure/50 bg-azure text-[#fff]" : "border-white/10 bg-white/5 text-azure-light"
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="leading-5">{item.title}</span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-azure-light">Interactive System Diagram</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{selected.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{selected.summary}</p>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
          <div
            ref={diagramRef}
            data-live={live ? "" : undefined}
            className="code-grid relative border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r"
          >
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-azure-light opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-azure-light" />
                </span>
                Live flow
              </span>
              <span>Select a stage</span>
            </div>
            {/* key resets the packet animation whenever a different system is selected */}
            <ol key={selected.id} aria-label={`${selected.title} pipeline stages`}>
              {selected.nodes.map((item, index) => {
                const isActive = index === nodeIndex;
                return (
                  <li key={item.name}>
                    {index > 0 ? (
                      <div aria-hidden="true" className="flow-link">
                        <span className="flow-packet" style={{ "--i": index - 1 } as React.CSSProperties} />
                      </div>
                    ) : null}
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setNodeIndex(index)}
                      className={cn(
                        "focus-ring group flex w-full items-start gap-4 rounded-lg border p-3 text-left transition",
                        isActive
                          ? "border-azure/70 bg-azure/12 shadow-[0_0_30px_rgba(0,120,212,0.16)]"
                          : "border-white/10 bg-background/85 hover:border-azure/50"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        style={{ "--i": index } as React.CSSProperties}
                        className={cn(
                          "flow-node-pulse flex h-10 w-10 shrink-0 items-center justify-center rounded-md border font-mono text-xs",
                          isActive ? "border-azure-light bg-azure text-[#fff]" : "border-white/15 bg-card text-slate-300"
                        )}
                      >
                        0{index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                          <ArrowRight
                            aria-hidden="true"
                            className={cn("h-4 w-4 shrink-0 transition", isActive ? "text-azure-light" : "text-slate-400 group-hover:translate-x-0.5")}
                          />
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">{item.purpose}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <div aria-live="polite" className="p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-azure-light">Stage 0{nodeIndex + 1} of {selected.nodes.length}</p>
            <h4 className="mt-1 font-display text-xl font-semibold text-white">{node.name}</h4>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <Detail label="Purpose" value={node.purpose} />
              <Detail label="Why chosen" value={node.why} />
              <Detail label="Alternatives" value={node.alternatives.join(", ")} />
            </dl>
            <div className="mt-5 grid gap-3 2xl:grid-cols-2">
              <Insight icon={Plus} label="Pros" text={node.pros.join("; ")} />
              <Insight icon={Minus} label="Cons" text={node.cons.join("; ")} />
              <Insight icon={Gauge} label="Performance" text={node.performance} />
              <Insight icon={BadgeDollarSign} label="Cost" text={node.cost} />
              <Insight icon={ShieldCheck} label="Security" text={node.security} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-300">{value}</dd>
    </div>
  );
}

function Insight({ icon: Icon, label, text }: { icon: typeof Lock; label: string; text: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className="h-4 w-4 text-azure-light" />
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}
