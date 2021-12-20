import { cartesianProduct, permutations } from 'combinatorial-generators';
import _, { isEqual, last, maxBy, partial, range, sortBy, zip } from 'lodash';
import { day19Data } from './data';

type Coordinate = [x: number, y: number, x: number];
type Transform = {
  mapToAxis: 0 | 1 | 2;
  negate: 1 | -1;
  translate: number;
};
type Point = { position: Coordinate; scanners: number[] };
type Difference = { points: [Point, Point]; difference: string };
type Scanner = {
  index: number;
  position?: Coordinate;
  transforms?: Transform[];
  points: Point[];
  differences: Difference[];
};

function parse(data: string): Scanner[] {
  return data
    .split(/\n\n--- scanner .+ ---\n/)
    .slice(1)
    .map((scanner, index) => {
      const line = scanner.split('\n').map((line) => JSON.parse(`[${line}]`));
      const points = line.map((pos) => ({ position: pos, scanners: [] }));
      const differences = getAllDifferences(points);
      return { points, differences, index };
    });
}

function difference(prev: Coordinate, next: Coordinate): number[] {
  return (zip(prev, next) as number[][]).map(([v1, v2]) => v2 - v1);
}

function absDifference(prev: Coordinate, next: Coordinate): Coordinate {
  return difference(prev, next).map(Math.abs).sort() as Coordinate;
}

function getAllDifferences(points: Point[]): Difference[] {
  return [...permutations(points, 2)].map(([a, b]) => ({
    points: [a, b],
    difference: JSON.stringify(absDifference(a.position, b.position)),
  }));
}

function getOverlaps(scanner1: Scanner, scanner2: Scanner): Point[][] {
  return scanner2.differences
    .map(({ difference: d1, points }) =>
      scanner1.differences
        .filter(({ difference: d2 }) => isEqual(d2, d1))
        .map(({ points: p2 }) => points.concat(p2)),
    )
    .flat();
}

function part1(data: string) {
  const scanners = parse(data);
  [...permutations(scanners, 2)].forEach(([scanner1, scanner2]) =>
    getOverlaps(scanner1, scanner2)
      .flat()
      .forEach(({ scanners }) => scanners.push(scanner1.index, scanner2.index)),
  );
  return scanners
    .map(({ points, index }) =>
      points.filter((p) => sortBy(p.scanners)[0] === index),
    )
    .flat().length;
}

function mostFrequent(vals: number[]): [v: string, count: number] | undefined {
  return _(vals).countBy().entries().maxBy(last);
}

type AxisMap = [flip: -1 | 1, remap: 0 | 1 | 2];
const rotationsToTry = [...cartesianProduct([1, -1], [0, 1, 2])] as AxisMap[];
function alignAxis(
  axis: number[],
  grid: Point[],
  [flip, remap]: AxisMap,
): Transform | undefined {
  const rotatedTarget = grid.map((point) => point.position[remap] * flip);
  const options = [...cartesianProduct(axis, rotatedTarget)];
  const difference = options.map(([val, rotated]) => rotated - val);
  const [translation, count] = mostFrequent(difference) || [];
  if ((count || 0) < 12 || !translation) return undefined;
  return { mapToAxis: remap, negate: flip, translate: +translation };
}

function transform(location: Coordinate, transforms: Transform[]): Coordinate {
  return range(0, 3).map((axis) => {
    const { negate, translate } = transforms.find(
      ({ mapToAxis }) => mapToAxis === axis,
    ) || { negate: 1, translate: 0 };
    return negate * translate + location[axis];
  }) as Coordinate;
}

function combine(t1: Transform[], source?: Transform[]): Transform[] {
  if (!source) return t1;
  return range(0, 3).map((axis) => {
    const original = source[t1[axis].mapToAxis];
    return {
      translate: t1[axis].translate,
      negate: (t1[axis].negate * original.negate) as 1 | -1,
      mapToAxis: original.mapToAxis,
    };
  });
}

function compareScanners(goal: Scanner, source: Scanner): boolean {
  const transforms: Transform[] = [];
  range(0, 3).find((axis) => {
    const goalAxis = goal.points.map((point) => point.position[axis]);
    const options = rotationsToTry.filter(
      ([, remap]) => !transforms.find(({ mapToAxis }) => remap === mapToAxis),
    );
    options.find((axisMap) => {
      const transform = alignAxis(goalAxis, source.points, axisMap);
      return transform ? transforms.push(transform) : false;
    });
    return !transforms[axis]; // early exit
  });

  if (transforms.length !== 3) return false;
  goal.transforms = combine(transforms, source.transforms);
  goal.position = transform(source.position || [0, 0, 0], goal.transforms);
  return true;
}

function dist([x, y, z]: Coordinate, [x2, y2, z2]: Coordinate): number {
  return Math.abs(x - x2) + Math.abs(y - y2) + Math.abs(z - z2);
}

function part2(data: string) {
  const scanners = parse(data);
  scanners[0].position = [0, 0, 0];
  const unmatchedScanners = scanners.slice(1);
  while (unmatchedScanners.length) {
    const matchedScanners = scanners.filter(({ position }) => position);
    unmatchedScanners.forEach((target, i) => {
      if (matchedScanners.find(partial(compareScanners, target))) {
        unmatchedScanners.splice(i, 1);
      }
    });
  }
  const locs = scanners.map(({ position }) => position) as Coordinate[];
  const distances = [...permutations(locs, 2)].map(([c1, c2]) => dist(c1, c2));
  return maxBy(distances);
}

console.log(part1(day19Data));
console.log(part2(day19Data));
