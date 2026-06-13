"use client";

import { useEffect } from "react";

/**
 * Headless client controller. Renders no markup — it attaches the Three.js
 * world to the server-rendered <canvas id="webgl"> and wires up the GSAP
 * scroll director. The heavy three/gsap modules are dynamically imported so
 * nothing WebGL-related ever runs during SSR.
 */
export default function SceneController() {
  useEffect(() => {
    let disposed = false;
    let rafId = 0;
    let world: import("@/lib/scene").World | null = null;
    let director: import("@/lib/scroll").ScrollDirector | null = null;
    let cleanupListeners = () => {};

    (async () => {
      const canvas = document.getElementById("webgl") as HTMLCanvasElement | null;
      if (!canvas) return;

      const { createWorld, loadFigurine } = await import("@/lib/scene");
      const { createScrollDirector } = await import("@/lib/scroll");
      if (disposed) return; // unmounted while importing (React strict mode)

      world = createWorld(canvas);

      const loaderEl = document.getElementById("loader")!;
      const percentEl = document.getElementById("loader-percent")!;
      const barEl = document.getElementById("loader-bar-fill")!;

      /* ---- render loop, paused while the tab is hidden ---- */
      let lastT = performance.now();
      const tick = (t: number) => {
        const dt = Math.min((t - lastT) / 1000, 0.1); // clamp tab-switch spikes
        lastT = t;
        director?.update();
        world!.render(dt);
        rafId = requestAnimationFrame(tick);
      };
      const start = () => {
        lastT = performance.now();
        rafId = requestAnimationFrame(tick);
      };

      const onVisibility = () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else start();
      };
      const onResize = () => world!.resize();
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);
      cleanupListeners = () => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
      };

      start();

      /* ---- load model with progress, then reveal the page ---- */
      await loadFigurine(world, (ratio) => {
        const pct = Math.round(ratio * 100);
        percentEl.textContent = `${pct}%`;
        barEl.style.width = `${pct}%`;
      });
      if (disposed) return;

      director = createScrollDirector(world);
      loaderEl.classList.add("is-done");
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      cleanupListeners();
      director?.destroy();
      world?.dispose();
    };
  }, []);

  return null;
}
