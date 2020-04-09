import { Marker } from '../types';

class DOMBufferStream {
  global: any;
  arrayBuffer: ArrayBuffer;
  view: any;
  offset: number;
  parentOffset: number;
  littleEndian: boolean;

  constructor(arrayBuffer: ArrayBuffer, offset: number, length: number, bigEndian: boolean, global: any, parentOffset: number) {
    this.global = global;
    offset = offset || 0;
    length = length || (arrayBuffer.byteLength - offset);
    this.arrayBuffer = arrayBuffer.slice(offset, offset + length);
    this.view = new global.DataView(this.arrayBuffer, 0, this.arrayBuffer.byteLength);
    this.setBigEndian(bigEndian);
    this.offset = 0;
    this.parentOffset = (parentOffset || 0) + offset;
  }

  setBigEndian(bigEndian: boolean) {
    this.littleEndian = !bigEndian;
  }

  nextUInt8() {
    var value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  nextInt8() {
    var value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  nextUInt16() {
    var value = this.view.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }

  nextUInt32() {
    var value = this.view.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  nextInt16() {
    var value = this.view.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }

  nextInt32() {
    var value = this.view.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  nextFloat() {
    var value = this.view.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  nextDouble() {
    var value = this.view.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }

  nextBuffer(length: number) {
    //this won't work in IE10
    var value = this.arrayBuffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  remainingLength() {
    return this.arrayBuffer.byteLength - this.offset;
  }

  nextString(length: number) {
    var value = this.arrayBuffer.slice(this.offset, this.offset + length);
    value = String.fromCharCode.apply(null, new this.global.Uint8Array(value));
    this.offset += length;
    return value;
  }

  mark() {
    var self = this;
    return {
      openWithOffset(offset: number) {
        offset = (offset || 0) + this.offset;
        return new DOMBufferStream(self.arrayBuffer, offset, self.arrayBuffer.byteLength - offset, !self.littleEndian, self.global, self.parentOffset);
      },
      offset: this.offset,
      getParentOffset() {
        return self.parentOffset;
      }
    };
  }

  offsetFrom(marker: Marker) {
    return this.parentOffset + this.offset - (marker.offset + marker.getParentOffset());
  }

  skip(amount: number) {
    this.offset += amount;
  }

  branch(offset: number, length: number) {
    length = typeof length === 'number' ? length : this.arrayBuffer.byteLength - (this.offset + offset);
    return new DOMBufferStream(this.arrayBuffer, this.offset + offset, length, !this.littleEndian, this.global, this.parentOffset);
  }
}

export default DOMBufferStream;
