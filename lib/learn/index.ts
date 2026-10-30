import { mcp } from "./mcp";
import { mcpExtensions } from "./mcp-extensions";
import { contextEngineering } from "./context-engineering";
import { a2a } from "./a2a";
import { agentEvals } from "./agent-evals";
import { agentObservability } from "./agent-observability";
import { agentSecurity } from "./agent-security";
import type { LearnPath } from "./types";

/** In suggested order: protocol first, then building, then running agents in production. */
export const learnPaths: LearnPath[] = [mcp, mcpExtensions, contextEngineering, a2a, agentEvals, agentObservability, agentSecurity];

export function getLearnPath(slug: string) {
  return learnPaths.find((p) => p.slug === slug);
}
