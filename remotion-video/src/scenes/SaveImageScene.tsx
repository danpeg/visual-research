import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
} from "remotion";

const MENU_ITEMS = [
  "Open image in new tab",
  "Save image as...",
  "Copy image",
  "Copy image address",
  "Inspect",
];

export const SaveImageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Context menu appears
  const menuSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  // Highlight "Save image as..." after a beat
  const highlightFrame = 35;
  const isHighlighted = frame >= highlightFrame;

  // Click effect
  const clickFrame = 50;
  const clicked = frame >= clickFrame;

  // Flash on click
  const clickFlash = clicked
    ? interpolate(frame, [clickFrame, clickFrame + 8], [1, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Click sound */}
      <Sequence from={clickFrame} durationInFrames={10}>
        <Audio src="https://remotion.media/mouse-click.wav" volume={0.4} />
      </Sequence>

      {/* Background "image" being right-clicked */}
      <div
        style={{
          width: 1200,
          height: 700,
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Fake brand image */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 64,
              fontWeight: 800,
              color: "#e2c6a4",
              letterSpacing: -2,
            }}
          >
            anthropic
          </div>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              color: "rgba(255,255,255,0.3)",
              marginTop: 12,
            }}
          >
            Brand Guidelines — Full Logo Lockup
          </div>
        </div>

        {/* Context menu */}
        <div
          style={{
            position: "absolute",
            left: 580,
            top: 280,
            backgroundColor: "#292929",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "4px 0",
            minWidth: 220,
            opacity: menuSpring,
            transform: `scale(${interpolate(menuSpring, [0, 1], [0.9, 1])})`,
            transformOrigin: "top left",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          }}
        >
          {MENU_ITEMS.map((item, i) => {
            const isSaveItem = i === 1;
            return (
              <div
                key={item}
                style={{
                  padding: "8px 16px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: isSaveItem && isHighlighted ? "#fff" : "#d4d4d4",
                  backgroundColor:
                    isSaveItem && isHighlighted
                      ? clicked
                        ? "#1a73e8"
                        : "#4285f4"
                      : "transparent",
                  borderRadius: isSaveItem && isHighlighted ? 3 : 0,
                  margin: isSaveItem && isHighlighted ? "0 4px" : 0,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Cursor near context menu */}
        <div
          style={{
            position: "absolute",
            left: 576,
            top: 276,
            width: 0,
            height: 0,
            borderLeft: "12px solid white",
            borderRight: "12px solid transparent",
            borderBottom: "18px solid transparent",
            filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))",
            transform: isHighlighted
              ? `translate(10px, ${30}px)`
              : "translate(0, 0)",
          }}
        />

        {/* Click flash overlay */}
        {clickFlash > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: `rgba(255,255,255,${clickFlash * 0.15})`,
            }}
          />
        )}
      </div>

      {/* Counter */}
      {clicked && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            right: 200,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 16,
            color: "#3fb950",
            opacity: interpolate(frame, [clickFrame, clickFrame + 10], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          ✓ 1 of 47 images saved
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontFamily: "Inter, sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Save each image one by one...
      </div>
    </AbsoluteFill>
  );
};
