import { useEffect, useRef } from "react";

const HIEROGLYPHS = [
  "𓄿", "𓇋", "𓅱", "𓃀", "𓊪", "𓆑", "𓅓", "𓈖", "𓂋", "𓉔", 
  "𓎛", "𓐍", "𓄡", "𓋴", "𓈙", "𓈎", "𓎡", "𓎼", "𓏏", "𓂧",
];

export default function HolographicWall({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };
    let grid = { items: [], cols: 0, rows: 0 };

    // Calculate grid dimensions once per resize
    const updateGrid = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      grid.cols = Math.floor(window.innerWidth / 40) + 1;
      grid.rows = Math.floor(window.innerHeight / 40) + 1;
      grid.items = Array.from({ length: grid.rows * grid.cols }).map(
        () => HIEROGLYPHS[Math.floor(Math.random() * HIEROGLYPHS.length)]
      );
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Continuous 60FPS draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Set colors based on theme
      const baseTextColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
      const glowColorHex = isDark ? "#ffd700" : "#b7410e";
      const glowColorRgba = isDark ? "rgba(255,215,0,0.8)" : "rgba(183,65,14,0.6)";

      for (let i = 0; i < grid.items.length; i++) {
        const char = grid.items[i];
        const col = i % grid.cols;
        const row = Math.floor(i / grid.cols);
        
        // Calculate center position for each 40x40 cell
        const x = col * 40 + 20;
        const y = row * 40 + 20;

        // Base Layer (Always visible)
        ctx.font = "20px sans-serif"; 
        ctx.fillStyle = baseTextColor;
        ctx.fillText(char, x, y);

        // Calculate distance from mouse
        const dist = Math.hypot(mouse.x - x, mouse.y - y);
        
        // Glow Layer (Only draws if within 250px radius)
        if (dist < 250) {
          const intensity = 1 - (dist / 250); // Fade out near edges
          
          ctx.save();
          ctx.globalAlpha = intensity;
          ctx.font = "bold 24px sans-serif"; 
          ctx.fillStyle = glowColorHex;
          ctx.shadowColor = glowColorRgba;
          ctx.shadowBlur = 15;
          ctx.fillText(char, x, y);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", updateGrid);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 bg-background pointer-events-none"
    />
  );
}