"use client";

import { useEffect, useRef } from "react";

/**
 * Animated WebGL shader background — a custom flowing "mesh gradient": two
 * stages of domain-warped fbm noise push soft wisps of indigo / blue / violet
 * across a dark navy base, with glow along the ridges and a gentle vignette.
 * It replaces the flat black page background and reads as a living, slowly
 * drifting field while staying dark enough for the white foreground text.
 *
 * Rendered on a lean raw-WebGL canvas (single fullscreen triangle) at z-index 0
 * — the three.js figurine canvas sits transparently above it.
 *
 * A canvas has exactly ONE WebGL context for its whole life. React Strict Mode
 * (dev) runs the effect → cleanup → effect again on the SAME canvas, so the
 * cleanup must NOT destroy the context (no loseContext) or the second run would
 * inherit a dead one and render nothing. The `.shader-bg` element carries a
 * dark CSS background, which is the fallback if the GL context is ever lost.
 */
export default function AnimatedShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const frag = `
      precision highp float;
      uniform float iTime;
      uniform vec2  iResolution;
      uniform vec2  iMouse;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = m * p;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
        uv *= 1.4;
        uv += iMouse * 0.12;          // subtle pointer parallax
        float t = iTime * 0.06;

        // two-stage domain warp → flowing organic shapes
        vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) - t));
        vec2 r = vec2(
          fbm(uv + 2.0 * q + vec2(1.7, 9.2) + 0.4 * t),
          fbm(uv + 2.0 * q + vec2(8.3, 2.8) - 0.4 * t)
        );
        float f = fbm(uv + 2.4 * r);

        // palette: black base, deep violet + blue wisps (kept dark)
        vec3 base    = vec3(0.006, 0.005, 0.014);
        vec3 violet1 = vec3(0.18, 0.06, 0.34);
        vec3 blue    = vec3(0.04, 0.13, 0.42);
        vec3 violet2 = vec3(0.26, 0.09, 0.44);

        vec3 col = base;
        col = mix(col, violet1, clamp(f * f * 1.4, 0.0, 1.0));
        col = mix(col, blue,    clamp(length(q) * 0.55, 0.0, 1.0));
        col = mix(col, violet2, clamp(r.x * 0.6, 0.0, 1.0));

        // glow along the warp ridges (violet/blue), subtle
        float glow = pow(clamp(f, 0.0, 1.0), 3.5);
        col += vec3(0.18, 0.10, 0.40) * glow * 0.4;

        // global dim + vignette: the whole field is dark, edges sink to near-black
        float vig = smoothstep(1.5, 0.05, length(uv));
        col *= mix(0.30, 0.62, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string, label: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS) && !gl!.isContextLost()) {
        console.error(`[ShaderBg] ${label} compile failed:`, gl!.getShaderInfoLog(sh));
      }
      return sh;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert, "vertex"));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag, "fragment"));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (!gl.isContextLost()) {
        console.error("[ShaderBg] link failed:", gl.getProgramInfoLog(prog));
      }
      return; // dark .shader-bg CSS background shows instead
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "iTime");
    const uRes = gl.getUniformLocation(prog, "iResolution");
    const uMouse = gl.getUniformLocation(prog, "iMouse");

    const dpr = Math.min(window.devicePixelRatio, 1.25); // soft bg: detail not critical
    const resize = () => {
      canvas.width = Math.max(2, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(2, Math.floor(window.innerHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let running = true;
    let t = reduce ? 12.0 : 0;
    const draw = () => {
      if (!running) return;
      if (!reduce) t += 0.016;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      // Stop the loop and listeners, but DO NOT lose the GL context — Strict
      // Mode re-runs this effect on the same canvas and must reuse the context.
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="shader-bg" aria-hidden />;
}
