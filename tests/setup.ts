import { Blob as PolyBlob, File as PolyFile } from 'blob-polyfill';

if (typeof (globalThis.Blob as any)?.prototype?.text !== 'function') {
  globalThis.Blob = PolyBlob as unknown as typeof Blob;
  globalThis.File = PolyFile as unknown as typeof File;
}
