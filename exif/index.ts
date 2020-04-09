import Parser from './lib/parser';
import DOMBufferStream from './lib/dom-bufferstream';
import NodeBufferStream from './lib/bufferstream';

function getGlobal() {
	return (1,eval)('this');
}

export default {
  create: function(buffer: Buffer, global: any) {
    global = global || getGlobal();

    if (buffer instanceof global.ArrayBuffer) {
      return new Parser(new DOMBufferStream(buffer, 0, buffer.byteLength, true, global, 0));
    } else {
      return new Parser(new NodeBufferStream(buffer, 0, buffer.length, true));
    }
  }
};
