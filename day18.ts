import { day18Data } from './data';
import { permutations } from 'combinatorial-generators';

type Pair = [Node, Node];
type Node = Pair | number;
type Result = { node: Node; success?: boolean };
type Explode = Result & { carry?: { left?: number; right?: number } };

function isNumber(node: Node): node is number {
  return node[0] === undefined;
}

function increaseL(node: Node, value: number) {
  return isNumber(node) ? node + value : [increaseL(node[0], value), node[1]];
}

function increaseR(node: Node, value: number) {
  return isNumber(node) ? node + value : [node[0], increaseR(node[1], value)];
}

function explode(node: Node, depth = 1): Explode {
  if (isNumber(node)) return { node };

  const [left, right] = node;
  if (depth > 4 && isNumber(left) && isNumber(right)) {
    return { node: 0, carry: { left, right }, success: true };
  }
  const leftResult = explode(left, depth + 1);

  if (leftResult.success) {
    const newRightNode = increaseL(right, leftResult?.carry?.right || 0);
    return {
      node: [leftResult?.node || 0, newRightNode],
      carry: { left: leftResult?.carry?.left },
      success: true,
    };
  }
  const rightResult = explode(right, depth + 1);
  if (!rightResult.success) return { node };

  const newLeftNode = increaseR(left, rightResult?.carry?.left || 0);
  return {
    node: [newLeftNode, rightResult.node],
    carry: { right: rightResult?.carry?.right },
    success: true,
  };
}

function split(node: Node): Result {
  if (isNumber(node)) {
    if (node < 10) return { node };
    return { node: [Math.floor(node / 2), Math.ceil(node / 2)], success: true };
  }
  const [left, right] = node;
  const lResult = split(left);
  if (lResult.success) return { node: [lResult.node, right], success: true };

  const rResult = split(right);
  return { success: rResult.success, node: [lResult.node, rResult.node] };
}

function multiplyOut(node: Node) {
  if (isNumber(node)) return node;
  const [left, right] = node;
  return multiplyOut(left) * 3 + multiplyOut(right) * 2;
}

function parse(data: string): Pair[] {
  return data.split('\n').map((line) => JSON.parse(line));
}

function reduce(pair: Pair): Pair {
  let result: Result = { node: pair, success: true };
  while (result.success) {
    console.log(JSON.stringify(result.node));
    result = explode(result.node);
    if (result.success) continue;
    result = split(result.node);
  }
  return result.node as Pair;
}

function part1(data: string) {
  const lines = parse(data);
  const finalValue = lines.reduce((prev, next) => reduce([prev, next]));
  console.log('fv + ' + JSON.stringify(finalValue));
  return multiplyOut(finalValue);
}

function part2(data: string) {
  const lines = parse(data);
  const options = [...permutations(lines, 2)].map(([l1, l2]) =>
    multiplyOut(reduce([l1, l2])),
  );
  return Math.max(...options);
}

console.log(part1(day18Data));
console.log(part2(day18Data));
