'use client';

import { useProductStore, CAMERA_POSITIONS } from '@/lib/store';

export default function CameraControls() {
  const { config, setCameraAngle, isTransitioning } = useProductStore();
  const angles = ['front', 'side', 'top', 'back', 'perspective'];

  return (
    <div className="absolute top-6 left-6 flex flex-col gap-2 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-3 shadow-2xl">
      {angles.map((angle) => (
        <button
          key={angle}
          onClick={() => setCameraAngle(angle)}
          disabled={isTransitioning}
          className={`
            px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300
            ${config.cameraAngle === angle
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }
            ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {angle}
        </button>
      ))}
    </div>
  );
}
