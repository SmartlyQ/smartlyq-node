import { describe, it, expect } from 'vitest';
import { SmartlyQ, SmartlyQError } from '../src/index';

function makeFetch(handler: (input: string, init?: RequestInit) => Response | Promise<Response>) {
  return (async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init)) as typeof fetch;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('CoreClient', () => {
  it('sends the API key as a Bearer token', async () => {
    let auth: string | undefined;
    const sq = new SmartlyQ({
      apiKey: 'sqk_test_xxxxxxxxxxxx',
      fetch: makeFetch((_url, init) => {
        auth = new Headers(init?.headers).get('Authorization') ?? undefined;
        return json(200, { success: true });
      }),
    });
    await sq.account.getMe();
    expect(auth).toBe('Bearer sqk_test_xxxxxxxxxxxx');
  });

  it('throws when no API key is provided', () => {
    const prev = process.env.SMARTLYQ_API_KEY;
    delete process.env.SMARTLYQ_API_KEY;
    try {
      expect(() => new SmartlyQ({})).toThrow(/Missing API key/);
    } finally {
      if (prev !== undefined) process.env.SMARTLYQ_API_KEY = prev;
    }
  });

  it('serializes query params and skips undefined values', async () => {
    let url = '';
    const sq = new SmartlyQ({
      apiKey: 'sqk_test_xxxxxxxxxxxx',
      fetch: makeFetch((u) => {
        url = u;
        return json(200, { success: true });
      }),
    });
    await sq.articles.list({ page: 2, status: 'draft', search: undefined });
    expect(url).toContain('/articles?page=2&status=draft');
    expect(url).not.toContain('search');
  });

  it('throws SmartlyQError with code and requestId on API errors', async () => {
    const sq = new SmartlyQ({
      apiKey: 'sqk_test_xxxxxxxxxxxx',
      maxRetries: 0,
      fetch: makeFetch(() =>
        json(402, {
          success: false,
          error: { code: 'INSUFFICIENT_CREDITS', message: 'Not enough credits' },
          meta: { request_id: 'req_1' },
        }),
      ),
    });
    const err = await sq.images.generate({ prompt: 'x' }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SmartlyQError);
    expect((err as SmartlyQError).status).toBe(402);
    expect((err as SmartlyQError).code).toBe('INSUFFICIENT_CREDITS');
    expect((err as SmartlyQError).requestId).toBe('req_1');
  });

  it('retries on 429 and then succeeds', async () => {
    let attempts = 0;
    const sq = new SmartlyQ({
      apiKey: 'sqk_test_xxxxxxxxxxxx',
      maxRetries: 2,
      fetch: makeFetch(() => {
        attempts += 1;
        if (attempts < 3) {
          return new Response(JSON.stringify({ success: false }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '0' },
          });
        }
        return json(200, { success: true });
      }),
    });
    await sq.account.getMe();
    expect(attempts).toBe(3);
  });

  it('does not retry non-retryable errors', async () => {
    let attempts = 0;
    const sq = new SmartlyQ({
      apiKey: 'sqk_test_xxxxxxxxxxxx',
      maxRetries: 2,
      fetch: makeFetch(() => {
        attempts += 1;
        return json(400, { success: false, error: { message: 'bad' } });
      }),
    });
    await expect(sq.account.getMe()).rejects.toThrow('bad');
    expect(attempts).toBe(1);
  });

  it('sends profileId and idempotencyKey headers', async () => {
    let headers: Headers | undefined;
    const sq = new SmartlyQ({
      apiKey: 'sqk_test_xxxxxxxxxxxx',
      fetch: makeFetch((_u, init) => {
        headers = new Headers(init?.headers);
        return json(200, { success: true });
      }),
    });
    await sq.social.createPost({} as never, { profileId: 'prof_1', idempotencyKey: 'idem_1' });
    expect(headers?.get('X-Profile-Id')).toBe('prof_1');
    expect(headers?.get('Idempotency-Key')).toBe('idem_1');
  });

  it('accepts a plain string API key constructor', async () => {
    const sq = new SmartlyQ('sqk_test_xxxxxxxxxxxx');
    expect(sq.account).toBeDefined();
  });
});
