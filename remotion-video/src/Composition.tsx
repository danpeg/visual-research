import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ opacity, textAlign: "center" }}>
        <h1 style={{ fontSize: 80, margin: 0, fontWeight: 700 }}>
          Hello from Remotion
        </h1>
        <p style={{ fontSize: 32, color: "#666", marginTop: 20 }}>
          Frame {frame}
        </p>
      </div>
    </AbsoluteFill>
  );
};
