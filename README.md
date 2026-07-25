# SmartlyQ Node.js SDK

[![npm](https://img.shields.io/npm/v/%40smartlyqofficial%2Fnode)](https://www.npmjs.com/package/@smartlyqofficial/node)

The official Node.js SDK for the [SmartlyQ API](https://docs.smartlyq.com) - social posting and scheduling, AI content generation (articles, images, video, audio, presentations), SEO research, CRM, chatbots, and more, from one API key.

- **Fully typed** - request and response types for every endpoint, generated from the OpenAPI spec.
- **Zero dependencies** - built on the native `fetch` (Node 18+).
- **Batteries included** - automatic retries with backoff, idempotency keys, request timeouts, typed errors.

## Installation

```bash
npm install @smartlyqofficial/node
```

## Quickstart

```ts
import SmartlyQ from '@smartlyqofficial/node';

const sq = new SmartlyQ({ apiKey: process.env.SMARTLYQ_API_KEY });

// Who am I?
const me = await sq.account.getMe();

// Generate an image with AI
const image = await sq.images.generate({ prompt: 'A minimalist product shot of a smart speaker' });

// Publish a social post
const post = await sq.social.createPost({
  text: 'Hello from the SmartlyQ SDK!',
  account_ids: ['acc_123'],
});
```

Get an API key from your [Developer Dashboard](https://app.smartlyq.com). Keys look like `sqk_live_...` (production) or `sqk_test_...` (sandbox - free simulated responses, no charges).

## Configuration

```ts
const sq = new SmartlyQ({
  apiKey: 'sqk_live_...',   // or set SMARTLYQ_API_KEY
  timeout: 60_000,           // per-request timeout in ms
  maxRetries: 2,             // automatic retries on 429/5xx
});
```

Per-request options are accepted as the last argument of every method:

```ts
await sq.social.createPost(body, {
  idempotencyKey: 'my-unique-key',  // safe retries for writes
  profileId: 'prof_123',            // act on behalf of a managed Profile
  timeout: 10_000,
});
```

## Async jobs

Generation endpoints (articles, images, videos, audio) are asynchronous: they return a job. Poll it until it completes:

```ts
const { data } = await sq.videos.generate({ prompt: 'A 5s product teaser', model: 'standard' });

let job = await sq.jobs.get(data.job_id);
while (job.data.status === 'processing' || job.data.status === 'queued') {
  await new Promise((r) => setTimeout(r, 3000));
  job = await sq.jobs.get(data.job_id);
}
console.log(job.data.result);
```

## Error handling

Every non-2xx response throws a typed `SmartlyQError`:

```ts
import { SmartlyQError } from '@smartlyqofficial/node';

try {
  await sq.articles.generate({ topic: 'AI trends' });
} catch (err) {
  if (err instanceof SmartlyQError) {
    console.error(err.status, err.code, err.message, err.requestId);
  }
}
```

## API Reference

All methods below are available on the client. Full request/response documentation lives at [docs.smartlyq.com](https://docs.smartlyq.com).

<!-- BEGIN GENERATED REFERENCE -->

### Account

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.account.getMe()` | `GET /me` | Get current user profile |
| `sq.account.getMeUsage(query?)` | `GET /me/usage` | Get usage summary |
| `sq.account.getMeBalance()` | `GET /me/balance` | Get wallet balance |

### AI Captain

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.captain.sendMessage(body)` | `POST /captain/messages` | Send AI Captain message |
| `sq.captain.listConversations(query?)` | `GET /captain/conversations` | List AI Captain conversations |
| `sq.captain.getConversation(conversationId)` | `GET /captain/conversations/{conversation_id}` | Get AI Captain conversation |

### Analytics

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.analytics.getOverview(query?)` | `GET /analytics/overview` | Get analytics overview |
| `sq.analytics.getPosts(query?)` | `GET /analytics/posts` | Get post analytics |
| `sq.analytics.getAccount(accountId, query?)` | `GET /analytics/accounts/{account_id}` | Get account analytics |

### Articles

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.articles.generate(body)` | `POST /articles/generate` | Generate article |
| `sq.articles.list(query?)` | `GET /articles` | List articles |
| `sq.articles.get(articleId)` | `GET /articles/{article_id}` | Get article |
| `sq.articles.delete(articleId)` | `DELETE /articles/{article_id}` | Delete article |

### Audio

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.audio.textToSpeech(body)` | `POST /audio/text-to-speech` | Text to speech |
| `sq.audio.speechToText(body)` | `POST /audio/speech-to-text` | Speech to text |
| `sq.audio.get(audioId)` | `GET /audio/{audio_id}` | Get audio |

### Chatbot

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.chatbots.list(query?)` | `GET /chatbots` | List chatbots |
| `sq.chatbots.create(body)` | `POST /chatbots` | Create chatbot |
| `sq.chatbots.get(id)` | `GET /chatbots/{id}` | Get chatbot |
| `sq.chatbots.update(id, body)` | `PATCH /chatbots/{id}` | Update chatbot |
| `sq.chatbots.delete(id)` | `DELETE /chatbots/{id}` | Delete chatbot |
| `sq.chatbots.train(id)` | `POST /chatbots/{id}/train` | Start chatbot training |
| `sq.chatbots.getTrainStatus(id)` | `GET /chatbots/{id}/train-status` | Get chatbot training status |
| `sq.chatbots.sendMessage(id, body)` | `POST /chatbots/{id}/messages` | Send chatbot message |
| `sq.chatbots.listConversations(id, query?)` | `GET /chatbots/{id}/conversations` | List chatbot conversations |
| `sq.chatbots.getConversationMessages(id, convId)` | `GET /chatbots/{id}/conversations/{conv_id}/messages` | Get conversation messages |

### Comments

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.comments.list(query?)` | `GET /social/comments` | List comments |
| `sq.comments.replyTo(commentId, body)` | `POST /social/comments/{comment_id}/reply` | Reply to a comment |
| `sq.comments.hide(commentId)` | `POST /social/comments/{comment_id}/hide` | Hide or unhide a comment |
| `sq.comments.delete(commentId)` | `DELETE /social/comments/{comment_id}` | Delete a comment |

### Content

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.content.rewrite(body)` | `POST /content/rewrite` | Rewrite content |
| `sq.content.generateCaption(body?)` | `POST /content/caption` | Generate a social caption |

### CRM Contacts

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.contacts.list(query?)` | `GET /contacts` | List contacts |
| `sq.contacts.create(body)` | `POST /contacts` | Create or upsert a contact |
| `sq.contacts.get(id)` | `GET /contacts/{id}` | Get a contact |
| `sq.contacts.update(id, body)` | `PATCH /contacts/{id}` | Update a contact |
| `sq.contacts.addTags(id, body)` | `POST /contacts/{id}/tags` | Add tags to a contact |
| `sq.contacts.removeTags(id, body)` | `DELETE /contacts/{id}/tags` | Remove tags from a contact |
| `sq.contacts.listNotes(id)` | `GET /contacts/{id}/notes` | List contact notes |
| `sq.contacts.addNote(id, body)` | `POST /contacts/{id}/notes` | Add a note to a contact |
| `sq.contacts.enroll(id, body)` | `POST /contacts/{id}/enroll` | Enroll a contact in an automation |
| `sq.contacts.addMessage(id, body)` | `POST /contacts/{id}/messages` | Log a message on a contact's timeline |

### CRM Custom Fields

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.customFields.list()` | `GET /custom-fields` | List custom fields |
| `sq.customFields.create(body)` | `POST /custom-fields` | Create a custom field |
| `sq.customFields.delete(id)` | `DELETE /custom-fields/{id}` | Delete a custom field |

### CRM Opportunities

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.opportunities.listPipelines()` | `GET /pipelines` | List pipelines |
| `sq.opportunities.createPipeline(body)` | `POST /pipelines` | Create a pipeline |
| `sq.opportunities.list(query?)` | `GET /opportunities` | List opportunities |
| `sq.opportunities.create(body)` | `POST /opportunities` | Create an opportunity |
| `sq.opportunities.get(id)` | `GET /opportunities/{id}` | Get an opportunity |
| `sq.opportunities.update(id, body)` | `PATCH /opportunities/{id}` | Update an opportunity |
| `sq.opportunities.delete(id)` | `DELETE /opportunities/{id}` | Delete an opportunity |
| `sq.opportunities.updateStatus(id, body)` | `POST /opportunities/{id}/status` | Update opportunity status |

### Direct Messages

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.messages.listConversations(query?)` | `GET /social/conversations` | List DM conversations |
| `sq.messages.list(conversationId, query?)` | `GET /social/conversations/{conversation_id}/messages` | List messages in a conversation |
| `sq.messages.send(conversationId, body)` | `POST /social/conversations/{conversation_id}/messages` | Send a direct message |
| `sq.messages.markConversationRead(conversationId)` | `POST /social/conversations/{conversation_id}/read` | Mark a conversation read |

### Images

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.images.generate(body)` | `POST /images/generate` | Generate image |
| `sq.images.list(query?)` | `GET /images` | List images |
| `sq.images.get(imageId)` | `GET /images/{image_id}` | Get image |
| `sq.images.delete(imageId)` | `DELETE /images/{image_id}` | Delete image |

### Jobs

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.jobs.list(query?)` | `GET /jobs` | List jobs |
| `sq.jobs.get(jobId)` | `GET /jobs/{job_id}` | Get job |
| `sq.jobs.cancel(jobId, body?)` | `POST /jobs/{job_id}/cancel` | Cancel job |

### Media

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.media.list(query?)` | `GET /media` | List media |
| `sq.media.get(mediaId)` | `GET /media/{media_id}` | Get media |
| `sq.media.delete(mediaId)` | `DELETE /media/{media_id}` | Delete media |
| `sq.media.getUploadUrl(body)` | `POST /media/upload-url` | Get presigned upload URL |

### Presentations

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.presentations.generate(body)` | `POST /presentations/generate` | Generate presentation |
| `sq.presentations.list(query?)` | `GET /presentations` | List presentations |
| `sq.presentations.get(presentationId)` | `GET /presentations/{presentation_id}` | Get presentation |
| `sq.presentations.delete(presentationId)` | `DELETE /presentations/{presentation_id}` | Delete presentation |

### Profiles

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.profiles.list(query?)` | `GET /profiles` | List profiles |
| `sq.profiles.create(body)` | `POST /profiles` | Create a profile |
| `sq.profiles.get(id)` | `GET /profiles/{id}` | Get a profile |
| `sq.profiles.delete(id, body)` | `DELETE /profiles/{id}` | Delete a profile |
| `sq.profiles.listAccounts(id)` | `GET /profiles/{id}/accounts` | List a profile's connected accounts |
| `sq.profiles.pause(id)` | `POST /profiles/{id}/pause` | Pause a profile |
| `sq.profiles.resume(id)` | `POST /profiles/{id}/resume` | Resume a profile |
| `sq.profiles.createConnectLink(id, body?)` | `POST /profiles/{id}/connect-link` | Create a hosted connect link |
| `sq.profiles.createConnectUrl(id, platform, body?)` | `POST /profiles/{id}/connect/{platform}` | Get a raw connect URL for one platform |
| `sq.profiles.getAccountBilling()` | `GET /me/account-billing` | Account billing summary |

### SEO

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.seo.keywordResearch(body)` | `POST /seo/keyword-research` | Keyword research |
| `sq.seo.serp(body)` | `POST /seo/serp` | Live SERP lookup |
| `sq.seo.keywordDifficulty(body)` | `POST /seo/keyword-difficulty` | Keyword difficulty |
| `sq.seo.rankedKeywords(body)` | `POST /seo/ranked-keywords` | Ranked keywords (rank tracking) |
| `sq.seo.domainOverview(body)` | `POST /seo/domain-overview` | Domain rank overview |
| `sq.seo.competitors(body)` | `POST /seo/competitors` | Organic competitors |
| `sq.seo.backlinksSummary(body)` | `POST /seo/backlinks-summary` | Backlink profile summary |
| `sq.seo.audit(body)` | `POST /seo/audit` | On-page SEO audit |
| `sq.seo.backlinkProspects(body)` | `POST /seo/backlink-prospects` | Backlink prospects (link gap) |
| `sq.seo.referringDomains(body)` | `POST /seo/referring-domains` | Referring domains |
| `sq.seo.backlinkAnchors(body)` | `POST /seo/backlink-anchors` | Backlink anchors |
| `sq.seo.spamScore(body)` | `POST /seo/spam-score` | Backlink spam score |
| `sq.seo.rankHistory(body)` | `POST /seo/rank-history` | Historical rank overview |
| `sq.seo.siteAudit(body)` | `POST /seo/site-audit` | Deep site audit |
| `sq.seo.brandLookup(body)` | `POST /seo/brand-lookup` | AI Visibility: brand lookup |
| `sq.seo.promptExplorer(body)` | `POST /seo/prompt-explorer` | AI Visibility: prompt explorer |
| `sq.seo.aiAudit(body)` | `POST /seo/ai-audit` | AI Visibility Audit (async) |

### Shorts

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.shorts.generate(body?)` | `POST /shorts/generate` | Generate viral shorts from a long video |
| `sq.shorts.list(query?)` | `GET /shorts` | List shorts jobs |
| `sq.shorts.get(uid)` | `GET /shorts/{uid}` | Get shorts job + clips |

### Social

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.social.listAccounts()` | `GET /social/accounts` | List social accounts |
| `sq.social.listPosts(query?)` | `GET /social/posts` | List social posts |
| `sq.social.createPost(body)` | `POST /social/posts` | Create post (publish immediately) |
| `sq.social.schedulePost(body)` | `POST /social/posts/schedule` | Schedule post |
| `sq.social.getPost(postId)` | `GET /social/posts/{post_id}` | Get social post |
| `sq.social.updatePost(postId, body)` | `PATCH /social/posts/{post_id}` | Update social post |
| `sq.social.deletePost(postId)` | `DELETE /social/posts/{post_id}` | Delete social post |
| `sq.social.disconnectAccount(accountId)` | `DELETE /social/accounts/{account_id}` | Disconnect a social account |
| `sq.social.getAccountHealth(accountId)` | `GET /social/accounts/{account_id}/health` | Account health |
| `sq.social.getAccountReconnectUrl(accountId)` | `GET /social/accounts/{account_id}/reconnect-url` | Account reconnect URL |
| `sq.social.pauseAccount(accountId)` | `POST /social/accounts/{account_id}/pause` | Pause posting to an account |
| `sq.social.resumeAccount(accountId)` | `POST /social/accounts/{account_id}/resume` | Resume posting to an account |
| `sq.social.retryPost(postId, body)` | `POST /social/posts/{post_id}/retry` | Retry publishing a post |
| `sq.social.connectAccountStatus(platform)` | `GET /social/connect/{platform}` | Poll headless connection status |
| `sq.social.connectAccount(platform, body?)` | `POST /social/connect/{platform}` | Start headless account connection |
| `sq.social.listQueues()` | `GET /social/queues` | List queues |
| `sq.social.createQueue(body)` | `POST /social/queues` | Create queue |
| `sq.social.getQueue(queueId)` | `GET /social/queues/{queue_id}` | Get queue |
| `sq.social.updateQueue(queueId, body)` | `PUT /social/queues/{queue_id}` | Update queue |
| `sq.social.deleteQueue(queueId)` | `DELETE /social/queues/{queue_id}` | Delete queue |
| `sq.social.getQueueNextSlot(queueId)` | `GET /social/queues/{queue_id}/next-slot` | Get next open slot |
| `sq.social.previewQueueSlots(queueId, query?)` | `GET /social/queues/{queue_id}/preview` | Preview upcoming slots |
| `sq.social.unpublishPost(postId, body?)` | `POST /social/posts/{post_id}/unpublish` | Unpublish post |
| `sq.social.validatePost(body)` | `POST /social/validate/post` | Validate post content |
| `sq.social.validateMedia(body)` | `POST /social/validate/media` | Validate media URL |

### URLs

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.urls.shorten(body)` | `POST /urls/shorten` | Shorten URL |
| `sq.urls.list(query?)` | `GET /urls` | List short URLs |
| `sq.urls.get(urlId)` | `GET /urls/{url_id}` | Get short URL |
| `sq.urls.delete(urlId)` | `DELETE /urls/{url_id}` | Delete short URL |
| `sq.urls.getStats(urlId)` | `GET /urls/{url_id}/stats` | Get short URL stats |

### Videos

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.videos.listModels()` | `GET /videos/models` | List available video models |
| `sq.videos.generate(body)` | `POST /videos/generate` | Generate video |
| `sq.videos.list(query?)` | `GET /videos` | List videos |
| `sq.videos.get(videoId)` | `GET /videos/{video_id}` | Get video |
| `sq.videos.delete(videoId)` | `DELETE /videos/{video_id}` | Delete video |
| `sq.videos.generateHook(body?)` | `POST /videos/hook` | Generate a viral hook line |
| `sq.videos.suggestBroll(body)` | `POST /videos/broll-suggest` | Suggest B-roll moments |
| `sq.videos.suggestEmphasis(body)` | `POST /videos/emphasis` | Suggest on-screen emphasis |
| `sq.videos.generateViralThumbnail(body)` | `POST /videos/viral-thumbnail` | Generate a viral thumbnail |

### Webhooks

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.webhooks.list()` | `GET /webhooks` | List webhooks |
| `sq.webhooks.create(body)` | `POST /webhooks` | Create webhook |
| `sq.webhooks.update(id, body)` | `PUT /webhooks/{id}` | Update webhook |
| `sq.webhooks.delete(id)` | `DELETE /webhooks/{id}` | Delete webhook |
| `sq.webhooks.listLogs(query?)` | `GET /webhooks/logs` | List webhook delivery logs |
| `sq.webhooks.test(id)` | `POST /webhooks/{id}/test` | Send test webhook |

### Workspaces

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.workspaces.list()` | `GET /workspaces` | List workspaces (sub-accounts) |
| `sq.workspaces.create(body)` | `POST /workspaces` | Create a workspace (sub-account) |
| `sq.workspaces.bulkAction(body)` | `POST /workspaces/bulk` | Bulk sub-account action |
| `sq.workspaces.get(id)` | `GET /workspaces/{id}` | Get a workspace (sub-account) |
| `sq.workspaces.delete(id, body)` | `DELETE /workspaces/{id}` | Delete a workspace (sub-account) |
| `sq.workspaces.disableSaas(id, body?)` | `POST /workspaces/{id}/disable-saas` | Disable SaaS mode for a workspace |
| `sq.workspaces.pause(id)` | `POST /workspaces/{id}/pause` | Pause (suspend) a workspace |
| `sq.workspaces.resume(id)` | `POST /workspaces/{id}/resume` | Resume a paused workspace |
| `sq.workspaces.getSubscription(id)` | `GET /workspaces/{id}/subscription` | Get a sub-account's subscription |
| `sq.workspaces.getWallet(id)` | `GET /workspaces/{id}/wallet` | Get a sub-account's wallet balance |
| `sq.workspaces.listSaasPlans()` | `GET /saas/plans` | List SaaS plans |
| `sq.workspaces.getSaasPlan(id)` | `GET /saas/plans/{id}` | Get a SaaS plan |
<!-- END GENERATED REFERENCE -->

## Regeneration

This SDK is generated from the [SmartlyQ OpenAPI spec](https://docs.smartlyq.com). When the spec changes, CI regenerates the client, README, and tests, bumps the version, and publishes to npm automatically.

## License

MIT
