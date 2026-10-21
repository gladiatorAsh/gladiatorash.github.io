/** Reading-progress bar driven entirely by CSS `animation-timeline: scroll()`. */
export function ScrollProgress() {
  return <div aria-hidden="true" className="scroll-progress fixed left-0 top-0 z-50 h-1 w-full origin-left bg-azure" />;
}
