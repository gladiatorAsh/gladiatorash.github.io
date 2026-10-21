import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/portfolio";

// Route handler (not the `opengraph-image` file convention) so the static export writes `og.png`
// with a real extension — GitHub Pages picks the Content-Type from it, which social crawlers require.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules/@fontsource");
const stages = ["Ingest", "Retrieve", "Reason", "Validate"];

export async function GET() {
  const [display, body, bodyBold] = await Promise.all([
    readFile(join(fontDir, "bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff")),
    readFile(join(fontDir, "inter/files/inter-latin-400-normal.woff")),
    readFile(join(fontDir, "inter/files/inter-latin-600-normal.woff"))
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
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 85% 0%, rgba(0,120,212,0.35), transparent 55%), radial-gradient(circle at 100% 100%, rgba(74,163,240,0.14), transparent 45%), #0b1120",
          color: "#cbd5e1",
          fontFamily: "Inter"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 6, color: "#4aa3f0", textTransform: "uppercase" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#4aa3f0", boxShadow: "0 0 18px #4aa3f0" }} />
          {profile.title}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Bricolage", fontSize: 112, lineHeight: 1, letterSpacing: -4, color: "#ffffff" }}>{profile.name}</div>
          <div style={{ marginTop: 28, fontSize: 34, lineHeight: 1.35, maxWidth: 900, color: "#cbd5e1" }}>
            Enterprise AI systems: RAG, document intelligence, and agentic workflows on Azure.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {stages.map((stage, index) => (
              <div key={stage} style={{ display: "flex", alignItems: "center" }}>
                {index > 0 ? <div style={{ width: 44, height: 2, background: "rgba(74,163,240,0.55)" }} /> : null}
                <div
                  style={{
                    display: "flex",
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: index === 1 ? "2px solid #4aa3f0" : "2px solid rgba(255,255,255,0.14)",
                    background: index === 1 ? "rgba(0,120,212,0.22)" : "rgba(17,24,39,0.85)",
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: 600
                  }}
                >
                  {stage}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 26, color: "#94a3b8" }}>ashutoshysingh.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 700, style: "normal" },
        { name: "Inter", data: body, weight: 400, style: "normal" },
        { name: "Inter", data: bodyBold, weight: 600, style: "normal" }
      ]
    }
  );
}
