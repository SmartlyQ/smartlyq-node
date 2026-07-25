/**
 * Regenerates the "API Reference" section of README.md (between the marker
 * comments) from openapi.json, so the README always matches the SDK surface.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildModel, type MethodSpec } from './model';

const BEGIN = '<!-- BEGIN GENERATED REFERENCE -->';
const END = '<!-- END GENERATED REFERENCE -->';

function signature(resourceKey: string, m: MethodSpec): string {
  const args: string[] = [];
  for (const p of m.pathParams) args.push(p.arg);
  if (m.hasBody) args.push(m.bodyRequired ? 'body' : 'body?');
  if (m.hasQuery) args.push('query?');
  return `sq.${resourceKey}.${m.name}(${args.join(', ')})`;
}

const resources = buildModel();
const lines: string[] = [];

for (const r of resources) {
  lines.push(`### ${r.tag}`, '');
  lines.push('| Method | Endpoint | Description |');
  lines.push('| --- | --- | --- |');
  for (const m of r.methods) {
    lines.push(`| \`${signature(r.key, m)}\` | \`${m.httpMethod} ${m.path}\` | ${m.summary} |`);
  }
  lines.push('');
}

const readme = readFileSync('README.md', 'utf8');
const beginIdx = readme.indexOf(BEGIN);
const endIdx = readme.indexOf(END);
if (beginIdx === -1 || endIdx === -1) {
  throw new Error('README.md is missing the generated-reference markers.');
}

const updated =
  readme.slice(0, beginIdx + BEGIN.length) + '\n\n' + lines.join('\n') + readme.slice(endIdx);
writeFileSync('README.md', updated);

const count = resources.reduce((n, r) => n + r.methods.length, 0);
console.log(`README reference updated: ${resources.length} resources, ${count} methods.`);
