// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toCSV } from '@/utils/csv.util.ts';

const blobToText = async (b: Blob | null) => {
  return b?.text() ?? '';
};

describe('toCSV', () => {
  const realCreateObjURL = URL.createObjectURL;
  const realRevokeObjURL = URL.revokeObjectURL;
  const realCreateElement = document.createElement;

  let createURLSpy: ReturnType<typeof vi.fn>;
  let revokeURLSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;
  let lastBlob: Blob | null = null;

  beforeEach(() => {
    lastBlob = null;
    clickSpy = vi.fn();
    createURLSpy = vi.fn((blob: Blob) => {
      lastBlob = blob;
      return 'blob:mock-url';
    });
    revokeURLSpy = vi.fn();

    URL.createObjectURL = createURLSpy;
    URL.revokeObjectURL = revokeURLSpy;

    vi.spyOn(document, 'createElement').mockImplementation((tag: any) => {
      if (String(tag).toLowerCase() === 'a') {
        return { href: '', download: '', click: clickSpy } as any;
      }
      return realCreateElement.call(document, tag);
    });
  });

  afterEach(() => {
    URL.createObjectURL = realCreateObjURL;
    URL.revokeObjectURL = realRevokeObjURL;
    vi.restoreAllMocks();
  });

  it('returns early on empty rows (no side effects)', () => {
    expect(toCSV([])).toBeUndefined();
    expect(createURLSpy).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
    expect(revokeURLSpy).not.toHaveBeenCalled();
  });

  it('creates CSV, clicks anchor, and revokes URL (default filename)', async () => {
    const rows = [
      {
        id: 1,
        name: 'bulba, "saur"',
        image: 'img',
        note: '',
        caughtAt: '2020-01-01T00:00:00Z',
      },
      {
        name: 'ivysaur',
        id: 2,
        image: 'img',
        caughtAt: '2020-01-02T00:00:00Z',
      },
    ];

    toCSV(rows);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    const anchor = (document.createElement as any).mock.results[0].value;
    expect(anchor.download).toBe('pokedex.csv');
    expect(anchor.href).toBe('blob:mock-url');

    expect(createURLSpy).toHaveBeenCalledTimes(1);
    expect(revokeURLSpy).toHaveBeenCalledWith('blob:mock-url');

    expect(lastBlob).toBeInstanceOf(Blob);
    const text = await blobToText(lastBlob);
    const lines = text.split('\n');

    expect(lines[0]).toBe('id,name,image,note,caughtAt');

    expect(lines[1]).toBe('1,"bulba, ""saur""",img,,2020-01-01T00:00:00Z');

    expect(lines[2]).toBe('2,ivysaur,img,,2020-01-02T00:00:00Z');

    expect((lastBlob as Blob).type).toBe('text/csv;charset=utf-8;');
  });

  it('uses provided filename', () => {
    toCSV([{ a: 1 }], 'custom.csv');
    const anchor = (document.createElement as any).mock.results.at(-1).value;
    expect(anchor.download).toBe('custom.csv');
  });

  it('escapes newlines and quotes in cells', async () => {
    const rows = [{ text: 'hello\nworld', note: 'she said "hi"' }];
    toCSV(rows, 'x.csv');
    const text = await blobToText(lastBlob);
    const [header, ...rest] = text.split('\n');

    expect(header).toBe('text,note');
    expect(rest.join('\n')).toBe('"hello\nworld","she said ""hi"""');
  });
});
