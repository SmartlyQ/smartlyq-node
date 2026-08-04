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
| `sq.account.getBilling()` | `GET /me/billing` | Billing overview |

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
| `sq.analytics.dailyMetrics(query?)` | `GET /analytics/daily-metrics` | Daily metrics |
| `sq.analytics.bestTime(query?)` | `GET /analytics/best-time` | Best time to post |
| `sq.analytics.contentDecay(query?)` | `GET /analytics/content-decay` | Content decay |
| `sq.analytics.postingFrequency(query?)` | `GET /analytics/posting-frequency` | Posting frequency vs engagement |
| `sq.analytics.postTimeline(postId)` | `GET /analytics/posts/{post_id}/timeline` | Post metric timeline |
| `sq.analytics.inboxVolume(query?)` | `GET /analytics/inbox/volume` | Inbox volume |
| `sq.analytics.inboxHeatmap(query?)` | `GET /analytics/inbox/heatmap` | Inbox heatmap |
| `sq.analytics.inboxSourceBreakdown(query?)` | `GET /analytics/inbox/source-breakdown` | Inbox source breakdown |
| `sq.analytics.inboxResponseTime(query?)` | `GET /analytics/inbox/response-time` | Inbox response time |
| `sq.analytics.inboxTopAccounts(query?)` | `GET /analytics/inbox/top-accounts` | Inbox top accounts |
| `sq.analytics.inboxConversations(query?)` | `GET /analytics/inbox/conversations` | Inbox conversation stats |
| `sq.analytics.inboxConversationDetail(conversationId)` | `GET /analytics/inbox/conversations/{conversation_id}` | Conversation analytics |
| `sq.analytics.getYoutubeChannelInsights(query?)` | `GET /analytics/youtube/channel-insights` | YouTube channel insights |
| `sq.analytics.getYoutubeDailyViews(query?)` | `GET /analytics/youtube/daily-views` | YouTube daily views |
| `sq.analytics.getYoutubeVideoRetention(query?)` | `GET /analytics/youtube/video-retention` | YouTube audience retention |
| `sq.analytics.getYoutubeDemographics(query?)` | `GET /analytics/youtube/demographics` | YouTube viewer demographics |

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

### Automations

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.automations.list(query?)` | `GET /automations` | List automations |
| `sq.automations.get(automationId)` | `GET /automations/{automation_id}` | Get automation |
| `sq.automations.activate(automationId)` | `POST /automations/{automation_id}/activate` | Activate automation |
| `sq.automations.deactivate(automationId)` | `POST /automations/{automation_id}/deactivate` | Pause automation |
| `sq.automations.trigger(automationId, body?)` | `POST /automations/{automation_id}/trigger` | Trigger automation |
| `sq.automations.duplicate(automationId)` | `POST /automations/{automation_id}/duplicate` | Duplicate an automation |
| `sq.automations.listVersions(automationId)` | `GET /automations/{automation_id}/versions` | List automation versions |
| `sq.automations.getVersion(automationId, version)` | `GET /automations/{automation_id}/versions/{version}` | Get one automation version |
| `sq.automations.restoreVersion(automationId, version)` | `POST /automations/{automation_id}/versions/{version}/restore` | Restore an automation version |
| `sq.automations.listRuns(automationId, query?)` | `GET /automations/{automation_id}/runs` | List runs |
| `sq.automations.getRun(automationId, runId)` | `GET /automations/{automation_id}/runs/{run_id}` | Get run |

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
| `sq.comments.moderate(commentId, body)` | `POST /social/comments/{comment_id}/moderate` | Approve or reject a comment |
| `sq.comments.like(commentId)` | `POST /social/comments/{comment_id}/like` | Like a comment |
| `sq.comments.unlike(commentId)` | `DELETE /social/comments/{comment_id}/like` | Unlike a comment |
| `sq.comments.delete(commentId)` | `DELETE /social/comments/{comment_id}` | Delete a comment |
| `sq.comments.getPost(postId)` | `GET /social/comments/{post_id}` | Get one post's comments (threaded) |

### Content

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.content.rewrite(body)` | `POST /content/rewrite` | Rewrite content |
| `sq.content.generateCaption(body?)` | `POST /content/caption` | Generate a social caption |

### CRM

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.crm.deleteContact(id)` | `DELETE /contacts/{id}` | Delete contact |
| `sq.crm.updateCustomField(id, body)` | `PATCH /custom-fields/{id}` | Update custom field |
| `sq.crm.bulkImportContacts(body)` | `POST /contacts/bulk` | Bulk import contacts |
| `sq.crm.contactChannels(id)` | `GET /contacts/{id}/channels` | Contact channels |

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
| `sq.contacts.setField(id, slug, body)` | `PUT /contacts/{id}/fields/{slug}` | Set one custom field |
| `sq.contacts.clearField(id, slug)` | `DELETE /contacts/{id}/fields/{slug}` | Clear one custom field |

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
| `sq.messages.delete(conversationId, messageId)` | `DELETE /social/conversations/{conversation_id}/messages/{message_id}` | Delete a sent message |
| `sq.messages.reactTo(conversationId, messageId, body)` | `POST /social/conversations/{conversation_id}/messages/{message_id}/reactions` | React to a message |
| `sq.messages.removeReaction(conversationId, messageId)` | `DELETE /social/conversations/{conversation_id}/messages/{message_id}/reactions` | Remove a message reaction |

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

### Logs

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.logs.list(query?)` | `GET /logs` | List developer logs |

### Media

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.media.list(query?)` | `GET /media` | List media |
| `sq.media.get(mediaId)` | `GET /media/{media_id}` | Get media |
| `sq.media.delete(mediaId)` | `DELETE /media/{media_id}` | Delete media |
| `sq.media.getUploadUrl(body)` | `POST /media/upload-url` | Get presigned upload URL |
| `sq.media.uploadDirect(body)` | `POST /media/upload-direct` | Upload a file directly |

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
| `sq.profiles.update(id, body)` | `PATCH /profiles/{id}` | Update a profile |
| `sq.profiles.delete(id, body)` | `DELETE /profiles/{id}` | Delete a profile |
| `sq.profiles.listAccounts(id)` | `GET /profiles/{id}/accounts` | List a profile's connected accounts |
| `sq.profiles.pause(id)` | `POST /profiles/{id}/pause` | Pause a profile |
| `sq.profiles.resume(id)` | `POST /profiles/{id}/resume` | Resume a profile |
| `sq.profiles.createConnectLink(id, body?)` | `POST /profiles/{id}/connect-link` | Create a hosted connect link |
| `sq.profiles.createConnectUrl(id, platform, body?)` | `POST /profiles/{id}/connect/{platform}` | Get a raw connect URL for one platform |
| `sq.profiles.getAccountBilling()` | `GET /me/account-billing` | Account billing summary |

### Reviews

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.reviews.list(query?)` | `GET /reviews` | List reviews |
| `sq.reviews.replyTo(reviewId, body)` | `POST /reviews/{review_id}/reply` | Reply to review |
| `sq.reviews.deleteReply(reviewId)` | `DELETE /reviews/{review_id}/reply` | Delete review reply |
| `sq.reviews.sync(body?)` | `POST /reviews/sync` | Sync reviews |

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
| `sq.social.updateAccount(accountId, body)` | `PATCH /social/accounts/{account_id}` | Rename account |
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
| `sq.social.stopPostRecycle(postId)` | `DELETE /social/posts/{post_id}/recycle` | Stop recycling |
| `sq.social.bulkSchedulePosts(body)` | `POST /social/posts/bulk` | Bulk schedule posts |
| `sq.social.validateBulkBatch(body)` | `POST /social/posts/bulk/validate` | Validate a bulk batch |
| `sq.social.bulkAccountHealth()` | `GET /social/accounts/health` | Bulk account health |
| `sq.social.accountFollowerStats(query?)` | `GET /social/accounts/follower-stats` | Follower stats |
| `sq.social.tiktokCreatorInfo(accountId)` | `GET /social/accounts/{account_id}/tiktok/creator-info` | TikTok creator info |
| `sq.social.moveAccount(accountId, body)` | `POST /social/accounts/{account_id}/move` | Move account to profile |
| `sq.social.listAccountGroups()` | `GET /social/account-groups` | List account groups |
| `sq.social.createAccountGroup(body)` | `POST /social/account-groups` | Create account group |
| `sq.social.getAccountGroup(groupId)` | `GET /social/account-groups/{group_id}` | Get account group |
| `sq.social.updateAccountGroup(groupId, body)` | `PUT /social/account-groups/{group_id}` | Update account group |
| `sq.social.deleteAccountGroup(groupId)` | `DELETE /social/account-groups/{group_id}` | Delete account group |
| `sq.social.getConversation(conversationId)` | `GET /social/conversations/{conversation_id}` | Get conversation |
| `sq.social.updateConversation(conversationId, body)` | `PATCH /social/conversations/{conversation_id}` | Archive / reopen conversation |
| `sq.social.searchConversations(query?)` | `GET /social/conversations/search` | Search conversations |
| `sq.social.pinterestBoards(accountId)` | `GET /social/accounts/{account_id}/pinterest/boards` | Pinterest boards |
| `sq.social.createPinterestBoard(accountId, body)` | `POST /social/accounts/{account_id}/pinterest/boards` | Create a Pinterest board |
| `sq.social.youtubePlaylists(accountId)` | `GET /social/accounts/{account_id}/youtube/playlists` | YouTube playlists |
| `sq.social.instagramPublishingLimit(accountId)` | `GET /social/accounts/{account_id}/instagram/publishing-limit` | Instagram publishing limit |
| `sq.social.gmbPerformance(accountId, query?)` | `GET /social/accounts/{account_id}/gmb/performance` | Google Business performance |
| `sq.social.gmbSearchKeywords(accountId, query?)` | `GET /social/accounts/{account_id}/gmb/search-keywords` | Google Business search keywords |
| `sq.social.redditSearch(accountId, query?)` | `GET /social/accounts/{account_id}/reddit/search` | Reddit search |
| `sq.social.redditFeed(accountId, query?)` | `GET /social/accounts/{account_id}/reddit/feed` | Reddit feed |
| `sq.social.redditSubreddits(accountId)` | `GET /social/accounts/{account_id}/reddit/subreddits` | Subscribed subreddits |
| `sq.social.redditSubredditRules(accountId, subreddit)` | `GET /social/accounts/{account_id}/reddit/subreddits/{subreddit}/rules` | Subreddit rules |
| `sq.social.instagramStories(accountId)` | `GET /social/accounts/{account_id}/instagram/stories` | Instagram stories |
| `sq.social.facebookPostReactions(accountId, query?)` | `GET /social/accounts/{account_id}/facebook/post-reactions` | Facebook post reactions |
| `sq.social.instagramStoryInsights(accountId, storyId, query?)` | `GET /social/accounts/{account_id}/instagram/stories/{story_id}/insights` | Instagram story insights |
| `sq.social.xRetweet(accountId, body)` | `POST /social/accounts/{account_id}/x/retweets` | Retweet on X |
| `sq.social.xUnretweet(accountId, tweetId)` | `DELETE /social/accounts/{account_id}/x/retweets/{tweet_id}` | Undo retweet |
| `sq.social.editPublishedPost(postId, body)` | `POST /social/posts/{post_id}/edit` | Edit published post |
| `sq.social.updatePostMetadata(postId, body)` | `POST /social/posts/{post_id}/update-metadata` | Update YouTube metadata |
| `sq.social.syncExternalPosts(body)` | `POST /social/posts/sync-external` | Sync external posts |
| `sq.social.accountInsights(accountId)` | `GET /social/accounts/{account_id}/insights` | Live account insights |
| `sq.social.gmbLocations(accountId, query?)` | `GET /social/accounts/{account_id}/gmb/locations` | List Google locations |
| `sq.social.gmbLocation(accountId, query?)` | `GET /social/accounts/{account_id}/gmb/location` | Get business info |
| `sq.social.gmbUpdateLocation(accountId, body)` | `PATCH /social/accounts/{account_id}/gmb/location` | Update business info |
| `sq.social.gmbAttributes(accountId)` | `GET /social/accounts/{account_id}/gmb/attributes` | Get attributes |
| `sq.social.gmbUpdateAttributes(accountId, body)` | `PUT /social/accounts/{account_id}/gmb/attributes` | Update attributes |
| `sq.social.gmbAttributeMetadata(accountId)` | `GET /social/accounts/{account_id}/gmb/attributes/metadata` | Available attributes |
| `sq.social.gmbMedia(accountId)` | `GET /social/accounts/{account_id}/gmb/media` | List media |
| `sq.social.gmbCreateMedia(accountId, body)` | `POST /social/accounts/{account_id}/gmb/media` | Add photo |
| `sq.social.gmbDeleteMedia(accountId, body)` | `DELETE /social/accounts/{account_id}/gmb/media` | Delete media |
| `sq.social.gmbFoodMenus(accountId)` | `GET /social/accounts/{account_id}/gmb/food-menus` | Get food menus |
| `sq.social.gmbUpdateFoodMenus(accountId, body)` | `PUT /social/accounts/{account_id}/gmb/food-menus` | Update food menus |
| `sq.social.gmbPlaceActions(accountId)` | `GET /social/accounts/{account_id}/gmb/place-actions` | List place-action links |
| `sq.social.gmbCreatePlaceAction(accountId, body)` | `POST /social/accounts/{account_id}/gmb/place-actions` | Create place-action link |
| `sq.social.gmbUpdatePlaceAction(accountId, body)` | `PATCH /social/accounts/{account_id}/gmb/place-actions` | Update place-action link |
| `sq.social.gmbDeletePlaceAction(accountId, body)` | `DELETE /social/accounts/{account_id}/gmb/place-actions` | Delete place-action link |
| `sq.social.gmbVerifications(accountId)` | `GET /social/accounts/{account_id}/gmb/verifications` | List verifications |
| `sq.social.gmbVerificationOptions(accountId, body?)` | `POST /social/accounts/{account_id}/gmb/verifications/options` | Verification options |
| `sq.social.redditSubredditInfo(accountId, subreddit)` | `GET /social/accounts/{account_id}/reddit/subreddits/{subreddit}` | Subreddit info + eligibility |
| `sq.social.xMentions(accountId, query?)` | `GET /social/accounts/{account_id}/x/mentions` | X mentions |
| `sq.social.sendTypingIndicator(conversationId)` | `POST /social/conversations/{conversation_id}/typing` | Typing indicator |
| `sq.social.commentPrivateReply(commentId, body)` | `POST /social/comments/{comment_id}/private-reply` | Private reply (comment-to-DM) |
| `sq.social.getMessengerMenu(accountId)` | `GET /social/accounts/{account_id}/messenger/menu` | Get Messenger menu |
| `sq.social.setMessengerMenu(accountId, body)` | `PUT /social/accounts/{account_id}/messenger/menu` | Set Messenger menu |
| `sq.social.deleteMessengerMenu(accountId)` | `DELETE /social/accounts/{account_id}/messenger/menu` | Delete Messenger menu |
| `sq.social.getIceBreakers(accountId)` | `GET /social/accounts/{account_id}/instagram/ice-breakers` | Get ice breakers |
| `sq.social.setIceBreakers(accountId, body)` | `PUT /social/accounts/{account_id}/instagram/ice-breakers` | Set ice breakers |
| `sq.social.deleteIceBreakers(accountId)` | `DELETE /social/accounts/{account_id}/instagram/ice-breakers` | Delete ice breakers |
| `sq.social.facebookPageInsights(accountId, query?)` | `GET /social/accounts/{account_id}/facebook/page-insights` | Facebook page insights |
| `sq.social.instagramAudience(accountId, query?)` | `GET /social/accounts/{account_id}/instagram/audience` | Instagram audience demographics |
| `sq.social.connectOptions(accountId)` | `GET /social/accounts/{account_id}/connect-options` | Connection target options |
| `sq.social.connectSelect(accountId, body)` | `POST /social/accounts/{account_id}/connect-select` | Select connection target |
| `sq.social.getFacebookPage(accountId)` | `GET /social/accounts/{account_id}/facebook/page` | Get Facebook page details |
| `sq.social.updateFacebookPage(accountId, body)` | `PATCH /social/accounts/{account_id}/facebook/page` | Update Facebook page details |
| `sq.social.updateYoutubePlaylist(accountId, playlistId, body)` | `PATCH /social/accounts/{account_id}/youtube/playlists/{playlist_id}` | Update a YouTube playlist |
| `sq.social.listMentions(accountId, query?)` | `GET /social/accounts/{account_id}/mentions` | List mentions |
| `sq.social.replyToMention(accountId, mentionId, body)` | `POST /social/accounts/{account_id}/mentions/{mention_id}/reply` | Reply to a mention |
| `sq.social.listRedditFlairs(accountId, subreddit)` | `GET /social/accounts/{account_id}/reddit/subreddits/{subreddit}/flairs` | List subreddit post flairs |

### URLs

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.urls.shorten(body)` | `POST /urls/shorten` | Shorten URL |
| `sq.urls.list(query?)` | `GET /urls` | List short URLs |
| `sq.urls.get(urlId)` | `GET /urls/{url_id}` | Get short URL |
| `sq.urls.delete(urlId)` | `DELETE /urls/{url_id}` | Delete short URL |
| `sq.urls.getStats(urlId)` | `GET /urls/{url_id}/stats` | Get short URL stats |
| `sq.urls.updateShort(id, body)` | `PATCH /urls/{id}` | Update a short URL |

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
| `sq.webhooks.replayDelivery(id)` | `POST /webhooks/deliveries/{id}/replay` | Replay a webhook delivery |

### WhatsApp

| Method | Endpoint | Description |
| --- | --- | --- |
| `sq.whatsApp.sendWhatsAppMessage(body)` | `POST /whatsapp/messages` | Send a WhatsApp message |
| `sq.whatsApp.listWhatsAppTemplates(query?)` | `GET /whatsapp/templates` | List message templates |
| `sq.whatsApp.createWhatsAppTemplate(body)` | `POST /whatsapp/templates` | Create a message template |
| `sq.whatsApp.getWhatsAppBusinessProfile(query?)` | `GET /whatsapp/business-profile` | Get business profile |
| `sq.whatsApp.updateWhatsAppBusinessProfile(body)` | `PATCH /whatsapp/business-profile` | Update business profile |
| `sq.whatsApp.listWhatsAppPhoneNumbers(query?)` | `GET /whatsapp/phone-numbers` | List phone numbers |
| `sq.whatsApp.listWhatsAppFlows(query?)` | `GET /whatsapp/flows` | List flows |
| `sq.whatsApp.createWhatsAppFlow(body)` | `POST /whatsapp/flows` | Create a flow |
| `sq.whatsApp.getWhatsAppFlow(flowId, query?)` | `GET /whatsapp/flows/{flow_id}` | Get flow |
| `sq.whatsApp.updateWhatsAppFlow(flowId, body)` | `PATCH /whatsapp/flows/{flow_id}` | Update flow |
| `sq.whatsApp.deleteWhatsAppFlow(flowId, query?)` | `DELETE /whatsapp/flows/{flow_id}` | Delete flow |
| `sq.whatsApp.getWhatsAppFlowJson(flowId, query?)` | `GET /whatsapp/flows/{flow_id}/json` | Get flow JSON asset |
| `sq.whatsApp.uploadWhatsAppFlowJson(flowId, body)` | `PUT /whatsapp/flows/{flow_id}/json` | Upload flow JSON |
| `sq.whatsApp.getWhatsAppFlowPreview(flowId, query?)` | `GET /whatsapp/flows/{flow_id}/preview` | Get flow preview URL |
| `sq.whatsApp.publishWhatsAppFlow(flowId, body)` | `POST /whatsapp/flows/{flow_id}/publish` | Publish flow |
| `sq.whatsApp.deprecateWhatsAppFlow(flowId, body)` | `POST /whatsapp/flows/{flow_id}/deprecate` | Deprecate flow |
| `sq.whatsApp.getWhatsAppBlockedUsers(query?)` | `GET /whatsapp/block-users` | List blocked users |
| `sq.whatsApp.blockWhatsAppUsers(body)` | `POST /whatsapp/block-users` | Block users |
| `sq.whatsApp.unblockWhatsAppUsers(body)` | `DELETE /whatsapp/block-users` | Unblock users |
| `sq.whatsApp.getTemplate(name, query?)` | `GET /whatsapp/templates/{name}` | Get a WhatsApp template |
| `sq.whatsApp.updateTemplate(name, body)` | `PATCH /whatsapp/templates/{name}` | Update a WhatsApp template |
| `sq.whatsApp.deleteTemplate(name, query?)` | `DELETE /whatsapp/templates/{name}` | Delete a WhatsApp template |
| `sq.whatsApp.updateProfilePhoto(body)` | `POST /whatsapp/business-profile/photo` | Set the WhatsApp profile photo |
| `sq.whatsApp.getDisplayName(query?)` | `GET /whatsapp/business-profile/display-name` | Get the WhatsApp display name |
| `sq.whatsApp.updateDisplayName(body)` | `POST /whatsapp/business-profile/display-name` | Request a WhatsApp display-name change |
| `sq.whatsApp.listTemplateLibrary(query?)` | `GET /whatsapp/template-library` | Browse the shared template library |
| `sq.whatsApp.createTemplateFromLibrary(body)` | `POST /whatsapp/templates/from-library` | Adopt a library template |

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
