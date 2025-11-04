import { jsx as _jsx } from "react/jsx-runtime";
// src/components/CanvasPolygons.tsx
import { useEffect, useRef } from "react";
export default function CanvasPolygons() {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const nodesRef = useRef([]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;
        const fit = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        fit();
        const N = Math.round((w * h) / 12000);
        const speed = 0.4;
        const rnd = (a, b) => Math.random() * (b - a) + a;
        nodesRef.current = Array.from({ length: N }, () => ({
            x: rnd(0, w),
            y: rnd(0, h),
            vx: rnd(-speed, speed),
            vy: rnd(-speed, speed),
        }));
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
            ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
            ctx.shadowBlur = 8;
            const nodes = nodesRef.current;
            const maxDist = Math.min(w, h) * 0.15;
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w)
                    n.vx *= -1;
                if (n.y < 0 || n.y > h)
                    n.vy *= -1;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
                ctx.fill();
            }
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < maxDist) {
                        const alpha = 1 - d / maxDist;
                        ctx.strokeStyle = `rgba(0,255,255,${0.25 * alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            rafRef.current = requestAnimationFrame(draw);
        };
        draw();
        const onResize = () => {
            w = canvas.offsetWidth;
            h = canvas.offsetHeight;
            fit();
        };
        window.addEventListener("resize", onResize);
        return () => {
            if (rafRef.current)
                cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", onResize);
        };
    }, []);
    return (_jsx("canvas", { ref: canvasRef, className: "absolute inset-0 h-full w-full", "aria-hidden": true }));
}
