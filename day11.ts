import { range } from 'lodash';
import { day11Example, day11Data } from './data';

function bumpCell(grid: number[][], x: number, y: number): number {
  if (grid[x]?.[y] === undefined || grid[x][y] === 10) return 0;

  grid[x][y] += 1;
  if (grid[x][y] !== 10) return 0;
  return range(-1, 2).reduce(
    (score, xMod) =>
      score +
      range(-1, 2).reduce(
        (lScore, yMod) => lScore + bumpCell(grid, x + xMod, y + yMod),
        0,
      ),
    1,
  );
}

function bumpGrid(grid: number[][]): number {
  const score = range(0, grid.length).reduce(
    (score, x) =>
      score +
      range(0, grid[0].length).reduce(
        (lineScore, y) => lineScore + bumpCell(grid, x, y),
        0,
      ),
    0,
  );
  range(0, grid.length).forEach((x) =>
    range(0, grid[0].length).forEach((y) => {
      grid[x][y] = grid[x][y] % 10;
    }),
  );
  return score;
}

function part1(data: string) {
  const grid = data.split('\n').map((line) => line.split('').map((x) => +x));
  return range(0, 100).reduce((count) => bumpGrid(grid) + count, 0);
}

function part2(data: string) {
  const grid = data.split('\n').map((line) => line.split('').map((x) => +x));
  return range(1, 501).find(() => {
    bumpGrid(grid);
    return grid.every((line) => line.every((v) => v === 0));
  });
}

console.log(part1(day11Data));
console.log(part2(day11Data));
