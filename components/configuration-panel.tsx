'use client';

import { useState } from 'react';
import { useProductStore } from '@/lib/store';
import { Slider } from './ui/slider';

export default function ConfigurationPanel() {
  const { config, colors, materials, accessories, setColor, setMaterial, toggleAccessory, setCameraAngle, setLighting } = useProductStore();
  const [activeTab, setActiveTab] = useState<'colors' | 'materials' | 'accessories' | 'lighting'>('colors');

  return (
    <div className="w-full h-full flex flex-col bg-linear-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="border-b border-zinc-800">
        <div className="flex">
          {(['colors', 'materials', 'accessories', 'lighting'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-6 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300
                ${activeTab === tab
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">Select Color</h3>
            <div className="grid grid-cols-3 gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setColor(color)}
                  className={`
                    group relative aspect-square rounded-xl border-2 transition-all duration-300
                    ${config.selectedColor.id === color.id
                      ? 'border-amber-400 ring-2 ring-amber-400/50'
                      : 'border-zinc-700 hover:border-zinc-500'
                    }
                  `}
                >
                  <div
                    className="absolute inset-1 rounded-lg"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="absolute inset-0 flex items-end p-3">
                    <div className="w-full">
                      <p className="text-xs font-medium text-white truncate">{color.name}</p>
                      {color.price > 0 && (
                        <p className="text-xs text-zinc-400">+${color.price}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">Select Material</h3>
            <div className="space-y-3">
              {materials.map((material) => (
                <button
                  key={material.type}
                  onClick={() => setMaterial(material)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                    ${config.selectedMaterial.type === material.type
                      ? 'border-amber-400 bg-amber-400/5'
                      : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{material.name}</p>
                      <p className="text-sm text-zinc-400 mt-1">
                        Roughness: {material.roughness} • Metalness: {material.metalness}
                      </p>
                    </div>
                    {material.price > 0 && (
                      <span className="text-amber-400 font-semibold">+${material.price}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accessories' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">Add Accessories</h3>
            <div className="space-y-3">
              {accessories.map((accessory) => (
                <button
                  key={accessory.id}
                  onClick={() => toggleAccessory(accessory.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                    ${config.selectedAccessories.includes(accessory.id)
                      ? 'border-amber-400 bg-amber-400/5'
                      : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{accessory.name}</p>
                      <p className="text-sm text-zinc-400 mt-1">
                        {config.selectedAccessories.includes(accessory.id) ? 'Included' : 'Not selected'}
                      </p>
                    </div>
                    <span className="text-amber-400 font-semibold">+${accessory.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lighting' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide">Lighting Controls</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">Ambient Light</label>
                  <span className="text-sm text-amber-400">{config.lighting.ambientIntensity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[config.lighting.ambientIntensity]}
                  onValueChange={(value: [number]) => setLighting({ ambientIntensity: value[0] })}
                  max={1}
                  min={0}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">Directional Light</label>
                  <span className="text-sm text-amber-400">{config.lighting.directionalIntensity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[config.lighting.directionalIntensity]}
                  onValueChange={(value: [number]) => setLighting({ directionalIntensity: value[0] })}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">Shadow Intensity</label>
                  <span className="text-sm text-amber-400">{config.lighting.shadowIntensity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[config.lighting.shadowIntensity]}
                  onValueChange={(value: [number]) => setLighting({ shadowIntensity: value[0] })}
                  max={1}
                  min={0}
                  step={0.05}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
