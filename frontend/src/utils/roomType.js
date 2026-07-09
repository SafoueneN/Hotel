// Association fixe (non cyclique) type de chambre -> teinte de la palette categorielle.
const ROOM_TYPE_COLORS = {
  SIMPLE: '#2a78d6',
  DOUBLE: '#1baf7a',
  SUITE: '#4a3aa7',
  FAMILIALE: '#eb6834',
};

export function roomTypeColor(type) {
  return ROOM_TYPE_COLORS[type] || '#898781';
}
