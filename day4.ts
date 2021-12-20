import { chunk, sum, zip } from 'lodash';
import { day4Example, day4Data } from './data';

type BingoBoard = {
  markedNumbers: Set<number>;
  numbers: number[][];
  hasWon: boolean;
};

type BingoCards = {
  numbers: number[];
  boards: BingoBoard[];
};
function parse(data: string): BingoCards {
  const lines = data.split('\n');
  const [firstLine, _, ...rest] = lines;
  const boards = chunk(rest, 6).map((board) =>
    board.slice(0, 5).map((line) =>
      line
        .split(/ +/)
        .filter(Boolean)
        .map((n) => parseInt(n)),
    ),
  );

  return {
    numbers: firstLine.split(',').map((n) => parseInt(n)),
    boards: boards.map((board) => ({
      markedNumbers: new Set<number>(),
      numbers: board,
      hasWon: false,
    })),
  };
}

function check(board: BingoBoard): boolean {
  const hasWon =
    board.numbers.some((line) =>
      line.every((n) => board.markedNumbers.has(n)),
    ) ||
    zip(...board.numbers).some((line) =>
      line.every((n) => n !== undefined && board.markedNumbers.has(n)),
    );
  return (board.hasWon = hasWon);
}

function part1(data: string) {
  const { numbers, boards } = parse(data);
  const winningNumber = numbers.find((n) => {
    boards.forEach((board) => board.markedNumbers.add(n));
    return boards.find(check);
  }) as number;
  const winner = boards.find(({ hasWon }) => hasWon) as BingoBoard;
  const missingNumbers = winner?.numbers
    ?.flat()
    .filter((n) => n && !winner.markedNumbers.has(n));
  return sum(missingNumbers) * winningNumber;
}

function part2(data: string) {
  const { numbers, boards } = parse(data);
  let lastBoard: BingoBoard | undefined;
  const winningNumber = numbers.find((n) => {
    boards.forEach((board) => {
      board.markedNumbers.add(n);
      check(board);
    });
    const survivors = boards.filter(({ hasWon }) => !hasWon);
    if (survivors.length === 0) return true;

    lastBoard = survivors[0];
  }) as number;
  const missingNumbers = lastBoard?.numbers
    ?.flat()
    .filter((n) => !lastBoard?.markedNumbers.has(n));
  return sum(missingNumbers) * winningNumber;
}

console.log(part1(day4Data));
console.log(part2(day4Data));
