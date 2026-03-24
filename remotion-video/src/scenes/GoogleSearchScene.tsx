import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const SEARCH_QUERY = "Anthropic brand identity design system";

const IMAGE_PLACEHOLDERS = [
  { color: "#d4a27f", label: "Logo" },
  { color: "#7fa8d4", label: "Website" },
  { color: "#a8d47f", label: "Brand Guide" },
  { color: "#d47fa8", label: "Color System" },
  { color: "#d4c97f", label: "Typography" },
  { color: "#7fd4c9", label: "App Design" },
  { color: "#c97fd4", label: "Marketing" },
  { color: "#d49e7f", label: "Social" },
  { color: "#7fd4a8", label: "Packaging" },
  { color: "#a87fd4", label: "Campaign" },
  { color: "#d47f7f", label: "Icon Set" },
  { color: "#7fc9d4", label: "Rebrand" },
];

export const GoogleSearchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser slides in
  const browserEntry = spring({ frame, fps, config: { damping: 200 } });

  // Typing the search query
  const typingChars = Math.min(
    SEARCH_QUERY.length,
    Math.floor(frame * 0.8)
  );
  const displayedQuery = SEARCH_QUERY.slice(0, typingChars);

  // Images appear with stagger
  const imagesStart = Math.ceil(SEARCH_QUERY.length / 0.8) + 10;

  // Mouse cursor position
  const cursorX = interpolate(frame, [imagesStart + 20, imagesStart + 50], [200, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [imagesStart + 20, imagesStart + 50], [250, 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 1200,
          height: 700,
          backgroundColor: "#ffffff",
          borderRadius: 12,
          overflow: "hidden",
          transform: `translateY(${interpolate(browserEntry, [0, 1], [40, 0])}px)`,
          opacity: browserEntry,
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            backgroundColor: "#f1f3f4",
            borderBottom: "1px solid #ddd",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ed6a5e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f5bf4f" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#61c454" }} />
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: "6px 16px",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#5f6368",
              border: "1px solid #ddd",
            }}
          >
            google.com/search?q={encodeURIComponent(displayedQuery)}
          </div>
        </div>

        {/* Search bar area */}
        <div style={{ padding: "20px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#4285f4",
                letterSpacing: -1,
              }}
            >
              G
              <span style={{ color: "#ea4335" }}>o</span>
              <span style={{ color: "#fbbc04" }}>o</span>
              <span style={{ color: "#4285f4" }}>g</span>
              <span style={{ color: "#34a853" }}>l</span>
              <span style={{ color: "#ea4335" }}>e</span>
            </span>
          </div>
          <div
            style={{
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 24,
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "#202124",
              marginBottom: 16,
              width: 500,
            }}
          >
            {displayedQuery}
            {typingChars < SEARCH_QUERY.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 18,
                  backgroundColor: "#4285f4",
                  marginLeft: 1,
                  verticalAlign: "text-bottom",
                }}
              />
            )}
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #ebebeb", paddingBottom: 8 }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#5f6368",
              }}
            >
              All
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#1a73e8",
                fontWeight: 600,
                borderBottom: "3px solid #1a73e8",
                paddingBottom: 5,
              }}
            >
              Images
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#5f6368" }}>
              Videos
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#5f6368" }}>
              News
            </span>
          </div>
        </div>

        {/* Image grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: "0 40px",
          }}
        >
          {IMAGE_PLACEHOLDERS.map((img, i) => {
            const delay = imagesStart + i * 3;
            const imgSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 200 },
            });
            return (
              <div
                key={i}
                style={{
                  width: 180,
                  height: 120,
                  backgroundColor: img.color,
                  borderRadius: 8,
                  opacity: imgSpring,
                  transform: `scale(${interpolate(imgSpring, [0, 1], [0.8, 1])})`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                }}
              >
                {img.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated cursor */}
      {frame > imagesStart + 20 && (
        <div
          style={{
            position: "absolute",
            left: cursorX + 310,
            top: cursorY + 100,
            width: 0,
            height: 0,
            borderLeft: "12px solid white",
            borderRight: "12px solid transparent",
            borderBottom: "18px solid transparent",
            filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))",
          }}
        />
      )}

      {/* Label */}
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
        Search for brand assets manually...
      </div>
    </AbsoluteFill>
  );
};
