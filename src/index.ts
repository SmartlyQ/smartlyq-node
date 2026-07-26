/**
 * SmartlyQ Node.js SDK.
 *
 * ```ts
 * import SmartlyQ from '@smartlyqofficial/node';
 *
 * const sq = new SmartlyQ({ apiKey: 'sqk_live_...' });
 * const me = await sq.account.getMe();
 * const post = await sq.social.createPost({ ... });
 * ```
 */
import { CoreClient, type ClientOptions } from './core';
import { createResources } from './resources.gen';

type Resources = ReturnType<typeof createResources>;

// Declaration merging: the interface contributes one typed property per API
// resource, sourced from the generated registry - so new resources added to
// the API surface appear here automatically, with full types. The constructor
// fulfills the interface via Object.assign(createResources(...)), which the
// lint rule cannot see - hence the targeted disables.
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-object-type
export interface SmartlyQ extends Resources {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SmartlyQ {
  /** The underlying HTTP client, for advanced use (custom requests). */
  readonly core: CoreClient;

  constructor(options: ClientOptions | string = {}) {
    const resolved = typeof options === 'string' ? { apiKey: options } : options;
    this.core = new CoreClient(resolved);
    Object.assign(this, createResources(this.core));
  }
}

export default SmartlyQ;
export { SmartlyQError, SmartlyQConnectionError, CoreClient } from './core';
export type { ClientOptions, RequestOptions } from './core';
export * from './resources.gen';
export type * from './generated/types.gen';
