'use client';
import { useState } from 'react';

export default function QuantumInput({ onSend }: { onSend: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const [ripples, setRipples] = useState<any[]>([]);

  const send = () => {
    if (!query.trim()) return;
    const ripple = { id: Date.now() };
    setRipples(prev => [...prev, ripple]);
    onSend(query);
    setQuery('');
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 2000);
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8">
      <div className="relative">
        {ripples.map(r => (
          <div
            key={r.id}
            className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping"
            style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}
          />
        ))}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Resonate with the Nexus..."
          className="w-full p-6 text-2xl bg-black/40 backdrop-blur-2xl rounded-full border-2 border-cyan-500/50 text-cyan-300 placeholder-cyan-700/50 outline-none text-center font-mono tracking-widest"
        />
      </div>
    </div>
  );
}
