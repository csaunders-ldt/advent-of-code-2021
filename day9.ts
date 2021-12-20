import { range, reverse, sortBy } from 'lodash';
import { day9Data } from './data';

function parse(data: string) {
  const grid = data
    .split('\n')
    .map((line) => line.split('').map((v) => parseInt(v, 10)));
  const cellAt = (x: number, y: number) => ({
    x,
    y,
    value: grid[x]?.[y] ?? 10,
  });
  const cells = range(grid.length).flatMap((x) =>
    range(grid[0].length).map((y) => cellAt(x, y)),
  );
  return { grid, cellAt, cells };
}

function part1(data: string) {
  const { cells, cellAt } = parse(data);
  return cells.reduce((sum, { x, y, value }) => {
    if (cellAt(x, y - 1).value <= value) return sum;
    if (cellAt(x, y + 1).value <= value) return sum;
    if (cellAt(x - 1, y).value <= value) return sum;
    if (cellAt(x + 1, y).value <= value) return sum;

    return sum + value + 1;
  }, 0);
}

type Basin = { size: number; currentRow: number[]; nextRow: number[] };
function part2(data: string) {
  const { grid } = parse(data);
  const basins: Basin[] = [];
  let currentBasin: Basin | undefined;
  grid.forEach((row) => {
    // Reset current basin
    currentBasin = undefined;
    basins.forEach((basin) => {
      basin.currentRow = basin.nextRow;
      basin.nextRow = [];
    });

    row.forEach((cell, x) => {
      if (cell === 9) {
        currentBasin = undefined;
        return;
      }

      // Find current basin, merge if needed.
      basins.forEach((basin) => {
        if (!basin.currentRow.includes(x)) return;

        if (currentBasin && currentBasin !== basin) {
          // merge
          currentBasin.size += basin.size;
          currentBasin.currentRow.push(...basin.currentRow);
          basins.splice(basins.indexOf(basin), 1);
        } else {
          currentBasin = basin;
        }
      });
      if (!currentBasin) {
        currentBasin = { size: 0, currentRow: [], nextRow: [] };
        basins.push(currentBasin);
      }
      currentBasin.size += 1;
      currentBasin.nextRow.push(x);
    });
  });
  const sizes = basins.map(({ size }) => size);
  const lastThree = reverse(sortBy(sizes)).slice(0, 3);
  return lastThree.reduce((product, next) => product * next, 1);
}

console.log(part1(day9Data));
console.log(part2(day9Data));
