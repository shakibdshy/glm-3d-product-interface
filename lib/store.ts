import { create } from 'zustand';
import {
  ProductConfiguration,
  HistoryState,
  CameraPosition,
  LightingConfig,
  ColorOption,
  MaterialOption,
} from './types';

const COLORS: ColorOption[] = [
  { id: 'obsidian', name: 'Obsidian Black', hex: '#1a1a1a', price: 0 },
  { id: 'midnight', name: 'Midnight Blue', hex: '#0a192f', price: 50 },
  { id: 'champagne', name: 'Champagne Gold', hex: '#d4af37', price: 100 },
  { id: 'carbon', name: 'Carbon Gray', hex: '#2d2d2d', price: 0 },
  { id: 'crimson', name: 'Crimson Red', hex: '#8b0000', price: 150 },
  { id: 'arctic', name: 'Arctic White', hex: '#f5f5f5', price: 0 },
];

const MATERIALS: MaterialOption[] = [
  { type: 'matte', name: 'Matte Finish', roughness: 0.8, metalness: 0.1, price: 0 },
  { type: 'glossy', name: 'Glossy Finish', roughness: 0.2, metalness: 0.2, price: 50 },
  { type: 'metallic', name: 'Metallic Finish', roughness: 0.3, metalness: 0.9, price: 150 },
  { type: 'textured', name: 'Textured Finish', roughness: 0.9, metalness: 0.05, price: 75 },
  { type: 'carbon-fiber', name: 'Carbon Fiber', roughness: 0.4, metalness: 0.6, price: 200 },
];

const CAMERA_PRESETS: Record<string, CameraPosition> = {
  front: { position: [0, 0, 5], target: [0, 0, 0], zoom: 1 },
  side: { position: [5, 0, 0], target: [0, 0, 0], zoom: 1 },
  top: { position: [0, 5, 0], target: [0, 0, 0], zoom: 1 },
  back: { position: [0, 0, -5], target: [0, 0, 0], zoom: 1 },
  perspective: { position: [3, 2, 4], target: [0, 0, 0], zoom: 1 },
};

const ACCESSORIES = [
  { id: 'handle', name: 'Premium Handle', price: 80, position: [0, 1.5, 1] as [number, number, number], scale: [1, 1, 1] as [number, number, number] },
  { id: 'stand', name: 'Display Stand', price: 120, position: [0, -2, 0] as [number, number, number], scale: [1, 1, 1] as [number, number, number] },
  { id: 'lighting', name: 'LED Lighting Kit', price: 200, position: [0, 2, 0] as [number, number, number], scale: [1, 1, 1] as [number, number, number] },
  { id: 'protector', name: 'Protective Case', price: 60, position: [0, 0, 0] as [number, number, number], scale: [1.1, 1.1, 1.1] as [number, number, number] },
];

const BASE_PRICE = 999;

const DEFAULT_CONFIG: ProductConfiguration = {
  selectedColor: COLORS[0],
  selectedMaterial: MATERIALS[0],
  selectedAccessories: [],
  cameraAngle: 'perspective',
  lighting: {
    ambientIntensity: 0.5,
    directionalIntensity: 1,
    directionalPosition: [5, 5, 5],
    shadowIntensity: 0.7,
  },
};

interface ProductStore {
  config: ProductConfiguration;
  history: HistoryState[];
  historyIndex: number;
  isTransitioning: boolean;

  colors: ColorOption[];
  materials: MaterialOption[];
  accessories: typeof ACCESSORIES;
  basePrice: number;

  setColor: (color: ColorOption) => void;
  setMaterial: (material: MaterialOption) => void;
  toggleAccessory: (accessoryId: string) => void;
  setCameraAngle: (angle: string, customPosition?: CameraPosition) => void;
  setLighting: (lighting: Partial<LightingConfig>) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  calculatePrice: () => number;
  saveConfiguration: () => string;
  loadConfiguration: (configString: string) => boolean;
  resetConfiguration: () => void;

  setTransitioning: (isTransitioning: boolean) => void;

  pushHistory: () => void;
}

const pushToHistory = (history: HistoryState[], config: ProductConfiguration): HistoryState[] => {
  const newHistory = history.slice(0, history.length);
  newHistory.push({
    configuration: JSON.parse(JSON.stringify(config)),
    timestamp: Date.now(),
  });
  return newHistory;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
  history: pushToHistory([], DEFAULT_CONFIG),
  historyIndex: 0,
  isTransitioning: false,

  colors: COLORS,
  materials: MATERIALS,
  accessories: ACCESSORIES,
  basePrice: BASE_PRICE,

  setColor: (color) => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, selectedColor: color },
    }));
  },

  setMaterial: (material) => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, selectedMaterial: material },
    }));
  },

  toggleAccessory: (accessoryId) => {
    get().pushHistory();
    set((state) => {
      const selected = state.config.selectedAccessories.includes(accessoryId);
      const newAccessories = selected
        ? state.config.selectedAccessories.filter((id) => id !== accessoryId)
        : [...state.config.selectedAccessories, accessoryId];
      return {
        config: { ...state.config, selectedAccessories: newAccessories },
      };
    });
  },

  setCameraAngle: (angle, customPosition) => {
    get().pushHistory();
    set((state) => ({
      config: {
        ...state.config,
        cameraAngle: angle as any,
        customCameraPosition: customPosition,
      },
    }));
  },

  setLighting: (lighting) => {
    get().pushHistory();
    set((state) => ({
      config: {
        ...state.config,
        lighting: { ...state.config.lighting, ...lighting },
      },
    }));
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        config: JSON.parse(JSON.stringify(history[newIndex].configuration)),
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        config: JSON.parse(JSON.stringify(history[newIndex].configuration)),
        historyIndex: newIndex,
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  calculatePrice: () => {
    const { config, basePrice } = get();
    let total = basePrice;
    total += config.selectedColor.price;
    total += config.selectedMaterial.price;
    config.selectedAccessories.forEach((id) => {
      const accessory = get().accessories.find((a) => a.id === id);
      if (accessory) total += accessory.price;
    });
    return total;
  },

  saveConfiguration: () => {
    const { config } = get();
    const shared = {
      version: '1.0',
      config,
      createdAt: new Date().toISOString(),
    };
    return btoa(JSON.stringify(shared));
  },

  loadConfiguration: (configString) => {
    try {
      const shared = JSON.parse(atob(configString));
      if (shared.version && shared.config) {
        get().pushHistory();
        set({ config: shared.config });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  resetConfiguration: () => {
    get().pushHistory();
    set({ config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)) });
  },

  setTransitioning: (isTransitioning) => set({ isTransitioning }),

  pushHistory: () => {
    const { history, historyIndex, config } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      configuration: JSON.parse(JSON.stringify(config)),
      timestamp: Date.now(),
    });
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
}));

export const CAMERA_POSITIONS = CAMERA_PRESETS;
