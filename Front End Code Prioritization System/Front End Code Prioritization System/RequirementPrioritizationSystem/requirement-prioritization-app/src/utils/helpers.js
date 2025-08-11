// Utility function to normalize contextual feature values (1-5 to 0.20-1.0)
// window.normalizeFeature = (value) => {
//   // 1 -> 0.20, 2 -> 0.40, 3 -> 0.60, 4 -> 0.80, 5 -> 1.0
//   return Math.min(Math.max(value, 1), 5) * 0.2;
// };
// Normalization is no longer needed for API calls; use raw integer values (1-5).