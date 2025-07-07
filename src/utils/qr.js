import qr from 'qr-image';

export function generateQrPng(data) {
  return qr.imageSync(data, { type: 'png', margin: 1 });
} 