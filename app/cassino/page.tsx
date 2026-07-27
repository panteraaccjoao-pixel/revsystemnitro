"use client";
import { useEffect, useState } from 'react';

export default function Cassino() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <iframe src="/cassino/index.html" className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
