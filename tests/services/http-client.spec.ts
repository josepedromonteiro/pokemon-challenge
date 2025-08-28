import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';

import { createHttpClient } from '@/services/http-client';

vi.mock('axios', () => {
  const inst = {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  };
  return { default: { create: vi.fn(() => inst) } };
});

describe('createHttpClient', () => {
  it('creates axios instance with baseURL/timeout and forwards methods', async () => {
    const client = createHttpClient({ baseURL: 'x', timeout: 1234 });
    expect((axios as any).create).toHaveBeenCalledWith({
      baseURL: 'x',
      headers: { 'Content-Type': 'application/json' },
      timeout: 1234,
    });
    await client.get!('/foo');
    expect((axios as any).create().get).toHaveBeenCalledWith('/foo');
  });
});
