/**
 * Shared spec model for the generator scripts: parses openapi.json into
 * resource groups with the final SDK method names and signatures.
 */
import { readFileSync } from 'node:fs';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

/** Tag -> client property. New/unknown tags fall back to auto-camelCase. */
const TAG_KEYS: Record<string, string> = {
  Articles: 'articles',
  Images: 'images',
  Videos: 'videos',
  Social: 'social',
  Content: 'content',
  SEO: 'seo',
  Audio: 'audio',
  URLs: 'urls',
  'AI Captain': 'captain',
  Chatbot: 'chatbots',
  Media: 'media',
  Analytics: 'analytics',
  Jobs: 'jobs',
  Account: 'account',
  Comments: 'comments',
  'Direct Messages': 'messages',
  Webhooks: 'webhooks',
  Shorts: 'shorts',
  Presentations: 'presentations',
  'CRM Contacts': 'contacts',
  'CRM Opportunities': 'opportunities',
  Workspaces: 'workspaces',
  'CRM Custom Fields': 'customFields',
  Profiles: 'profiles',
};

/** Extra noise words stripped from method names, per tag. */
const EXTRA_STOPWORDS: Record<string, string[]> = {
  'AI Captain': ['ai'],
  'Direct Messages': ['direct'],
  'CRM Contacts': ['crm'],
  'CRM Opportunities': ['crm'],
  'CRM Custom Fields': ['crm'],
};

export type MethodSpec = {
  name: string;
  operationId: string;
  httpMethod: string;
  path: string;
  summary: string;
  pathParams: { arg: string; raw: string }[];
  hasBody: boolean;
  bodyRequired: boolean;
  hasQuery: boolean;
};

export type ResourceSpec = {
  tag: string;
  key: string;
  className: string;
  methods: MethodSpec[];
};

export function camelTokens(id: string): string[] {
  return id.match(/[A-Z]?[a-z0-9]+|[A-Z]+(?![a-z])/g) ?? [id];
}

export function toCamel(tokens: string[]): string {
  return tokens
    .map((t, i) => (i === 0 ? t[0].toLowerCase() + t.slice(1) : t[0].toUpperCase() + t.slice(1)))
    .join('');
}

export function pascal(id: string): string {
  return id[0].toUpperCase() + id.slice(1);
}

export function snakeToCamel(name: string): string {
  return name.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function stopwordsFor(tag: string): Set<string> {
  const words = tag
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .concat(EXTRA_STOPWORDS[tag]?.map((w) => w.toLowerCase()) ?? []);
  const set = new Set<string>();
  for (const w of words) {
    set.add(w);
    if (w.endsWith('ies')) {
      set.add(`${w.slice(0, -3)}y`);
    } else if (w.endsWith('s')) {
      set.add(w.slice(0, -1));
    } else {
      set.add(`${w}s`);
      if (w.endsWith('y')) set.add(`${w.slice(0, -1)}ies`);
    }
  }
  return set;
}

function methodName(tag: string, operationId: string): string {
  const stop = stopwordsFor(tag);
  const kept = camelTokens(operationId).filter((t) => !stop.has(t.toLowerCase()));
  if (kept.length === 0) return operationId;
  return toCamel(kept);
}

export function buildModel(specPath = 'openapi.json'): ResourceSpec[] {
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));

  const resolveParam = (param: Record<string, unknown>): { name: string; in: string } => {
    if (typeof param.$ref === 'string') {
      const name = param.$ref.split('/').pop()!;
      return spec.components.parameters[name];
    }
    return param as { name: string; in: string };
  };

  const byTag = new Map<string, MethodSpec[]>();

  for (const [path, methods] of Object.entries(
    spec.paths as Record<string, Record<string, Record<string, unknown>>>,
  )) {
    for (const httpMethod of HTTP_METHODS) {
      const op = methods[httpMethod] as
        | {
            operationId: string;
            summary?: string;
            tags?: string[];
            parameters?: Record<string, unknown>[];
            requestBody?: { required?: boolean };
          }
        | undefined;
      if (!op) continue;
      const tag = op.tags?.[0] ?? 'Other';
      const params = (op.parameters ?? []).map(resolveParam);
      const entry: MethodSpec = {
        name: methodName(tag, op.operationId),
        operationId: op.operationId,
        httpMethod: httpMethod.toUpperCase(),
        path,
        summary: op.summary ?? `${httpMethod.toUpperCase()} ${path}`,
        pathParams: params
          .filter((p) => p.in === 'path')
          .map((p) => ({ arg: snakeToCamel(p.name), raw: p.name })),
        hasBody: op.requestBody !== undefined,
        bodyRequired: op.requestBody?.required !== false,
        hasQuery: params.some((p) => p.in === 'query'),
      };
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag)!.push(entry);
    }
  }

  // Collision guard: if two ops in a resource shorten to the same name, keep operationIds.
  for (const methods of byTag.values()) {
    const counts = new Map<string, number>();
    for (const m of methods) counts.set(m.name, (counts.get(m.name) ?? 0) + 1);
    for (const m of methods) {
      if (counts.get(m.name)! > 1) m.name = m.operationId;
    }
  }

  return [...byTag.keys()].sort((a, b) => a.localeCompare(b)).map((tag) => {
    const key = TAG_KEYS[tag] ?? toCamel(camelTokens(tag.replace(/\s+/g, '')));
    return { tag, key, className: `${pascal(key)}Resource`, methods: byTag.get(tag)! };
  });
}
