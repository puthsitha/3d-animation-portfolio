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

      /* ---- dev camera readout (localhost only; toggle with "D") ---- */
      const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
      const debugEl = document.getElementById("debug-readout") as HTMLElement | null;
      const debugValEl = document.getElementById("debug-readout-value");
      const debugCopyBtn = document.getElementById("debug-copy") as HTMLButtonElement | null;
      let debugVisible = isLocal;
      let lastDebug = 0;
      const fmt = (n: number) => n.toFixed(2);
      const keyframeText = () => {
        const p = world!.camera.position;
        const tg = world!.cameraTarget;
        const yw = world!.modelYaw.value;
        return `{ pos: [${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)}], target: [${fmt(tg.x)}, ${fmt(tg.y)}, ${fmt(tg.z)}], yaw: ${fmt(yw)} }`;
      };
      if (debugEl) debugEl.hidden = !debugVisible;
      const onDebugKey = (e: KeyboardEvent) => {
        if (!isLocal || e.key.toLowerCase() !== "d") return;
        debugVisible = !debugVisible;
        if (debugEl) debugEl.hidden = !debugVisible;
      };
      const onDebugCopy = () => {
        navigator.clipboard?.writeText(keyframeText());
        if (debugCopyBtn) {
          const prev = debugCopyBtn.textContent;
          debugCopyBtn.textContent = "Copied";
          setTimeout(() => { debugCopyBtn.textContent = prev; }, 1000);
        }
      };
      window.addEventListener("keydown", onDebugKey);
      debugCopyBtn?.addEventListener("click", onDebugCopy);

      /* ---- render loop, paused while the tab is hidden ---- */
      let lastT = performance.now();
      const tick = (t: number) => {
        const dt = Math.min((t - lastT) / 1000, 0.1); // clamp tab-switch spikes
        lastT = t;
        director?.update();
        world!.render(dt);
        if (debugVisible && debugValEl && t - lastDebug > 120) {
          lastDebug = t;
          debugValEl.textContent = keyframeText();
        }
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
        window.removeEventListener("keydown", onDebugKey);
        debugCopyBtn?.removeEventListener("click", onDebugCopy);
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
