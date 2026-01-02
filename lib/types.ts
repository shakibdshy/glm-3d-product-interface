export type MaterialType = 'matte' | 'glossy' | 'metallic' | 'textured' | 'carbon-fiber';

export type CameraAngle = 'front' | 'side' | 'top' | 'back' | 'perspective' | 'custom';

export type TabType = 'colors' | 'materials' | 'accessories' | 'lighting';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  price: number;
}

export interface MaterialOption {
  type: MaterialType;
  name: string;
  roughness: number;
  metalness: number;
  price: number;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
  position: [number, number, number];
  scale: [number, number, number];
}

export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
  zoom?: number;
}

export interface LightingConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  directionalPosition: [number, number, number];
  shadowIntensity: number;
}

export interface ProductConfiguration {
  selectedColor: ColorOption;
  selectedMaterial: MaterialOption;
  selectedAccessories: string[];
  cameraAngle: CameraAngle;
  customCameraPosition?: CameraPosition;
  lighting: LightingConfig;
}

export interface HistoryState {
  configuration: ProductConfiguration;
  timestamp: number;
}

export interface SharedConfiguration {
  version: string;
  config: ProductConfiguration;
  createdAt: string;
}
