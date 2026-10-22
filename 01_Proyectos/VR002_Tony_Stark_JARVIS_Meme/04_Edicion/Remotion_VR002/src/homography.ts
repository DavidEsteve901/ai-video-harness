// Deformación de perspectiva ("corner pin"): proyecta un rectángulo w x h sobre un cuadrilátero
// con esquinas [TL, TR, BR, BL] y devuelve el matrix3d de CSS (origen de transformación 0 0).
export const cornerPin = (w: number, h: number, quad: [number, number][]): string => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  let g = 0, hh = 0;
  if (dx3 !== 0 || dy3 !== 0) {
    const det = dx1 * dy2 - dy1 * dx2;
    g = (dx3 * dy2 - dy3 * dx2) / det;
    hh = (dx1 * dy3 - dy1 * dx3) / det;
  }
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // cuadrado unidad -> píxeles: dividir las columnas por w y h
  return `matrix3d(${a / w}, ${d / w}, 0, ${g / w}, ${b / h}, ${e / h}, 0, ${hh / h}, 0, 0, 1, 0, ${c}, ${f}, 0, 1)`;
};
