// ─── Core Types ───────────────────────────────────────────────────────────────

export interface Finish {
  id: string;
  name: string;
  category: FinishCategory;
  hex: string;
  description: string;
}

export type FinishCategory =
  | 'All'
  | 'Texture'
  | 'Pearlescent'
  | 'Stucco'
  | 'Metallic'
  | 'Stone & Concrete'
  | 'Glaze'
  | 'Polished Plaster';

export interface Point { x: number; y: number; }

export interface Segment {
  id: string;
  maskData: Uint8ClampedArray;
  width: number;
  height: number;
  finish: Finish;
  opacity: number; // 0.1 – 1.0
  label: string;   // "Area 1", "Area 2", …
}

export interface PendingPolygon {
  points: Point[];
  obstructions: Point[][];
}

export type DesignerMode = 'ai' | 'quick';

export interface ApiErrorResult {
  error: string;
  code: string;
}

// ─── DDP Full Finish Catalogue ────────────────────────────────────────────────

export const CATEGORIES: FinishCategory[] = [
  'All',
  'Texture',
  'Pearlescent',
  'Stucco',
  'Metallic',
  'Stone & Concrete',
  'Glaze',
  'Polished Plaster',
];

export const FINISHES: Finish[] = [
  // Texture
  { id: 'cappadocia',   name: 'Cappadocia',    category: 'Texture',          hex: '#C4873A', description: 'Warm terracotta mineral texture' },
  { id: 'sieka',        name: 'Sieka',          category: 'Texture',          hex: '#B5875A', description: 'Rich ochre earth finish' },
  { id: 'sunba',        name: 'Sun-ba',         category: 'Texture',          hex: '#D4A96A', description: 'Soft amber sand texture' },
  { id: 'sadaf',        name: 'Sadaf',          category: 'Texture',          hex: '#E8D5B0', description: 'Pearl-white grainy surface' },
  // Pearlescent
  { id: 'marvellino',   name: 'Marvellino',     category: 'Pearlescent',      hex: '#B8A898', description: 'Soft champagne iridescence' },
  { id: 'joyaux',       name: 'Joyaux',         category: 'Pearlescent',      hex: '#9B8EA0', description: 'Deep violet pearl shimmer' },
  { id: 'petra',        name: 'Petra',          category: 'Pearlescent',      hex: '#C4873A', description: 'Rose gold metallic pearl' },
  // Stucco
  { id: 'stucco-tec',   name: 'Stucco-tec',     category: 'Stucco',           hex: '#8C7B6B', description: 'Classic Italian stucco' },
  { id: 'marmorino',    name: 'Marmorino',      category: 'Stucco',           hex: '#D6D0C4', description: 'Polished marble-dust plaster' },
  { id: 'veneziano',    name: 'Veneziano',      category: 'Stucco',           hex: '#C8C0B0', description: 'Venetian burnished finish' },
  // Metallic
  { id: 'metallica',    name: 'Metallica',      category: 'Metallic',         hex: '#9CA0A0', description: 'Brushed steel sheen' },
  { id: 'aurum',        name: 'Aurum',          category: 'Metallic',         hex: '#C9A84C', description: 'Liquid gold leaf effect' },
  { id: 'argentum',     name: 'Argentum',       category: 'Metallic',         hex: '#B0B8C0', description: 'Mirror silver metallic' },
  { id: 'onyx',         name: 'Onyx',           category: 'Metallic',         hex: '#2A2A2A', description: 'Dark obsidian metallic depth' },
  // Stone & Concrete
  { id: 'travertino',   name: 'Travertino',     category: 'Stone & Concrete', hex: '#C8B89A', description: 'Aged travertine quarry stone' },
  { id: 'cemento',      name: 'Cemento',        category: 'Stone & Concrete', hex: '#8A8A84', description: 'Raw exposed concrete texture' },
  { id: 'basalt',       name: 'Basalt',         category: 'Stone & Concrete', hex: '#505050', description: 'Volcanic dark basalt finish' },
  { id: 'calcare',      name: 'Calcare',        category: 'Stone & Concrete', hex: '#E0D8C8', description: 'Pale limestone washed effect' },
  // Glaze
  { id: 'acqua',        name: 'Acqua',          category: 'Glaze',            hex: '#7BAAB8', description: 'Translucent aqua glaze wash' },
  { id: 'seta',         name: 'Seta',           category: 'Glaze',            hex: '#E8D4C0', description: 'Silk ivory transparent glaze' },
  { id: 'rubino',       name: 'Rubino',         category: 'Glaze',            hex: '#8B3040', description: 'Deep ruby lacquer glaze' },
  // Polished Plaster
  { id: 'lusso',        name: 'Lusso',          category: 'Polished Plaster', hex: '#F0EAE0', description: 'High-sheen white plaster' },
  { id: 'grigio',       name: 'Grigio',         category: 'Polished Plaster', hex: '#A0A098', description: 'Cool mid-grey polished plaster' },
  { id: 'nero',         name: 'Nero',           category: 'Polished Plaster', hex: '#1A1816', description: 'Deep matte black plaster' },
];
