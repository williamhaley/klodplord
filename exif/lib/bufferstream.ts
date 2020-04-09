import { Marker } from '../types';

class NodeBufferStream {
  buffer: Buffer;
  offset: number;
  endPosition: number;
  bigEndian: boolean;

  constructor (buffer: Buffer, offset: number, length: number, bigEndian: boolean) {
    this.buffer = buffer;
    this.offset = offset || 0;
    length = typeof length === 'number' ? length : buffer.length;
    this.endPosition = this.offset + length;
    this.setBigEndian(bigEndian);
  }

  setBigEndian(bigEndian: boolean) {
    this.bigEndian = !!bigEndian;
  }

  nextUInt8() {
    var value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  nextInt8() {
    var value = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return value;
  }

  nextUInt16() {
    var value = this.bigEndian ? this.buffer.readUInt16BE(this.offset) : this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  nextUInt32() {
    var value = this.bigEndian ? this.buffer.readUInt32BE(this.offset) : this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  nextInt16() {
    var value = this.bigEndian ? this.buffer.readInt16BE(this.offset) : this.buffer.readInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  nextInt32() {
    var value = this.bigEndian ? this.buffer.readInt32BE(this.offset) : this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  nextFloat() {
    var value = this.bigEndian ? this.buffer.readFloatBE(this.offset) : this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  nextDouble() {
    var value = this.bigEndian ? this.buffer.readDoubleBE(this.offset) : this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }

  nextBuffer(length: number) {
    var value = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  remainingLength() {
    return this.endPosition - this.offset;
  }

  nextString(length: number) {
    var value = this.buffer.toString('utf8', this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  mark() {
    var self = this;
    return {
      openWithOffset(offset: number) {
        offset = (offset || 0) + this.offset;
        return new NodeBufferStream(self.buffer, offset, self.endPosition - offset, self.bigEndian);
      },
      offset: this.offset
    };
  }

  offsetFrom(marker: Marker) {
    return this.offset - marker.offset;
  }

  skip(amount: number) {
    this.offset += amount;
  }

  branch(offset: number, length: number) {
    length = typeof length === 'number' ? length : this.endPosition - (this.offset + offset);
    return new NodeBufferStream(this.buffer, this.offset + offset, length, this.bigEndian);
  }
}

export default NodeBufferStream;
