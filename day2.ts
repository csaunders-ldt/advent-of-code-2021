import { day2Data } from './data';

function part1(data: string) {
  const result = data.split('\n').reduce(
    ({ depth, position }, line) => {
      const [instruction, value] = line.split(' ');
      const number = parseInt(value);
      switch (instruction) {
        case 'forward':
          return { depth, position: position + number };
        case 'down':
          return { depth: depth + number, position };
        case 'up':
        default:
          return { depth: depth - number, position };
      }
    },
    { depth: 0, position: 0 },
  );
  return result.depth * result.position;
}

function part2(data: string) {
  const result = data.split('\n').reduce(
    ({ depth, position, aim }, line) => {
      const [instruction, value] = line.split(' ');
      const number = parseInt(value);
      switch (instruction) {
        case 'forward':
          return {
            depth: depth + aim * number,
            position: position + number,
            aim,
          };
        case 'down':
          return { depth, position, aim: aim + number };
        case 'up':
        default:
          return { depth, position, aim: aim - number };
      }
    },
    { depth: 0, position: 0, aim: 0 },
  );
  return result.depth * result.position;
}

console.log(part1(day2Data));
console.log(part2(day2Data));
