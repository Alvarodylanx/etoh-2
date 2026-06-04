export const CATEGORIES = [
  { id: 'fashion',     label: 'Fashion & Clothing', icon: '👗' },
  { id: 'food',        label: 'Food & Groceries',   icon: '🍲' },
  { id: 'produce',     label: 'Fresh Produce',      icon: '🥬' },
  { id: 'electronics', label: 'Electronics',         icon: '📱' },
  { id: 'beauty',      label: 'Beauty & Health',    icon: '💄' },
  { id: 'home',        label: 'Home & Living',      icon: '🏠' },
  { id: 'crafts',      label: 'Arts & Crafts',      icon: '🎨' },
  { id: 'services',    label: 'Services',            icon: '🔧' },
  { id: 'general',     label: 'General',             icon: '🛍️' },
];

export function getCategoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}
