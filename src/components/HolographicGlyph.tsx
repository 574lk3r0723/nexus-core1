'use client';
import { useEffect, useRef } from 'react';

export default function HolographicGlyph({ text, isThinking }: any) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx || !text) return;

    ctx.clearRect(0, 0, 800, 600);
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(0.5, '#ff00ff');
    gradient.addColorStop(1, '#ffff00');
    ctx.fillStyle = gradient;
    ctx.fillText(text, 400, 300);
  }, [text]);

  if (isThinking) {
    return <div className="text-6xl font-mono text-cyan-400 animate-pulse">◉◉◉</div>;
  }

  return <canvas ref={canvas} width={800} height={600} className="glyph-rune" />;
}
