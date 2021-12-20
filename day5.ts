import { countBy, range } from 'lodash';
import { day5Example, day5Data } from './data';

function getGrid(data: string, straightOnly: boolean): number[][] {
  const grid = range(0, 1000).map(() => new Array(1000).fill(0));
  data.split('\n').forEach((line) => {
    const [[startX, startY], [endX, endY]] = line
      .split(' -> ')
      .map((coordinate) => coordinate.split(',').map((i) => parseInt(i)));

    if (straightOnly && startX !== endX && startY !== endY) {
      return;
    }

    const diff = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
    const stepX = (endX - startX) / diff;
    const stepY = (endY - startY) / diff;
    range(0, diff + 1).forEach((i) => {
      grid[startX + stepX * i][startY + stepY * i] += 1;
    });
  });
  return grid;
}

function part1(data: string) {
  const grid = getGrid(data, true);
  return countBy(grid.flat(), (i) => i > 1).true;
}

function part2(data: string) {
  const grid = getGrid(data, false);
  return countBy(grid.flat(), (i) => i > 1).true;
}

console.log(part1(day5Data));
console.log(part2(day5Data));
