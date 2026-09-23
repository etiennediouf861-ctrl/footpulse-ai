import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height) {
  // Simple uncompressed or deflate PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw Image Data (Filter byte 0 + RGBA pixels)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.32;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded card or circle
      if (dist < radius) {
        // Pulse gradient inside
        if (dist < innerRadius && Math.abs(dy - Math.sin(dx / 12) * (width * 0.08)) < width * 0.04) {
          // Emerald accent pulse
          rawData[pxOffset] = 16;     // R
          rawData[pxOffset + 1] = 185; // G (Emerald)
          rawData[pxOffset + 2] = 129; // B
          rawData[pxOffset + 3] = 255; // A
        } else if (dist < innerRadius * 0.8 && (Math.abs(dx) < width * 0.06 || Math.abs(dy) < width * 0.06)) {
          // Central mark
          rawData[pxOffset] = 52;
          rawData[pxOffset + 1] = 211;
          rawData[pxOffset + 2] = 153;
          rawData[pxOffset + 3] = 255;
        } else {
          // Dark Navy Background
          rawData[pxOffset] = 12;
          rawData[pxOffset + 1] = 20;
          rawData[pxOffset + 2] = 36;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Outer border or corner
        rawData[pxOffset] = 9;
        rawData[pxOffset + 1] = 14;
        rawData[pxOffset + 2] = 26;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);

  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([len, body, crcBuf]);
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ 0xffffffff;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180));
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPNG(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), createPNG(512, 512));

console.log('PWA & iOS icons generated successfully in /public');
