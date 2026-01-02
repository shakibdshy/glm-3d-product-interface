'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/lib/store';
import Viewer3D from '@/components/3d-viewer';
import ConfigurationPanel from '@/components/configuration-panel';
import CameraControls from '@/components/camera-controls';
import ControlBar from '@/components/control-bar';

export default function ProductCustomizer() {
  const { loadConfiguration } = useProductStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    if (configParam) {
      loadConfiguration(configParam);
    }
  }, [loadConfiguration]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black overflow-hidden">
      <div className="w-full h-full flex">
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <Viewer3D />
          </div>
          
          <CameraControls />
          
          <div className="absolute top-6 right-6">
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl px-6 py-4 shadow-2xl">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                <span className="text-amber-400">LUXURY</span> PRODUCT
              </h1>
              <p className="text-zinc-400 text-sm mt-1">3D Customization Experience</p>
            </div>
          </div>

          <ControlBar />
        </div>

        <div className="w-[400px] border-l border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
          <ConfigurationPanel />
        </div>
      </div>
    </div>
  );
}
