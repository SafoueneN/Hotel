// Degrades deterministes (bases sur la palette categorielle validee) utilises comme
// "couverture" visuelle des hotels, en l'absence de vraies photos.
const GRADIENTS = [
  'linear-gradient(135deg, #2a78d6 0%, #1c5cab 100%)',
  'linear-gradient(135deg, #1baf7a 0%, #0d7e57 100%)',
  'linear-gradient(135deg, #4a3aa7 0%, #2d2168 100%)',
  'linear-gradient(135deg, #eb6834 0%, #c94f21 100%)',
  'linear-gradient(135deg, #e87ba4 0%, #c94f79 100%)',
  'linear-gradient(135deg, #eda100 0%, #b57900 100%)',
];

export function coverGradientFor(seed) {
  const str = String(seed ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}
