import { BitStream } from 'bit-buffer';
import { range, sumBy } from 'lodash';
import { day16Data } from './data';

enum PacketType {
  SUM = 0,
  PRODUCT = 1,
  MINIMUM = 2,
  MAXIMUM = 3,
  NUMBER = 4,
  GT = 5,
  LT = 6,
  EQ = 7,
}

type Packet = {
  type: PacketType.NUMBER;
  version: number;
  value: number;
  children?: never;
} | {
  type: Exclude<PacketType, PacketType.NUMBER>;
  version: number;
  children: Packet[]
  value?: never;
};

function decodeNumber(bits: BitStream): number {
  let result = 0;
  let hasMore = true;
  while (hasMore) {
    hasMore = !!bits.readBits(1);
    const part = bits.readBits(4);
    result = result * 16 + part;
  }
  return result;
}

function decodeOperator(bits: BitStream): Packet[] {
  const hasNumberOfSubpackets = !!bits.readBits(1);
  if (hasNumberOfSubpackets) {
    const numberOfSubpackets = bits.readBits(11);
    return range(0, numberOfSubpackets).map(
      () => decodePacket(bits),
    );
  }
  const totalLength = bits.readBits(15);
  const initialLength = bits.bitsLeft;
  const packets: Packet[] = [];
  while (bits.bitsLeft > initialLength - totalLength) {
    packets.push(decodePacket(bits));
  }

  return packets;
}

function decode(bits: BitStream, type: PacketType): Omit<Packet, 'version'> {
  if (type === PacketType.NUMBER) {
    const value = decodeNumber(bits);
    return { type, value };
  }
  return { type, children: decodeOperator(bits) };
}

function decodePacket(bits: BitStream): Packet {
  const version = bits.readBits(3);
  const type = bits.readBits(3) as PacketType;
  return { version, ...decode(bits, type) } as Packet;
}

function parse(data: string): BitStream {
  const bits = Uint8Array.from(Buffer.from(data, 'hex'));
  const stream = new BitStream(bits.buffer, 0, data.length / 2);
  stream.bigEndian = true;
  return stream;
}

function countVersions(packet: Packet) {
  return packet.version + sumBy(packet.children || [], countVersions);
}

function part1(data: string) {
  return countVersions(decodePacket(parse(data)));
}

const min = (result: number, nextPacket: Packet) => Math.min(result, solvePacket(nextPacket));
const max = (result: number, nextPacket: Packet) => Math.max(result, solvePacket(nextPacket));
function solvePacket(packet: Packet): number {
  switch (packet.type) {
    case PacketType.SUM:
      return packet.children?.reduce((result, nextPacket) => result + solvePacket(nextPacket), 0);
    case PacketType.PRODUCT:
      return packet.children?.reduce((result, nextPacket) => result * solvePacket(nextPacket), 1);
    case PacketType.MINIMUM:
      return packet.children?.reduce(min, Number.MAX_VALUE);
    case PacketType.MAXIMUM:
      return packet.children?.reduce(max, Number.MIN_VALUE);
    case PacketType.NUMBER:
      return packet.value;
    case PacketType.GT:
      return solvePacket(packet.children[0]) > solvePacket(packet.children[1]) ? 1 : 0;
    case PacketType.LT:
      return solvePacket(packet.children[0]) < solvePacket(packet.children[1]) ? 1 : 0;
    case PacketType.EQ:
    default:
      return solvePacket(packet.children[0]) === solvePacket(packet.children[1]) ? 1 : 0;
  }
}

function part2(data: string) {
  return solvePacket(decodePacket(parse(data)));
}

console.log(part1(day16Data));
console.log(part2(day16Data));
