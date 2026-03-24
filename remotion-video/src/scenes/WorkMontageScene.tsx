import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
} from "remotion";

const TASKS = [
  { label: "Screenshot homepage", icon: "📸", color: "#1f6feb" },
  { label: "Extract YouTube thumbnails", icon: "🎬", color: "#f85149" },
  { label: "Scrape agency case studies", icon: "🔍", color: "#d29922" },
  { label: "Download press kit assets", icon: "📦", color: "#3fb950" },
  { label: "Analyze color palette", icon: "🎨", color: "#a371f7" },
  { label: "Map typography system", icon: "Aa", color: "#79c0ff" },
  { label: "Vision analysis on 12 images", icon: "👁", color: "#f0883e" },
  { label: "Compile 13-section audit", icon: "📝", color: "#58a6ff" },
];

const COLOR_SWATCHES = [
  { hex: "#d4a27f", name: "Warm Sand" },
  { hex: "#1a1a2e", name: "Deep Navy" },
  { hex: "#e8d5b7", name: "Cream" },
  { hex: "#c9956b", name: "Copper" },
  { hex: "#f5f0eb", name: "Pearl" },
  { hex: "#8b7355", name: "Bronze" },
];

export const WorkMontageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Task checklist (0-80)
  // Phase 2: Color extraction (80-150)
  const phase = frame < 80 ? 1 : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
      {/* Whoosh SFX on scene start */}
      <Sequence from={0} durationInFrames={15}>
        <Audio src="https://remotion.media/whoosh.wav" volume={0.2} />
      </Sequence>

      {phase === 1 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Rapid task completion */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: 600,
            }}
          >
            {TASKS.map((task, i) => {
              const taskDelay = i * 8;
              const taskProgress = interpolate(
                frame,
                [taskDelay, taskDelay + 6],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const checkDelay = taskDelay + 6;
              const isChecked = frame >= checkDelay;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "10px 20px",
                    backgroundColor: isChecked
                      ? "rgba(63,185,80,0.1)"
                      : "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    border: `1px solid ${isChecked ? "#238636" : "#30363d"}`,
                    opacity: taskProgress,
                    transform: `translateX(${interpolate(taskProgress, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: isChecked ? "#238636" : "#21262d",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    {isChecked ? "✓" : ""}
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 16,
                      color: isChecked ? "#3fb950" : "#c9d1d9",
                      textDecoration: isChecked ? "line-through" : "none",
                    }}
                  >
                    {task.label}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 20 }}>{task.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Speed indicator */}
          <div
            style={{
              position: "absolute",
              top: 80,
              right: 120,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 48,
              fontWeight: 700,
              color: "#58a6ff",
              opacity: interpolate(frame, [10, 20], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {Math.min(TASKS.length, Math.floor(frame / 8))}/{TASKS.length}
          </div>
        </AbsoluteFill>
      )}

      {phase === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Color extraction visualization */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#8b949e",
                textTransform: "uppercase",
                letterSpacing: 4,
                opacity: interpolate(frame - 80, [0, 10], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Extracting Color Palette
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              {COLOR_SWATCHES.map((swatch, i) => {
                const swatchDelay = 80 + 5 + i * 6;
                const swatchSpring = spring({
                  frame: frame - swatchDelay,
                  fps,
                  config: { damping: 15, stiffness: 200 },
                });

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      opacity: swatchSpring,
                      transform: `translateY(${interpolate(swatchSpring, [0, 1], [30, 0])}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        backgroundColor: swatch.hex,
                        borderRadius: 12,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 13,
                        color: "#c9d1d9",
                      }}
                    >
                      {swatch.hex}
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        color: "#8b949e",
                      }}
                    >
                      {swatch.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Analysis output */}
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 13,
                color: "#8b949e",
                textAlign: "center",
                lineHeight: 1.8,
                opacity: interpolate(frame - 80, [40, 50], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Gemini Vision → 12 images analyzed<br />
              6 dominant colors extracted<br />
              Typography: Whyte, GT America, Söhne
            </div>
          </div>
        </AbsoluteFill>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Inter, sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {phase === 1 ? "Hours of manual work..." : "...done in minutes"}
      </div>
    </AbsoluteFill>
  );
};
