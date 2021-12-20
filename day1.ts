import { sum } from 'lodash';
import { day1Data } from './data';

function part1(data: string) {
  return data
    .split('\n')
    .map((i) => parseInt(i))
    .reduce(
      ({ last, count }, next) => ({
        last: next,
        count: count + (next > last ? 1 : 0),
      }),
      { last: Number.MAX_VALUE, count: 0 },
    ).count;
}

function part2(data: string) {
  return data
    .split('\n')
    .map((i) => parseInt(i))
    .reduce(
      ({ last3, count }, next) => {
        const next3 = [last3[1], last3[2], next];
        return {
          last3: next3,
          count: count + (sum(next3) > sum(last3) ? 1 : 0),
        };
      },
      { last3: Array(3).fill(Number.MAX_VALUE), count: 0 },
    ).count;
}

console.log(part1(day1Data));
console.log(part2(day1Data));
