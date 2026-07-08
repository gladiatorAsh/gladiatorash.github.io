"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
