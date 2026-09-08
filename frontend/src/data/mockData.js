export const EXCHANGE_RATE = 123.45;

export const products = [
  {
    id: 1,
    product_name: 'Thai Jasmine Rice',
    supplier_name: 'Aureus Thai Group',
    category: 'Food & Grains',
    price_thb: 42.5,
    weight_kg: 5,
    moq: 50,
    rating: 4.8,
    trust_score: 92,
    url: 'https://thaitrade.example/rice/jasmine',
  },
  {
    id: 2,
    product_name: 'Jasmin Rice',
    supplier_name: 'Golden Grain Co.',
    category: 'Food & Grains',
    price_thb: 38.0,
    weight_kg: 5,
    moq: 40,
    rating: 4.5,
    trust_score: 85,
    url: 'https://thaitrade.example/rice/jasmin',
  },
  {
    id: 3,
    product_name: 'Brown Rice',
    supplier_name: 'Organic Harvest Ltd.',
    category: 'Food & Grains',
    price_thb: 45.0,
    weight_kg: 5,
    moq: 30,
    rating: 4.6,
    trust_score: 88,
    url: 'https://thaitrade.example/rice/brown',
  },
  {
    id: 4,
    product_name: 'Sunflower Oil',
    supplier_name: 'Siam Oil Trading',
    category: 'Cooking Oil',
    price_thb: 68.0,
    weight_kg: 1,
    moq: 100,
    rating: 4.4,
    trust_score: 79,
    url: 'https://thaitrade.example/oil/sunflower',
  },
  {
    id: 5,
    product_name: 'Sterling Silver Rings',
    supplier_name: 'Bangkok Silver Works',
    category: 'Jewelry',
    price_thb: 320.0,
    weight_kg: 0.05,
    moq: 20,
    rating: 4.9,
    trust_score: 95,
    url: 'https://thaitrade.example/jewelry/silver-rings',
  },
];

export const dashboardStats = {
  products: '150+',
  suppliers: '10+',
  analyses: 24,
};

export const recentAnalysis = {
  id: 'analysis-001',
  product_name: 'Thai Jasmine Rice',
  supplier_name: 'Aureus Thai Group',
  shipping_method: 'Land Cargo',
  profit_margin: 28.4,
  product_id: 1,
  quantity: 100,
  selling_price_mmk: 8500,
  urgency: 'normal',
};

export const inventoryStatusList = [
  {
    id: 1,
    product_name: 'Thai Jasmine Rice',
    current_stock: 18,
    safety_stock: 15,
    average_daily_sales: 4.2,
    reorder_point: 27,
    status: 'REORDER',
  },
  {
    id: 4,
    product_name: 'Sunflower Oil',
    current_stock: 42,
    safety_stock: 20,
    average_daily_sales: 2.1,
    reorder_point: 31,
    status: 'OK',
  },
  {
    id: 5,
    product_name: 'Silver Rings',
    product_display: 'Sterling Silver Rings',
    current_stock: 8,
    safety_stock: 10,
    average_daily_sales: 1.5,
    reorder_point: 14,
    status: 'REORDER',
  },
];

export const recentDecisionLog = [
  {
    id: 'log-001',
    date: '2026-09-01',
    product_name: 'Thai Jasmine Rice',
    supplier: 'Aureus Thai Group',
    shipping: 'Land Cargo',
    quantity: 100,
    profit_margin: 28.4,
    ai_score: 120.5,
    decision: 'IMPORT',
  },
  {
    id: 'log-002',
    date: '2026-08-28',
    product_name: 'Sunflower Oil',
    supplier: 'Siam Oil Trading',
    shipping: 'Sea Freight',
    quantity: 200,
    profit_margin: 18.7,
    ai_score: 98.3,
    decision: 'IMPORT',
  },
  {
    id: 'log-003',
    date: '2026-08-25',
    product_name: 'Sterling Silver Rings',
    supplier: 'Bangkok Silver Works',
    shipping: 'Air Express',
    quantity: 50,
    profit_margin: 35.2,
    ai_score: 115.8,
    decision: 'IMPORT',
  },
  {
    id: 'log-004',
    date: '2026-08-20',
    product_name: 'Brown Rice',
    supplier: 'Organic Harvest Ltd.',
    shipping: 'Land Cargo',
    quantity: 80,
    profit_margin: 12.1,
    ai_score: 72.4,
    decision: 'REVIEW',
  },
];

export const shippingMethods = {
  'Land Cargo': { cost_thb_per_kg: 2.5, delivery_days: 14 },
  'Sea Freight': { cost_thb_per_kg: 1.2, delivery_days: 28 },
  'Air Express': { cost_thb_per_kg: 8.0, delivery_days: 3 },
};

export const analysisTemplates = {
  1: {
    recommendation: {
      supplier: 'Aureus Thai Group',
      shipping: 'Land Cargo',
      profit_margin: 28.4,
      ai_score: 120.5,
    },
    reasons: [
      'Supplier meets reliability requirement',
      'Quantity satisfies MOQ',
      'Profit margin exceeds minimum threshold (15%)',
      'Land Cargo optimal for normal urgency',
      'Trust score above 90 — high confidence supplier',
      'Inventory indicates reorder needed — import timing aligned',
    ],
    has_inventory: true,
  },
  2: {
    recommendation: {
      supplier: 'Golden Grain Co.',
      shipping: 'Land Cargo',
      profit_margin: 24.1,
      ai_score: 105.2,
    },
    reasons: [
      'Supplier meets reliability requirement',
      'Quantity satisfies MOQ',
      'Profit margin exceeds minimum threshold (15%)',
      'Competitive price vs. premium suppliers',
      'Land Cargo cost-effective for bulk grain',
    ],
    has_inventory: false,
  },
  3: {
    recommendation: {
      supplier: 'Organic Harvest Ltd.',
      shipping: 'Land Cargo',
      profit_margin: 22.8,
      ai_score: 102.7,
    },
    reasons: [
      'Supplier meets reliability requirement',
      'Quantity satisfies MOQ',
      'Organic category premium supports margin',
      'Land Cargo suitable for normal delivery window',
    ],
    has_inventory: false,
  },
  4: {
    recommendation: {
      supplier: 'Siam Oil Trading',
      shipping: 'Sea Freight',
      profit_margin: 18.7,
      ai_score: 98.3,
    },
    reasons: [
      'Supplier meets reliability requirement',
      'Quantity satisfies MOQ',
      'Sea Freight reduces shipping cost for heavy volume',
      'Current stock adequate — no urgent reorder',
    ],
    has_inventory: true,
  },
  5: {
    recommendation: {
      supplier: 'Bangkok Silver Works',
      shipping: 'Air Express',
      profit_margin: 35.2,
      ai_score: 115.8,
    },
    reasons: [
      'Supplier meets reliability requirement',
      'Quantity satisfies MOQ',
      'High trust score (95) — premium jewelry supplier',
      'Low weight makes Air Express viable for urgent orders',
      'Inventory below reorder point — import recommended',
    ],
    has_inventory: true,
  },
};

export function buildAnalysisPayload({ product_id, quantity, selling_price_mmk, urgency }) {
  const product = products.find((p) => p.id === product_id);
  if (!product) return null;

  const template = analysisTemplates[product_id] || analysisTemplates[1];
  const shipping = shippingMethods[template.recommendation.shipping];
  const urgencyMultiplier = urgency === 'urgent' ? 1.05 : 1.0;

  const product_cost_thb = product.price_thb * quantity;
  const total_weight = product.weight_kg * quantity;
  const shipping_cost_thb = shipping.cost_thb_per_kg * total_weight * urgencyMultiplier;
  const total_cost_thb = product_cost_thb + shipping_cost_thb;
  const total_cost_mmk = total_cost_thb * EXCHANGE_RATE;
  const expected_revenue_mmk = selling_price_mmk * quantity;
  const net_profit_mmk = expected_revenue_mmk - total_cost_mmk;
  const profit_margin =
    expected_revenue_mmk > 0 ? (net_profit_mmk / expected_revenue_mmk) * 100 : 0;

  const inventoryItem = inventoryStatusList.find((i) => i.id === product_id);

  let inventory = null;
  if (template.has_inventory && inventoryItem) {
    inventory = {
      current_stock: inventoryItem.current_stock,
      average_daily_sales: inventoryItem.average_daily_sales,
      reorder_point: inventoryItem.reorder_point,
      recommendation: inventoryItem.status === 'REORDER' ? 'reorder' : 'no_reorder',
      status: inventoryItem.status,
    };
  }

  return {
    product,
    recommendation: {
      supplier: template.recommendation.supplier,
      shipping: template.recommendation.shipping,
      profit_margin: parseFloat(profit_margin.toFixed(1)),
      estimated_profit_mmk: Math.round(net_profit_mmk),
      ai_score: template.recommendation.ai_score,
      lead_time_days: shipping.delivery_days,
    },
    cost_analysis: {
      product_cost_thb: parseFloat(product_cost_thb.toFixed(2)),
      shipping_cost_thb: parseFloat(shipping_cost_thb.toFixed(2)),
      total_cost_thb: parseFloat(total_cost_thb.toFixed(2)),
      exchange_rate: EXCHANGE_RATE,
      total_cost_mmk: parseFloat(total_cost_mmk.toFixed(2)),
      expected_revenue_mmk: parseFloat(expected_revenue_mmk.toFixed(2)),
      net_profit_mmk: parseFloat(net_profit_mmk.toFixed(2)),
      quantity,
      selling_price_mmk,
      urgency,
    },
    inventory,
    reasons: template.reasons,
  };
}

export function getProductById(productId) {
  return products.find((p) => p.id === productId) || null;
}
