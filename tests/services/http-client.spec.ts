import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { createHttpClient } from '@/services/http-client';

vi.mock('axios', () => {
  const inst = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  };
  return { default: { create: vi.fn(() => inst) } };
});

describe('createHttpClient', () => {
  it('creates axios instance with baseURL/timeout and forwards methods', async () => {
    const client = createHttpClient({ baseURL: 'x', timeout: 1234 });
    expect((axios as any).create).toHaveBeenCalledWith({
      baseURL: 'x',
      timeout: 1234,
      headers: { 'Content-Type': 'application/json' },
    });
    await client.get!('/foo');
    expect((axios as any).create().get).toHaveBeenCalledWith('/foo');
  });
});
