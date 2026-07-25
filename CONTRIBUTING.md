# Contributing

Thanks for your interest in the SmartlyQ Node.js SDK!

## How this repo works

Most of this SDK is **generated** from the [SmartlyQ OpenAPI spec](https://docs.smartlyq.com):

- `src/generated/` - types emitted by `@hey-api/openapi-ts`. Never edit by hand.
- `src/resources.gen.ts` - the resource surface, emitted by `scripts/generate-client.ts`. Never edit by hand.
- `tests/endpoints.gen.test.ts` - endpoint tests, emitted by `scripts/generate-endpoint-tests.ts`. Never edit by hand.
- The README's API Reference section is emitted by `scripts/generate-readme-reference.ts`.

Hand-written code lives in `src/core.ts`, `src/index.ts`, `scripts/`, and `tests/core.test.ts`. Fixes to generated output belong in the generator scripts, or in the OpenAPI spec itself.

```bash
npm ci
npm run generate           # regenerate from openapi.json
npm run build && npm test
```

## Never commit secrets

This is a **public** repository. Never commit real API keys (`sqk_live_...` / `sqk_test_...`), credentials, tokens, internal hostnames, or customer data. Use placeholders like `sqk_live_xxxxxxxxxxxx` or `YOUR_API_KEY` in examples.

Enable the local pre-commit scan once per clone:

```bash
git config core.hooksPath .githooks
```

CI also runs a gitleaks scan on every push and pull request. If you believe a secret has been exposed, rotate it immediately in your Developer Dashboard.
