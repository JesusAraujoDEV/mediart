export const colors = {
  card: '#022834',
  step: '#16a696',
};

export function hexA(hex: string, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const cardStyle = {
  background: colors.card,
  border: `1px solid ${hexA(colors.step, 0.18)}`,
};

export const ghostInputStyle = {
  background: hexA('#000000', 0.12),
  border: `1px solid ${hexA(colors.step, 0.16)}`,
  color: hexA('#FFFFFF', 0.66),
};

export const collectionItemStyle = {
  background: hexA('#000000', 0.14),
  borderColor: hexA(colors.step, 0.18),
};

export const pillStyle = {
  background: hexA(colors.step, 0.26),
  color: hexA('#FFFFFF', 0.9),
  border: `1px solid ${hexA(colors.step, 0.32)}`,
};