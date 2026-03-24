import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { TerminalScene } from "./scenes/TerminalScene";
import { GoogleSearchScene } from "./scenes/GoogleSearchScene";
import { SaveImageScene } from "./scenes/SaveImageScene";
import { InstagramScene } from "./scenes/InstagramScene";
import { WorkMontageScene } from "./scenes/WorkMontageScene";
import { FinalRevealScene } from "./scenes/FinalRevealScene";

loadFont();
loadInter();

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
      <TransitionSeries>
        {/* Scene 1: Terminal typing */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <TerminalScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Google image search */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <GoogleSearchScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 3: Right-click save */}
        <TransitionSeries.Sequence durationInFrames={75}>
          <SaveImageScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* Scene 4: Instagram scraping */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <InstagramScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        {/* Scene 5: Work montage - rapid cuts */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <WorkMontageScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 6: Final reveal */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <FinalRevealScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
