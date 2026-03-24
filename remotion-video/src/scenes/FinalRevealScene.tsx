import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
} from "remotion";

const REPORT_SECTIONS = [
  "TL;DR",
  "Quick Facts",
  "Positioning",
  "Brand Identity",
  "Brand Evolution",
  "Brand in Practice",
  "Digital Experience",
  "Assessment",
  "Brand Personality",
  "Social Strategy",
  "Campaigns",
];

export const FinalRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Report card flies in (0-60)
  // Phase 2: Scroll through sections (60-140)
  // Phase 3: URL reveal (140-180)

  const cardEntry = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Scroll position
  const scrollY = interpolate(frame, [60, 140], [0, -600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL bar typing
  const urlRevealStart = 140;
  const urlText = "anthropic-research.pages.dev";
  const urlChars = Math.min(
    urlText.length,
    Math.max(0, Math.floor((frame - urlRevealStart) * 0.8))
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
      {/* Ding SFX on reveal */}
      <Sequence from={5} durationInFrames={15}>
        <Audio src="https://remotion.media/ding.wav" volume={0.3} />
      </Sequence>

      {/* Glowing backdrop */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(88,166,255,0.1) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Report card container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 900,
            height: 560,
            backgroundColor: "#ffffff",
            borderRadius: 12,
            overflow: "hidden",
            transform: `scale(${interpolate(cardEntry, [0, 1], [0.8, 1])})`,
            opacity: cardEntry,
            boxShadow: "0 30px 100px rgba(88,166,255,0.2), 0 10px 40px rgba(0,0,0,0.5)",
            position: "relative",
          }}
        >
          {/* Simulated report header */}
          <div
            style={{
              position: "relative",
              height: 200,
              background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 60px",
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            {/* CE bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 32,
                backgroundColor: "#CC0000",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Curious Endeavor — Visual Research
              </span>
            </div>

            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 48,
                fontWeight: 800,
                color: "#fff",
                marginTop: 20,
              }}
            >
              Anthropic
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.6)",
                marginTop: 4,
              }}
            >
              Visual Identity Research — March 2026
            </div>
          </div>

          {/* Scrolling content area */}
          <div
            style={{
              position: "relative",
              transform: `translateY(${scrollY}px)`,
            }}
          >
            {/* TL;DR section */}
            <div style={{ padding: "24px 60px" }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "#CC0000",
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                TL;DR
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  color: "#1a1a1a",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                Anthropic has built a visual identity that feels like a research paper
                crossed with a luxury brand — restrained, intellectual, and deliberately
                understated in a sea of tech maximalism.
              </div>
            </div>

            {/* Section pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                padding: "16px 60px",
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >
              {REPORT_SECTIONS.map((section, i) => (
                <div
                  key={section}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    color: i === 0 ? "#fff" : "#666",
                    backgroundColor: i === 0 ? "#1a1a2e" : "#f5f5f5",
                    padding: "4px 12px",
                    borderRadius: 20,
                  }}
                >
                  {section}
                </div>
              ))}
            </div>

            {/* Quick facts grid */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                margin: "20px 60px",
                backgroundColor: "#eee",
              }}
            >
              {[
                { label: "Founded", value: "2021" },
                { label: "HQ", value: "San Francisco" },
                { label: "Employees", value: "1,000+" },
                { label: "Valuation", value: "$61.5B" },
                { label: "Agency", value: "In-house" },
                { label: "Primary Font", value: "Whyte" },
                { label: "Brand Age", value: "~3 years" },
                { label: "Model", value: "Claude" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  style={{
                    flex: "1 1 22%",
                    backgroundColor: "#fff",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    {fact.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 10,
                      color: "#999",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Color palette section */}
            <div style={{ padding: "20px 60px" }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "#CC0000",
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Brand Identity
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["#d4a27f", "#1a1a2e", "#e8d5b7", "#c9956b", "#f5f0eb", "#8b7355"].map(
                  (color) => (
                    <div
                      key={color}
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: color,
                        borderRadius: 6,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Brand in practice grid placeholder */}
            <div style={{ padding: "20px 60px" }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "#CC0000",
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Brand in Practice
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 125,
                      height: 125,
                      backgroundColor: [
                        "#e8d5b7", "#c9d5e8", "#d5e8c9",
                        "#e8c9d5", "#c9e8d5", "#d5c9e8",
                      ][i],
                      borderRadius: 4,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* URL reveal at bottom */}
      {frame >= urlRevealStart && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 22,
              color: "#58a6ff",
              opacity: interpolate(frame, [urlRevealStart, urlRevealStart + 10], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {urlText.slice(0, urlChars)}
            {urlChars < urlText.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 24,
                  backgroundColor: "#58a6ff",
                  marginLeft: 1,
                  verticalAlign: "text-bottom",
                }}
              />
            )}
          </div>
          {urlChars >= urlText.length && (
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                opacity: interpolate(
                  frame,
                  [urlRevealStart + 40, urlRevealStart + 50],
                  [0, 1],
                  { extrapolateRight: "clamp" }
                ),
              }}
            >
              From command to deliverable — powered by Claude Code
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
