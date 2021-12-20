import { groupBy, negate, sum, sumBy } from 'lodash';
import { day8Data } from './data';

function part1(inputData: string) {
  const splitLines = inputData.split('\n');
  const lines = splitLines.map((line) => {
    const [input, output] = line.split(' | ');
    return { input: input.split(' '), output: output.split(' ') };
  });
  return sumBy(
    lines,
    ({ output }) =>
      output.filter(({ length }) => length <= 4 || length === 7).length,
  );
}

function matchesAll(val: string, other: string) {
  return val.split('').every((letter) => other.includes(letter));
}
const doesNotMatchAll = negate(matchesAll);

function digit(possibilities?: string[]) {
  const possibleNumbers = possibilities || new Array(10).map(([, i]) => i);
  return {
    including: (other: string) =>
      possibleNumbers.find((n) => matchesAll(other, n)),
    notIncluding: (other: string) =>
      possibleNumbers.find((n) => doesNotMatchAll(other, n)),
    includedBy: (other: string) =>
      possibleNumbers.find((n) => matchesAll(n, other)),
    notIncludedBy: (other: string) =>
      possibleNumbers.find((n) => doesNotMatchAll(n, other)),
  };
}

function part2(inputData: string) {
  const splitLines = inputData.split('\n');
  const lines = splitLines.map((line) => {
    const [input, output] = line.split(' | ');
    return { input: input.split(' '), output: output.split(' ') };
  });

  const values = lines.map(({ input, output }) => {
    const digits = new Array<string>(10);
    const inputsByLength = groupBy(input, 'length');

    digits[1] = inputsByLength[2][0];
    digits[4] = inputsByLength[4][0];
    digits[7] = inputsByLength[3][0];
    digits[8] = inputsByLength[7][0];
    digits[3] = digit(inputsByLength[5]).including(digits[1]);
    digits[9] = digit(inputsByLength[6]).including(digits[4]);
    digits[6] = digit(inputsByLength[6]).notIncluding(digits[1]);
    digits[5] = digit(inputsByLength[5]).includedBy(digits[6]);
    digits[2] = digit(inputsByLength[5]).notIncludedBy(digits[9]);
    digits[0] = digit(inputsByLength[6]).notIncluding(digits[5]);

    const sortLetters = (d: string) => d.split('').sort().join('');
    const outputDigits = output.map((outputDigit) =>
      digits
        .findIndex((d) => sortLetters(outputDigit) === sortLetters(d))
        .toString(),
    );
    return parseInt(outputDigits.join(''), 10);
  });

  return sum(values);
}

console.log(part1(day8Data));
console.log(part2(day8Data));
