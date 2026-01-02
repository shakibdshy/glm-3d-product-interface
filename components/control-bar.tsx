'use client';

import { useRef, useState } from 'react';
import { useProductStore } from '@/lib/store';

export default function ControlBar() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { calculatePrice, undo, redo, canUndo, canRedo, saveConfiguration, resetConfiguration, config } = useProductStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showARModal, setShowARModal] = useState(false);

  const handleScreenshot = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `product-config-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleShare = () => {
    const configString = saveConfiguration();
    const url = `${window.location.origin}${window.location.pathname}?config=${configString}`;
    setShareUrl(url);
    setShowShareModal(true);
    navigator.clipboard.writeText(url);
  };

  const handleARPreview = () => {
    setShowARModal(true);
    setTimeout(() => {
      setShowARModal(false);
      alert('AR Preview would launch camera-based AR experience here. This feature requires device-specific AR implementation.');
    }, 2000);
  };

  const price = calculatePrice();

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={undo}
                  disabled={!canUndo()}
                  className={`
                    p-3 rounded-xl transition-all duration-300 text-sm font-semibold
                    ${canUndo()
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105'
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                    }
                  `}
                  title="Undo"
                >
                  ↶
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo()}
                  className={`
                    p-3 rounded-xl transition-all duration-300 text-sm font-semibold
                    ${canRedo()
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105'
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                    }
                  `}
                  title="Redo"
                >
                  ↷
                </button>
              </div>

              <button
                onClick={resetConfiguration}
                className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300 text-sm font-semibold"
              >
                Reset
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-3xl font-bold text-amber-400">${price.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleScreenshot}
                className="px-4 py-3 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 transition-all duration-300 text-sm font-semibold"
                title="Take Screenshot"
              >
                📷 Screenshot
              </button>

              <button
                onClick={handleARPreview}
                className="px-4 py-3 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 transition-all duration-300 text-sm font-semibold"
                title="AR Preview"
              >
                📱 AR Preview
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-400/30 text-sm"
              >
                <span>🔗 Share</span>
              </button>

              <button
                onClick={() => alert('Proceeding to checkout...')}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-amber-400/40 text-sm"
              >
                <span>🛒 Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Configuration Shared!</h3>
            <p className="text-zinc-400 mb-4">Your configuration has been copied to clipboard. Share this URL with others:</p>
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm"
            />
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showARModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="animate-spin mb-4 text-6xl">
              📱
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Initializing AR Preview</h3>
            <p className="text-zinc-400">Launching augmented reality experience...</p>
          </div>
        </div>
      )}

      <div ref={canvasRef} className="hidden" />
    </>
  );
}
