"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Gauge, Lock, Minus, Plus, ShieldCheck } from "lucide-react";
import { architectureCards } from "@/lib/portfolio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ArchitectureGallery() {
  const [selectedId, setSelectedId] = useState(architectureCards[0].id);
  const [nodeIndex, setNodeIndex] = useState(0);
  const selected = useMemo(() => architectureCards.find((item) => item.id === selectedId) ?? architectureCards[0], [selectedId]);
  const node = selected.nodes[nodeIndex] ?? selected.nodes[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {architectureCards.map((item) => {
          const Icon = item.icon;
          const active = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setNodeIndex(0);
              }}
              className={cn(
                "focus-ring group rounded-lg border p-5 text-left transition",
                active ? "border-azure/60 bg-azure/10" : "border-white/10 bg-card/70 hover:border-azure/40 hover:bg-white/5"
              )}
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-azure">
                <Icon className="h-5 w-5" />
              </span>
              <span className="block text-base font-semibold text-white">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-400">{item.summary}</span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-azure">Interactive System Diagram</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{selected.title}</h3>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
          <div className="code-grid relative min-h-[430px] border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <div className="absolute inset-x-8 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-azure/45 to-transparent sm:block" />
            <div className="grid h-full grid-cols-1 content-center gap-4 sm:grid-cols-2">
              {selected.nodes.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => setNodeIndex(index)}
                  className={cn(
                    "focus-ring relative rounded-lg border p-4 text-left transition",
                    index === nodeIndex ? "border-azure bg-azure/12 shadow-[0_0_30px_rgba(0,120,212,0.16)]" : "border-white/10 bg-background/82 hover:border-azure/50"
                  )}
                  whileHover={{ y: -4 }}
                  layout
                >
                  <span className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                    <ArrowRight className="h-4 w-4 text-azure" />
                  </span>
                  <span className="block text-sm font-semibold text-white">{item.name}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-400">{item.purpose}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <h4 className="text-xl font-semibold text-white">{node.name}</h4>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <Detail label="Purpose" value={node.purpose} />
              <Detail label="Why chosen" value={node.why} />
              <Detail label="Alternatives" value={node.alternatives.join(", ")} />
            </dl>
            <div className="mt-5 grid gap-3">
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
      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-300">{value}</dd>
    </div>
  );
}

function Insight({ icon: Icon, label, text }: { icon: typeof Lock; label: string; text: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className="h-4 w-4 text-azure" />
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}
