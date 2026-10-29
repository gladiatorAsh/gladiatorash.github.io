import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/portfolio";

// Route handler (not the `opengraph-image` file convention) so the static export writes `og.png`
// with a real extension — GitHub Pages picks the Content-Type from it, which social crawlers require.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };
const fontDir = join(process.cwd(), "node_modules/@fontsource");
const stages = ["request", "orchestrator", "retrieve", "verify"];

const paper = "#d6d7d3";
const ink = "#16181a";
const graphite = "#565b5f";
const rule = "#a9aba7";

export async function GET() {
  const [sans, sansMedium, mono] = await Promise.all([
    readFile(join(fontDir, "hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff")),
    readFile(join(fontDir, "hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff")),
    readFile(join(fontDir, "martian-mono/files/martian-mono-latin-400-normal.woff"))
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: paper,
          color: ink,
          fontFamily: "Hanken"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", borderTop: `2px solid ${ink}`, paddingTop: 18 }}>
          <div style={{ fontSize: 150, lineHeight: 0.9, letterSpacing: -8, fontWeight: 400 }}>{profile.name}</div>
          <div style={{ marginTop: 26, fontFamily: "Martian", fontSize: 22, color: graphite }}>
            Applied AI engineer. Retrieval, agents and the platforms around them.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {stages.map((stage, index) => (
              <div key={stage} style={{ display: "flex", alignItems: "center" }}>
                {index > 0 ? <div style={{ width: 36, height: 1, background: rule }} /> : null}
                <div
                  style={{
                    display: "flex",
                    padding: "10px 16px",
                    border: `1px solid ${index === 2 ? ink : rule}`,
                    background: index === 2 ? ink : paper,
                    color: index === 2 ? paper : ink,
                    fontFamily: "Martian",
                    fontSize: 20
                  }}
                >
                  {stage}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 26, fontWeight: 500 }}>ashutoshysingh.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hanken", data: sans, weight: 400, style: "normal" },
        { name: "Hanken", data: sansMedium, weight: 500, style: "normal" },
        { name: "Martian", data: mono, weight: 400, style: "normal" }
      ]
    }
  );
}
