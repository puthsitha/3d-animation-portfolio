"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/lib/data";

// Caption phases that fade in/out over the scrub. Ranges are scroll progress
// [appearStart, fullyVisible, fadeStart, gone].
const captions = [
  {
    range: [0.02, 0.1, 0.26, 0.34] as const,
    title: "Native at heart",
    body: "Swift and SwiftUI, the way Apple intended.",
  },
  {
    range: [0.36, 0.44, 0.6, 0.68] as const,
    title: "Cross-platform when it counts",
    body: "Flutter for products that need to be everywhere.",
  },
  {
    range: [0.7, 0.78, 0.92, 0.99] as const,
    title: "Built end to end",
    body: "From the first wireframe to the App Store.",
  },
];

function Caption({
  progress,
  range,
  title,
  body,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: readonly [number, number, number, number];
  title: string;
  body: string;
}) {
  const opacity = useTransform(progress, [...range], [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1]], [32, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 bottom-[5svh] px-6 text-center"
    >
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h3>
      <p className="mt-2 text-base text-ink-soft sm:text-lg">{body}</p>
    </motion.div>
  );
}

/**
 * The centerpiece: a 3D-printed figurine spin video scrubbed by scroll.
 *
 * Desktop: the outer section is 400vh tall; the video sits in a sticky
 * full-height inner frame and its currentTime is driven by scroll progress,
 * so the figurine rotates in lockstep with the user's scrolling while
 * captions cross-fade past it.
 *
 * Mobile / reduced motion: scroll-scrubbing a video is janky on touch
 * devices (and unwanted with prefers-reduced-motion), so the section
 * collapses to normal height and the video simply autoplays in a loop.
 */
export default function FigurineStage() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrubEnabled, setScrubEnabled] = useState<boolean | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Lazy-load: don't attach the video src until the section is within two
  // viewports of being visible.
  const nearViewport = useInView(containerRef, { margin: "200% 0px" });
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    if (nearViewport) setShouldLoad(true);
  }, [nearViewport]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setScrubEnabled(mq.matches && !prefersReducedMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Drive video.currentTime from scroll. Writes are coalesced into rAF and
  // quantized to 30fps steps — seeking the decoder on every scroll event
  // causes visible stutter for no extra smoothness.
  const pendingTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (!scrubEnabled || !video || !video.duration) return;
    const t =
      Math.round(progress * video.duration * 30) / 30;
    if (pendingTime.current === null) {
      rafId.current = requestAnimationFrame(() => {
        if (pendingTime.current !== null && videoRef.current) {
          videoRef.current.currentTime = Math.min(
            pendingTime.current,
            videoRef.current.duration - 0.001
          );
        }
        pendingTime.current = null;
      });
    }
    pendingTime.current = t;
  });
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  // Keep playback state in sync with the mode: loop mode plays (autoplay can
  // be blocked until ready, so kick it explicitly), scrub mode must be paused
  // — e.g. after resizing from a narrow window where the loop was running.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || scrubEnabled === null || !videoReady) return;
    if (scrubEnabled) {
      video.pause();
    } else {
      video.play().catch(() => {
        /* autoplay blocked — poster frame is fine */
      });
    }
  }, [scrubEnabled, videoReady]);

  const scrubMode = scrubEnabled === true;

  return (
    <section
      ref={containerRef}
      aria-label="Figurine showcase"
      className={scrubMode ? "relative h-[400vh]" : "relative"}
    >
      <div
        className={
          scrubMode
            ? "sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden"
            : "flex min-h-[80svh] items-center justify-center px-6 py-24"
        }
      >
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative flex flex-col items-center">
          {!videoReady && (
            <div
              className="absolute inset-0 m-auto h-16 w-16 animate-pulse rounded-full bg-surface-line"
              aria-hidden
            />
          )}
          {/* The source video is 1280x720 with the white figurine column
              occupying the central ~537px — the rest is baked-in black
              pillarboxing. This wrapper crops to just the white content so
              the video blends into the page background. */}
          <div
            className={`relative h-[55svh] max-w-[88vw] overflow-hidden transition-opacity duration-700 md:h-[70svh] ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            style={{ aspectRatio: "529 / 720" }}
          >
            <video
              ref={videoRef}
              src={shouldLoad ? "/figurine-spin.mp4" : undefined}
              className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2"
              muted
              playsInline
              preload="auto"
              loop={!scrubMode}
              autoPlay={scrubEnabled === false}
              onLoadedData={() => setVideoReady(true)}
              aria-label={`Rotating 3D figurine of ${site.name}`}
            />
          </div>

          {!scrubMode && (
            <div className="mt-8 max-w-md text-center">
              <h3 className="text-2xl font-semibold tracking-tight">
                Native at heart, cross-platform when it counts
              </h3>
              <p className="mt-2 text-ink-soft">
                Swift, SwiftUI and Flutter — built end to end, from wireframe
                to App Store.
              </p>
            </div>
          )}
        </div>

        {scrubMode &&
          captions.map((c) => (
            <Caption
              key={c.title}
              progress={scrollYProgress}
              range={c.range}
              title={c.title}
              body={c.body}
            />
          ))}
      </div>
    </section>
  );
}
