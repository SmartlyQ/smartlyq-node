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

export class SmartlyQ {
  readonly account: Resources['account'];
  readonly analytics: Resources['analytics'];
  readonly articles: Resources['articles'];
  readonly audio: Resources['audio'];
  readonly captain: Resources['captain'];
  readonly chatbots: Resources['chatbots'];
  readonly comments: Resources['comments'];
  readonly contacts: Resources['contacts'];
  readonly content: Resources['content'];
  readonly customFields: Resources['customFields'];
  readonly images: Resources['images'];
  readonly jobs: Resources['jobs'];
  readonly media: Resources['media'];
  readonly messages: Resources['messages'];
  readonly opportunities: Resources['opportunities'];
  readonly presentations: Resources['presentations'];
  readonly profiles: Resources['profiles'];
  readonly seo: Resources['seo'];
  readonly shorts: Resources['shorts'];
  readonly social: Resources['social'];
  readonly urls: Resources['urls'];
  readonly videos: Resources['videos'];
  readonly webhooks: Resources['webhooks'];
  readonly workspaces: Resources['workspaces'];

  /** The underlying HTTP client, for advanced use (custom requests). */
  readonly core: CoreClient;

  constructor(options: ClientOptions | string = {}) {
    const resolved = typeof options === 'string' ? { apiKey: options } : options;
    this.core = new CoreClient(resolved);
    const resources = createResources(this.core);
    this.account = resources.account;
    this.analytics = resources.analytics;
    this.articles = resources.articles;
    this.audio = resources.audio;
    this.captain = resources.captain;
    this.chatbots = resources.chatbots;
    this.comments = resources.comments;
    this.contacts = resources.contacts;
    this.content = resources.content;
    this.customFields = resources.customFields;
    this.images = resources.images;
    this.jobs = resources.jobs;
    this.media = resources.media;
    this.messages = resources.messages;
    this.opportunities = resources.opportunities;
    this.presentations = resources.presentations;
    this.profiles = resources.profiles;
    this.seo = resources.seo;
    this.shorts = resources.shorts;
    this.social = resources.social;
    this.urls = resources.urls;
    this.videos = resources.videos;
    this.webhooks = resources.webhooks;
    this.workspaces = resources.workspaces;
  }
}

export default SmartlyQ;
export { SmartlyQError, SmartlyQConnectionError, CoreClient } from './core';
export type { ClientOptions, RequestOptions } from './core';
export * from './resources.gen';
export type * from './generated/types.gen';
