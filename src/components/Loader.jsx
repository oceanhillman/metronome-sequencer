'use client'
import { ring } from 'ldrs';

ring.register();

export default function LoaderRing() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <l-ring
        size="60"
        stroke="5"
        bg-opacity="0"
        speed="2"
        color="white"
      ></l-ring>
    </div>
  );
}