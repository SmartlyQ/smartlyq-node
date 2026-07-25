/**
 * SmartlyQ SDK core HTTP client.
 * Hand-written; the resource surface in `resources.gen.ts` is generated on top of it.
 */

export interface ClientOptions {
  /** SmartlyQ API key (`sqk_live_...` or `sqk_test_...`). Falls back to `SMARTLYQ_API_KEY`. */
  apiKey?: string;
  /** API base URL. Defaults to `https://api.smartlyq.com/v1`. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 60_000. */
  timeout?: number;
  /** Max automatic retries on 429/5xx. Defaults to 2. Set 0 to disable. */
  maxRetries?: number;
  /** Extra headers sent with every request. */
  defaultHeaders?: Record<string, string>;
  /** Custom fetch implementation (for testing or polyfills). */
  fetch?: typeof globalThis.fetch;
}

export interface RequestOptions {
  /** Per-request headers (merged over defaults). */
  headers?: Record<string, string>;
  /** Acts on behalf of a managed Profile (sent as `X-Profile-Id`). */
  profileId?: string;
  /** Idempotency key for safely retrying write requests. */
  idempotencyKey?: string;
  /** Overrides the client timeout for this request. */
  timeout?: number;
  /** Abort signal for cancellation. */
  signal?: AbortSignal;
}

interface InternalRequest {
  body?: unknown;
  query?: Record<string, unknown>;
  options?: RequestOptions;
}

interface ApiErrorEnvelope {
  success?: boolean;
  error?: { code?: string; message?: string; details?: Record<string, unknown> };
  meta?: { request_id?: string };
}

/** Error thrown for any non-2xx API response. */
export class SmartlyQError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
  readonly requestId?: string;

  constructor(status: number, envelope: ApiErrorEnvelope | undefined, fallback: string) {
    super(envelope?.error?.message ?? fallback);
    this.name = 'SmartlyQError';
    this.status = status;
    this.code = envelope?.error?.code;
    this.details = envelope?.error?.details;
    this.requestId = envelope?.meta?.request_id;
  }
}

/** Error thrown when a request times out or is aborted. */
export class SmartlyQConnectionError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'SmartlyQConnectionError';
  }
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

export class CoreClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly defaultHeaders: Record<string, string>;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(options: ClientOptions = {}) {
    const apiKey =
      options.apiKey ??
      (typeof process !== 'undefined' ? process.env?.SMARTLYQ_API_KEY : undefined);
    if (!apiKey) {
      throw new Error(
        'Missing API key. Pass `apiKey` to the client or set the SMARTLYQ_API_KEY environment variable.',
      );
    }
    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl ?? 'https://api.smartlyq.com/v1').replace(/\/+$/, '');
    this.timeout = options.timeout ?? 60_000;
    this.maxRetries = options.maxRetries ?? 2;
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl) {
      throw new Error('No fetch implementation available. Use Node 18+ or pass `fetch`.');
    }
  }

  async request<T>(method: string, path: string, req: InternalRequest = {}): Promise<T> {
    const url = this.buildUrl(path, req.query);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'User-Agent': '@smartlyqofficial/node',
      ...this.defaultHeaders,
      ...req.options?.headers,
    };
    if (req.body !== undefined) headers['Content-Type'] = 'application/json';
    if (req.options?.profileId) headers['X-Profile-Id'] = req.options.profileId;
    if (req.options?.idempotencyKey) headers['Idempotency-Key'] = req.options.idempotencyKey;

    const timeout = req.options?.timeout ?? this.timeout;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      const onOuterAbort = () => controller.abort();
      req.options?.signal?.addEventListener('abort', onOuterAbort);

      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method,
          headers,
          body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
          signal: controller.signal,
        });
      } catch (err) {
        lastError = err;
        if (req.options?.signal?.aborted) {
          throw new SmartlyQConnectionError('Request aborted', err);
        }
        if (attempt < this.maxRetries) {
          await sleep(backoffMs(attempt));
          continue;
        }
        throw new SmartlyQConnectionError(`Request failed: ${String(err)}`, err);
      } finally {
        clearTimeout(timer);
        req.options?.signal?.removeEventListener('abort', onOuterAbort);
      }

      if (response.ok) {
        if (response.status === 204) return undefined as T;
        return (await response.json()) as T;
      }

      const envelope = (await response.json().catch(() => undefined)) as
        | ApiErrorEnvelope
        | undefined;

      if (RETRYABLE_STATUSES.has(response.status) && attempt < this.maxRetries) {
        const retryAfter = Number(response.headers.get('Retry-After'));
        await sleep(retryAfter > 0 ? retryAfter * 1000 : backoffMs(attempt));
        continue;
      }

      throw new SmartlyQError(response.status, envelope, `HTTP ${response.status}`);
    }

    /* istanbul ignore next -- loop always returns or throws */
    throw new SmartlyQConnectionError(`Request failed: ${String(lastError)}`, lastError);
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          for (const item of value) url.searchParams.append(key, String(item));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }
}

function backoffMs(attempt: number): number {
  const base = 500 * 2 ** attempt;
  return base + Math.random() * base * 0.25;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
