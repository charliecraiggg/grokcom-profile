import React, { useEffect, useRef, useState } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HeroCover } from "./HeroCover.jsx";

function IntroComposition({ theme }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coverReveal = spring({ fps, frame, durationInFrames: 34, config: { damping: 22, stiffness: 96 } });
  const monogramReveal = spring({ fps, frame: frame - 5, durationInFrames: 42, config: { damping: 20, stiffness: 86 } });
  const titleReveal = spring({ fps, frame: frame - 12, durationInFrames: 32, config: { damping: 19, stiffness: 110 } });
  const scriptReveal = spring({ fps, frame: frame - 25, durationInFrames: 30, config: { damping: 20, stiffness: 105 } });
  const detailReveal = spring({ fps, frame: frame - 38, durationInFrames: 28, config: { damping: 22, stiffness: 105 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }} data-theme={theme}>
      <div className="hero-inner remotion-cover-inner">
        <HeroCover
          semantic={false}
          motion={{
            cover: { opacity: coverReveal, transform: `scale(${1.025 - coverReveal * .025})` },
            topline: { opacity: detailReveal, transform: `translateY(${(1 - detailReveal) * -16}px)` },
            monogram: { opacity: monogramReveal * .34, transform: `translate(-50%, -50%) scale(${.72 + monogramReveal * .28}) rotate(${(1 - monogramReveal) * -8}deg)` },
            title: { opacity: titleReveal, transform: `translateY(${(1 - titleReveal) * 72}px)`, filter: `blur(${(1 - titleReveal) * 10}px)` },
            script: { opacity: scriptReveal, transform: `translate(-50%, ${20 + (1 - scriptReveal) * 48}%) rotate(-7deg)` },
            statement: { opacity: detailReveal, transform: `translateY(${(1 - detailReveal) * 18}px)` },
            footer: { opacity: detailReveal, transform: `translateY(${(1 - detailReveal) * 20}px)` }
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

export function HeroIntro({ theme, onComplete }) {
  const playerRef = useRef(null);
  const [viewport] = useState(() => {
    const width = Math.max(320, window.innerWidth);
    const headerHeight = width <= 760 ? 62 : 68;
    return { width, height: Math.max(506, window.innerHeight - headerHeight) };
  });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const player = playerRef.current;
    if (!player || reducedMotion) return undefined;
    player.addEventListener("ended", onComplete);
    return () => player.removeEventListener("ended", onComplete);
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="remotion-intro" aria-hidden="true">
      <Player
        ref={playerRef}
        component={IntroComposition}
        inputProps={{ theme }}
        durationInFrames={72}
        compositionWidth={viewport.width}
        compositionHeight={viewport.height}
        fps={30}
        autoPlay
        initiallyMuted
        controls={false}
        clickToPlay={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      />
    </div>
  );
}
