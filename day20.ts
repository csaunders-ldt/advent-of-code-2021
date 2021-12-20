import { cloneDeep, range } from 'lodash';
import { day20Example, day20Data } from './data';

type Data = {
  algorithm: boolean[];
  grid: boolean[][];
};
function parse(data: string, steps = 0) {
  const asBool = (l: string) => l.split('').map((v) => v === '#');
  const [algorithm, image] = data.split('\n\n');
  const center = image.split('\n').map(asBool);

  console.log(center.length + steps * 2);
  const grid = Array.from({ length: center.length + steps * 2 }, () =>
    Array.from({ length: center.length + steps * 2 }, () => false),
  );
  range(steps, steps + center.length).forEach((x) => {
    range(steps, steps + center[0].length).forEach(
      (y) => (grid[x][y] = center[x - steps][y - steps]),
    );
  });
  return { algorithm: asBool(algorithm), grid };
}

function getSubgrid(grid: boolean[][], x: number, y: number): boolean[][] {
  return range(-1, 1).map((x1) =>
    range(-1, 2).map((y1) => grid[x + x1][y + y1]),
  );
}

function apply(grid: boolean[][], algorithm: boolean[]): boolean {
  const values = grid
    .flat()
    .map((v) => (v ? '1' : '0'))
    .join();
  console.log(parseInt(values, 2));
  return algorithm[parseInt(values, 2)];
}

function iterate({ grid, algorithm }: Data) {
  const oldGrid = cloneDeep(grid);
  range(1, grid.length - 1).forEach((x) => {
    range(1, grid[0].length - 1).forEach((y) => {
      const subgrid = getSubgrid(grid, x, y);
      grid[x][y] = apply(oldGrid, algorithm);
    });
  });
}

function part1(data: string) {
  const { algorithm, grid } = parse(data, 2);
  iterate({ algorithm, grid });

  console.log(JSON.stringify(grid));
}

function part2(data: string) {}

console.log(part1(day20Example));
console.log(part2(day20Example));
