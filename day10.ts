import { reverse, sortBy } from 'lodash';
import { day10Example, day10Data } from './data';

const pairs = { '[': ']', '{': '}', '<': '>', '(': ')' };
const opens = Object.keys(pairs);
const scores = { ']': 57, '}': 1197, '>': 25137, ')': 3 };

function part1(data: string) {
  return data.split('\n').reduce((score, line) => {
    const stack: string[] = [];
    const firstFail = line.split('').find((char) => {
      if (opens.includes(char)) {
        stack.push(char);
        return false;
      }
      if (pairs[stack[stack.length - 1]] !== char) {
        return true;
      }
      stack.pop();
    });
    return score + (scores[firstFail || ''] || 0);
  }, 0);
}

const part2Scores = { '[': 2, '{': 3, '<': 4, '(': 1 };
function part2(data: string) {
  const scores = data.split('\n').map((line) => {
    const stack: string[] = [];
    const hasFailed = line.split('').find((char) => {
      if (opens.includes(char)) {
        stack.push(char);
        return false;
      }
      if (pairs[stack[stack.length - 1]] !== char) {
        return true;
      }
      stack.pop();
    });
    if (hasFailed) return;
    return reverse(stack)
      .map((start) => part2Scores[start])
      .reduce((score, next) => score * 5 + next, 0);
  });
  const sortedScores = sortBy(scores.filter(Boolean));
  return sortedScores[sortedScores.length / 2 - 0.5];
}

console.log(part1(day10Data));
console.log(part2(day10Data));
