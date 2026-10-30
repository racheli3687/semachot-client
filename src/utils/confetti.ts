import confetti from "canvas-confetti";

const COLORS = ["#0071e3", "#ff9f6b", "#ff6fa8", "#8b7bff", "#4fb6ff", "#ffcc00"];

// חגיגת קונפטי משני צדי המסך
export function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const base = { particleCount: 70, spread: 70, startVelocity: 45, ticks: 220, colors: COLORS, scalar: 0.9 };
    void confetti({ ...base, angle: 60, origin: { x: 0, y: 0.75 } });
    void confetti({ ...base, angle: 120, origin: { x: 1, y: 0.75 } });
}
