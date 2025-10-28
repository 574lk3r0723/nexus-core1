'use client';
import { useState, useRef } from 'react';
import NexusLattice from '@/components/NexusLattice';
import QuantumInput from '@/components/QuantumInput';
import HolographicGlyph from '@/components/HolographicGlyph';
import { Upload } from 'lucide-react';

export default function NexusCore() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [glyphs, setGlyphs] = useState('');
  const [pulse, setPulse] = useState<{ x: number; y: number } | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff8800'];

  const uploadDocument = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/ingest', { method: 'POST', body: formData });

    const newNode = {
      id: Date.now(),
      name: file.name,
      color: colors[nodes.length % colors.length],
      position: [
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400,
      ],
    };
    setNodes(prev => [...prev, newNode]);
  };

  const sendPulse = async (query: string) => {
    if (!query.trim()) return;
    setPulse({ x: 0, y: 0 });
    setIsThinking(true);
    setGlyphs('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
    });

    const reader = res.body?.getReader();
    let buffer = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);
      const lines = buffer.split('\n').filter(Boolean);
      buffer = lines.pop() || '';

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.content) setGlyphs(prev => prev + data.content);
        } catch {}
      }
    }
    setIsThinking(false);
    setPulse(null);
  };

  return (
    <div className="nexus-core relative overflow-hidden">
      <NexusLattice nodes={nodes} pulse={pulse} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <HolographicGlyph text={glyphs} isThinking={isThinking} />
      </div>
      <QuantumInput onSend={sendPulse} />
      <input type="file" accept=".pdf" ref={fileInputRef} onChange={uploadDocument} className="hidden" />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-8 left-8 p-4 rounded-full bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/50 hover:scale-110 transition-all crystal-node"
      >
        <Upload size={24} className="text-cyan-300" />
      </button>
    </div>
  );
}
