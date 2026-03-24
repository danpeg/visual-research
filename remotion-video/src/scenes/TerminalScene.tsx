import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
} from "remotion";

const COMMAND = "/visual-research anthropic";
const CHARS_PER_FRAME = 0.4; // ~12 chars/sec at 30fps

export const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom in animation
  const scale = interpolate(frame, [0, 30], [0.85, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Start typing after a brief pause
  const typingStart = 20;
  const typingFrame = Math.max(0, frame - typingStart);
  const charsVisible = Math.min(
    COMMAND.length,
    Math.floor(typingFrame * CHARS_PER_FRAME)
  );
  const displayedText = COMMAND.slice(0, charsVisible);
  const isTyping = charsVisible < COMMAND.length && frame >= typingStart;
  const isDone = charsVisible >= COMMAND.length;

  // Cursor blink (visible during pause, solid while typing)
  const cursorVisible = isTyping || Math.floor(frame / 15) % 2 === 0;

  // "Running..." text appears after typing is done
  const doneFrame = typingStart + Math.ceil(COMMAND.length / CHARS_PER_FRAME);
  const showRunning = frame > doneFrame + 15;

  // Progress bar animation
  const progressStart = doneFrame + 30;
  const progress = interpolate(frame, [progressStart, progressStart + 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase labels
  const phases = ["Discover", "Capture", "Extract", "Analyze", "Package"];
  const phaseIndex = Math.min(4, Math.floor(progress / 20));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
      }}
    >
      {/* Typing sound effects */}
      {Array.from({ length: COMMAND.length }).map((_, i) => {
        const charFrame = typingStart + Math.ceil(i / CHARS_PER_FRAME);
        return (
          <Sequence key={i} from={charFrame} durationInFrames={5}>
            <Audio
              src="https://remotion.media/mouse-click.wav"
              volume={0.15}
              playbackRate={1.5 + Math.random() * 0.5}
            />
          </Sequence>
        );
      })}

      {/* Enter key sound */}
      {isDone && (
        <Sequence from={doneFrame + 5} durationInFrames={10}>
          <Audio src="https://remotion.media/switch.wav" volume={0.3} />
        </Sequence>
      )}

      {/* Terminal window */}
      <div
        style={{
          width: 1100,
          backgroundColor: "#161b22",
          borderRadius: 12,
          border: "1px solid #30363d",
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: "#21262d",
            borderBottom: "1px solid #30363d",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f85149" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#d29922" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#3fb950" }} />
          <span
            style={{
              marginLeft: 12,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
              color: "#8b949e",
            }}
          >
            claude — visual-research
          </span>
        </div>

        {/* Terminal content */}
        <div style={{ padding: "24px 28px", minHeight: 280 }}>
          {/* Prompt line */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 18,
                color: "#d4a574",
                marginRight: 8,
              }}
            >
              $
            </span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 18,
                color: "#c9d1d9",
                letterSpacing: 0.5,
              }}
            >
              {displayedText}
            </span>
            {!isDone && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 22,
                  backgroundColor: "#d4a574",
                  marginLeft: 1,
                }}
              />
            )}
          </div>

          {/* Output after command runs */}
          {showRunning && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 14,
                  color: "#58a6ff",
                  marginBottom: 12,
                }}
              >
                ● Visual Research — Anthropic
              </div>

              {/* Phase progress */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {phases.map((phase, i) => {
                  const isActive = i === phaseIndex;
                  const isComplete = i < phaseIndex;
                  return (
                    <div
                      key={phase}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 4,
                        backgroundColor: isComplete
                          ? "#238636"
                          : isActive
                          ? "#1f6feb"
                          : "#21262d",
                        color: isComplete || isActive ? "#fff" : "#8b949e",
                        transition: "none",
                      }}
                    >
                      {isComplete ? "✓ " : ""}
                      {phase}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: 4,
                  backgroundColor: "#21262d",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: "#58a6ff",
                    borderRadius: 2,
                  }}
                />
              </div>

              {/* Status text */}
              {frame > progressStart && (
                <div
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 13,
                    color: "#8b949e",
                    marginTop: 12,
                  }}
                >
                  {phaseIndex === 0 && "Searching for agency relationships..."}
                  {phaseIndex === 1 && "Capturing brand touchpoints..."}
                  {phaseIndex === 2 && "Extracting images from APIs..."}
                  {phaseIndex === 3 && "Running vision analysis..."}
                  {phaseIndex === 4 && "Packaging HTML report..."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontFamily: "Inter, sans-serif",
          fontSize: 20,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {isDone ? "But what does it actually do?" : "One command. That's it."}
      </div>
    </AbsoluteFill>
  );
};
