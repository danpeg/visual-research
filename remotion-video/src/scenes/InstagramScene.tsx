import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const POSTS = [
  { color: "#e8d5b7", likes: 2847 },
  { color: "#b7d5e8", likes: 5123 },
  { color: "#d5e8b7", likes: 1892 },
  { color: "#e8b7d5", likes: 3456 },
  { color: "#b7e8d5", likes: 7891 },
  { color: "#d5b7e8", likes: 2134 },
  { color: "#e8c9b7", likes: 4567 },
  { color: "#b7e8c9", likes: 6789 },
  { color: "#c9b7e8", likes: 3210 },
];

export const InstagramScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserEntry = spring({ frame, fps, config: { damping: 200 } });

  // URL typing
  const url = "instagram.com/AnthropicAI";
  const urlChars = Math.min(url.length, Math.floor(frame * 0.6));
  const displayedUrl = url.slice(0, urlChars);

  // Grid appears
  const gridStart = Math.ceil(url.length / 0.6) + 10;

  // Download indicators cascade
  const downloadStart = gridStart + 20;

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
          transform: `translateY(${interpolate(browserEntry, [0, 1], [30, 0])}px)`,
          opacity: browserEntry,
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Browser bar */}
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
            https://{displayedUrl}
            {urlChars < url.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 16,
                  backgroundColor: "#4285f4",
                  marginLeft: 1,
                  verticalAlign: "text-bottom",
                }}
              />
            )}
          </div>
        </div>

        {/* Instagram profile header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "24px 40px",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
              padding: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#d4c5a0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              A
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 400,
                color: "#262626",
              }}
            >
              AnthropicAI
            </div>
            <div
              style={{
                display: "flex",
                gap: 32,
                marginTop: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#262626",
              }}
            >
              <span><strong>127</strong> posts</span>
              <span><strong>284K</strong> followers</span>
              <span><strong>42</strong> following</span>
            </div>
          </div>
        </div>

        {/* Post grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "0 40px",
          }}
        >
          {POSTS.map((post, i) => {
            const delay = gridStart + i * 4;
            const postSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 200 },
            });

            const dlDelay = downloadStart + i * 6;
            const isDownloading = frame >= dlDelay;
            const dlProgress = isDownloading
              ? interpolate(frame, [dlDelay, dlDelay + 15], [0, 1], {
                  extrapolateRight: "clamp",
                })
              : 0;

            return (
              <div
                key={i}
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: post.color,
                  opacity: postSpring,
                  transform: `scale(${interpolate(postSpring, [0, 1], [0.9, 1])})`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Like count overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.8)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  ♥ {post.likes.toLocaleString()}
                </div>

                {/* Download overlay */}
                {dlProgress > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: `rgba(0,0,0,${dlProgress * 0.5})`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {dlProgress >= 1 && (
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 28,
                          color: "#3fb950",
                        }}
                      >
                        ✓
                      </div>
                    )}
                    {dlProgress < 1 && (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          transform: `rotate(${frame * 12}deg)`,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* API extraction label */}
      {frame > downloadStart && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 14,
            color: "#58a6ff",
            backgroundColor: "rgba(13,17,23,0.9)",
            padding: "8px 20px",
            borderRadius: 6,
            border: "1px solid #30363d",
            opacity: interpolate(frame, [downloadStart, downloadStart + 10], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          curl "https://www.instagram.com/api/v1/users/web_profile_info/?username=AnthropicAI"
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
        Extract every post from the API...
      </div>
    </AbsoluteFill>
  );
};
