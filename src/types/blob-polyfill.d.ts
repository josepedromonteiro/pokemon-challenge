declare module 'blob-polyfill' {
  export class Blob {
    constructor(parts?: BlobPart[], options?: BlobPropertyBag);

    readonly size: number;
    readonly type: string;

    text(): Promise<string>;
  }

  export class File extends Blob {
    readonly name: string;
  }
}
