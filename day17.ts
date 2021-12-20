import { maxBy, range, uniq, uniqBy } from 'lodash';
import { day17Example, day17Data } from './data';

const triangleMemo: number[] = []; // map of number to number.
function triangle(n: number) {
  if (!triangleMemo[n]) {
    triangleMemo[n] = (n * (n + 1)) / 2;
  }
  return triangleMemo[n];
}

function part1(data: string) {
  const [, , [y1]] = data.matchAll(/\d+/g);
  return triangle(+y1 - 1);
}

function part2(data: string) {
  const [x1, x2, y1, y2] = [...data.matchAll(/-?\d+/g)].map((v) => +v[0]);
  const yValues: [y: number, steps: number][] = [];
  range(0, -y1 * 2).forEach((y) => {
    const triangleY = triangle(y);
    const negativeTriangleY = triangle(y - 1); // shooting downwards
    range(1, Math.abs(y1) + y * 2).forEach((t) => {
      const delta = triangle(y - t);
      const position = triangleY - delta;
      const deltaNegative = triangle(t + y - 1);
      const positionNegative = negativeTriangleY - deltaNegative;
      if (position >= y1 && position <= y2) {
        yValues.push([y, t]);
      }
      if (y !== 0 && positionNegative >= y1 && positionNegative <= y2) {
        yValues.push([-y, t]);
      }
    });
  });
  const [, maxSteps] = maxBy(yValues, ([, steps]) => steps) || [];
  const xValuesByTime = new Map<number, number[]>();
  range(0, x2 + 1).forEach((x) => {
    const triangleX = triangle(x);
    range(1, maxSteps).forEach((t) => {
      const delta = triangle(t - x - 1);
      const position = t > x ? triangleX : triangleX - delta;
      if (position < x1 || position > x2) return;

      if (!xValuesByTime.get(t)) {
        xValuesByTime.set(t, [x]);
      } else {
        xValuesByTime.get(t)?.push(x);
      }
    });
  });
  const options = yValues
    .flatMap(([y, t]) => xValuesByTime.get(t)?.map((x) => [x, y]))
    .filter(Boolean) as [number, number][];
  return uniqBy(options, ([x, y]) => `${x},${y}`).length;
}

console.log(part1(day17Data));
console.log(part2(day17Data));
