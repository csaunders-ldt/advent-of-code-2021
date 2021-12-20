import { zip, range } from 'lodash';
import { day3Example, day3Data } from './data';

function getMostCommon(digits: string[][]) {
  return zip(...digits).map((line) => {
    const numZeros = line.filter((d) => d === '0').length;
    if (numZeros === line.length / 2) return [undefined, undefined];

    return numZeros > line.length / 2 ? ['0', '1'] : ['1', '0'];
  });
}

function part1(data: string) {
  const digits = data.split('\n').map((line) => line.split(''));
  const mostCommon = getMostCommon(digits);
  const [gamma, epsilon] = zip(...mostCommon).map((l) => l.join(''));
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function findMatching(digits: string[][], target: '1' | '0') {
  return range(0, 5).reduce((options, i) => {
    if (options.length === 1) return options;

    const [most, least] = getMostCommon(options)[i];
    const targetDigit = target === '1' ? most || '1' : least || '0';
    return options.filter((opt) => opt[i] === targetDigit);
  }, digits)[0];
}

function part2(data: string) {
  const digits = data.split('\n').map((line) => line.split(''));
  const oxygen = findMatching(digits, '1');
  const co2 = findMatching(digits, '0');
  return parseInt(oxygen.join(''), 2) * parseInt(co2.join(''), 2);
}

console.log(part1(day3Data));
console.log(part2(day3Example));
