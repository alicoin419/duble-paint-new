import { FINISHES, type Finish, type FinishCategory } from '@/lib/designer/types';

// ─── Category Images (Unsplash) ───────────────────────────────────────────────

export const CATEGORY_IMAGES: Record<string, string> = {
  'Texture':          '/pintest%20images/Home%20bedroom%20Decorate.jpeg',
  'Pearlescent':      '/pintest%20images/%23gold%20%23or.jpeg',
  'Stucco':           '/pintest%20images/Wall%20panels%20designing.jpeg',
  'Metallic':         '/pintest%20images/download%20(1).jpeg',
  'Stone & Concrete': '/pintest%20images/download%20(2).jpeg',
  'Glaze':            '/pintest%20images/download%20(3).jpeg',
  'Polished Plaster': '/pintest%20images/download.jpeg',
};

// ─── Specs by Category ────────────────────────────────────────────────────────

type FinishSpecs = {
  surface: string;
  baseCost: string;
  application: string;
  coverage: string;
  drying: string;
  pack: string;
};

export const CATEGORY_SPECS: Record<string, FinishSpecs> = {
  'Texture': {
    surface:     'Plaster / Cement',
    baseCost:    'DDP Primer XL',
    application: 'Stainless Trowel',
    coverage:    '14–16m² / 32kg drum',
    drying:      '12–24 Hours',
    pack:        '32kg Drum',
  },
  'Pearlescent': {
    surface:     'Interior Walls',
    baseCost:    'DDP Pearl Base',
    application: 'Foam Roller + Trowel Finish',
    coverage:    '8–10m² / L',
    drying:      '4–6 Hours',
    pack:        '5L / 20L',
  },
  'Stucco': {
    surface:     'Plaster / Masonry',
    baseCost:    'DDP Adhesion Primer',
    application: 'Venetian Trowel',
    coverage:    '10–12m² / kg',
    drying:      '24–48 Hours',
    pack:        '25kg Drum',
  },
  'Metallic': {
    surface:     'Interior Walls',
    baseCost:    'DDP Dark Base',
    application: 'Brush + Burnish Cloth',
    coverage:    '6–8m² / L',
    drying:      '2–4 Hours',
    pack:        '1L / 5L',
  },
  'Stone & Concrete': {
    surface:     'Concrete / Masonry',
    baseCost:    'DDP Stone Primer',
    application: 'Notched Trowel',
    coverage:    '12–15m² / kg',
    drying:      '24 Hours',
    pack:        '25kg / 32kg',
  },
  'Glaze': {
    surface:     'Interior Walls',
    baseCost:    'Any DDP Primer',
    application: 'Lambswool Roller',
    coverage:    '12–14m² / L',
    drying:      '1–2 Hours',
    pack:        '1L / 5L',
  },
  'Polished Plaster': {
    surface:     'Plaster / Drywall',
    baseCost:    'DDP Lime Primer',
    application: 'Steel Burnishing Trowel',
    coverage:    '10–12m² / kg',
    drying:      '24–72 Hours',
    pack:        '25kg Drum',
  },
};

// ─── Extended Finish Data ─────────────────────────────────────────────────────

export interface FinishDetail extends Finish {
  tagline: string;
  sku: string;
  image: string;
  specs: { label: string; value: string }[];
}

const SKU_PREFIX: Record<string, string> = {
  'Texture': 'TEX', 'Pearlescent': 'PRL', 'Stucco': 'STC',
  'Metallic': 'MET', 'Stone & Concrete': 'STC', 'Glaze': 'GLZ',
  'Polished Plaster': 'PPL',
};

let _skuCounter: Record<string, number> = {};

export const FINISH_CATALOG: FinishDetail[] = FINISHES.map((f, i) => {
  const cat = f.category as string;
  _skuCounter[cat] = (_skuCounter[cat] ?? 0) + 1;
  const prefix = SKU_PREFIX[cat] ?? 'DDP';
  const specs = CATEGORY_SPECS[cat];

  return {
    ...f,
    tagline: f.description + '.',
    sku: `DDP-${prefix}-${String(_skuCounter[cat]).padStart(3, '0')}`,
    image: CATEGORY_IMAGES[cat] ?? CATEGORY_IMAGES['Texture'],
    specs: specs ? [
      { label: 'TYPE OF SURFACE', value: specs.surface },
      { label: 'BASE COAT',       value: specs.baseCost },
      { label: 'APPLICATION',     value: specs.application },
      { label: 'COVERAGE',        value: specs.coverage },
      { label: 'DRYING TIME',     value: specs.drying },
      { label: 'PACK SIZE',       value: specs.pack },
    ] : [],
  };
});

export function getFinishBySlug(slug: string): FinishDetail | undefined {
  return FINISH_CATALOG.find((f) => f.id === slug);
}

export function getFinishesByCategory(category: FinishCategory | 'All'): FinishDetail[] {
  if (category === 'All') return FINISH_CATALOG;
  return FINISH_CATALOG.filter((f) => f.category === category);
}
