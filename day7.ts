import { round, sortBy, sum } from 'lodash';
import { day7Data } from './data';

function part1(numbers: number[]) {
  const sorted = sortBy(numbers);
  const median = sorted[round(numbers.length / 2)];
  return sum(numbers.map((n) => Math.abs(n - median)));
}

function part2(numbers: number[]) {
  const mode = Math.floor(sum(numbers) / numbers.length);
  return sum(
    numbers.map((n) => {
      const diff = Math.abs(n - mode);
      return (diff * (diff + 1)) / 2;
    }),
  );
}

console.log(part1(day7Data));
console.log(part2(day7Data));
