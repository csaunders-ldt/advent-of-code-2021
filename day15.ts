import Heap from 'heap';
import { range } from 'lodash';
import { day15Data } from './data';

const numberGrid = (data: string) => data.split('\n').map(
  (line) => line.split('').map((v) => parseInt(v, 10)),
);

type Coordinate = [x: number, y: number]
function part1(data: string | number[][]) {
  const grid = typeof data === 'string' ? numberGrid(data) : data;
  const nodes: Record<string, number> = { '0,0': 0 };
  const score = ([x, y]: Coordinate) => nodes[`${x},${y}`] || Number.MAX_VALUE;
  const options = new Heap<Coordinate>((path1, path2) => score(path1) - score(path2));

  options.push([0, 0]);

  while (!options.empty()) {
    const [x, y] = options.pop();
    const value = nodes[`${x},${y}`];
    const neighbours = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    neighbours.forEach(([nextX, nextY]) => {
      if (grid[nextX]?.[nextY] === undefined) return;

      const newScore = value + grid[nextX][nextY];
      const prevScore = nodes[`${nextX},${nextY}`];
      if (prevScore === undefined || newScore < prevScore) {
        nodes[`${nextX},${nextY}`] = newScore;
        options.push([nextX, nextY]);
      }
    });
  }
  return score([grid.length - 1, grid.length - 1]);
}

function part2(data: string) {
  const grid = numberGrid(data);
  const increment = (cell: number, value: number) => ((cell + value - 1) % 9) + 1;
  const rows = grid.map((row) => range(0, 5).flatMap(
    (i) => row.map((cell) => increment(cell, i)),
  ));
  const newGrid = range(0, 5).flatMap(
    (i) => rows.map((row) => row.map((cell) => increment(cell, i))),
  );
  return part1(newGrid);
}

console.log(part1(day15Data));
console.log(part2(day15Data));
