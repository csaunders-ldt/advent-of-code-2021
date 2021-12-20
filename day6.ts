import { countBy, range, sum } from 'lodash';
import { day6Example, day6Data } from './data';

function part1(data: string, iterations = 80) {
  const initialState = data.split(',').map((i) => parseInt(i));
  const initialCount = countBy(initialState);
  const values = range(0, iterations).reduce((state) => {
    const newState = Object.entries(state).map(([k, v]) => [
      parseInt(k) - 1,
      v,
    ]);
    const newCount = Object.fromEntries(newState);
    delete newCount['-1'];
    return {
      ...newCount,
      '6': (state['7'] || 0) + (state['0'] || 0),
      '8': state['0'] || 0,
    };
  }, initialCount);
  return sum(Object.values(values));
}

function part2(data: string) {
  return part1(data, 256);
}

console.log(part1(day6Data));
console.log(part2(day6Data));
