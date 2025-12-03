import React, { useEffect, useRef } from 'react';

export const BgEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const lines: {y: number, speed: number}[] = [];
    const gridSize = 40;
    
    // Horizon line
    const horizon = h * 0.4;

    function init() {
        for(let i=0; i< h; i+=gridSize) {
            lines.push({ y: i, speed: 0.5 });
        }
    }
    init();

    function draw() {
        if(!ctx) return;
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);

        // Perspective Grid
        ctx.strokeStyle = 'rgba(188, 19, 254, 0.15)'; // Cyber Purple
        ctx.lineWidth = 1;

        // Vertical lines (perspective)
        const centerX = w / 2;
        for (let x = -w; x < w * 2; x += gridSize * 2) {
             ctx.beginPath();
             ctx.moveTo(x, h);
             ctx.lineTo(centerX, horizon);
             ctx.stroke();
        }

        // Horizontal moving lines
        lines.forEach(line => {
            line.y += line.speed;
            if (line.y > h) line.y = horizon;

            // Opacity based on distance from horizon
            const alpha = (line.y - horizon) / (h - horizon);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.2})`; // Cyber Blue

            ctx.beginPath();
            ctx.moveTo(0, line.y);
            ctx.lineTo(w, line.y);
            ctx.stroke();
        });

        requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};
