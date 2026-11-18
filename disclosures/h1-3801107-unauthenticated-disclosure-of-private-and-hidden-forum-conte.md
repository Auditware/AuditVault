---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2026-10-12
submitted: 2026-06-14T04:06:47.154Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "winstoncrooker"
source: "https://hackerone.com/reports/3801107"
title: "Unauthenticated disclosure of private and hidden forum content in bbPress via the WordPress core REST single-item endpoint"
---
# Unauthenticated disclosure of private and hidden forum content in bbPress via the WordPress core REST single-item endpoint

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 24 | **Program:** WordPress | **Disclosed:** 2026-10-12

- Report: [https://hackerone.com/reports/3801107](https://hackerone.com/reports/3801107)
- CWE: Improper Access Control - Generic
- Submitted: 2026-06-14T04:06:47.154Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description:

bbPress restricts the topics and replies inside private and hidden forums to authorized members. The current development version (2.7.0) registers the forum, topic, and reply post types with `show_in_rest => true`, which exposes them through the WordPress core REST API. bbPress enforces forum visibility only through a `pre_get_posts` query filter, and the core REST single-item endpoint reads a post directly by ID without running that filter. As a result, an unauthenticated attacker can read the full content of any topic or reply located in a private or hidden forum by requesting it from the core REST API by ID. bbPress denies that same anonymous request on its front-end, on the REST collection endpoint, and on the forum's own REST endpoint, so the single-item exposure reflects an enforcement path that was never extended to REST, not a decision to publish members-only content.

Topics and replies are stored with `post_status = publish` regardless of the visibility of the forum that contains them. Topics are created with the public status in `src/includes/topics/functions.php:33` (`'post_status' => bbp_get_public_status_id()`), and replies likewise. Only the forum container carries the restricted status: a private forum has the core `private` status and a hidden forum has bbPress's custom `hidden` status (registered with `'private' => true` in `src/bbpress.php`). bbPress keeps the restricted topics and replies out of normal listings by adding their parent forums to an exclusion set inside `bbp_pre_get_posts_normalize_forum_visibility()` (`src/includes/forums/functions.php:2329`), which is hooked to `pre_get_posts`.

As of 2.7.0 the three post types are registered with `show_in_rest => true` (`src/bbpress.php:548`, `:578`, `:608`), so WordPress automatically registers the default `WP_REST_Posts_Controller` routes for them at `/wp-json/wp/v2/forum`, `/wp-json/wp/v2/topic`, and `/wp-json/wp/v2/reply`. The released 2.6.x line does not set `show_in_rest`, so the post types default to being excluded from REST and are not affected. This change was introduced by the commit that added Gutenberg block support to the post types.

The core REST single-item endpoint does not apply bbPress's visibility filter. `WP_REST_Posts_Controller::get_item()` resolves the post with `get_post( $id )`, which is a direct primary-key lookup that does not run a `WP_Query` and therefore never triggers `pre_get_posts`. The permission check, `WP_REST_Posts_Controller::check_read_permission()`, returns true for any post whose status is `publish` without consulting capabilities or the parent forum. Because topics and replies in private and hidden forums are `publish`, the check passes for an anonymous caller and the controller returns the full `content.rendered`. bbPress registers no REST permission filter (no `rest_{post_type}_item_permissions_check`, no `register_rest_field` permission callback, no `rest_{post_type}_query` adjustment) that would re-impose forum visibility on this path.

The REST collection endpoint is not affected, which isolates the gap to the single-item path. `bbp_pre_get_posts_normalize_forum_visibility()` does not bail for REST or non-main queries, so the `WP_Query` that backs `GET /wp-json/wp/v2/topic` is filtered and the restricted topics are excluded. The single-item endpoint bypasses that query entirely.

This was confirmed end to end at runtime against WordPress with bbPress 2.7.0 trunk (attached). A hidden forum and a private forum were created with bbPress's own API, each containing a topic with secret content, plus a reply in the hidden forum. As an unauthenticated client:

- `GET /wp-json/wp/v2/topic/5` (topic in the hidden forum) returned HTTP 200 with the full content `SECRET-TOPIC: acquiring Acme Corp for $4.2B, board vote Friday.`
- `GET /wp-json/wp/v2/reply/6` (reply in the hidden forum) returned HTTP 200 with `SECRET-REPLY: wire the deposit to account 12345 before close.`
- `GET /wp-json/wp/v2/topic/9` (topic in the private forum) returned HTTP 200 with `SECRET-PRIVATE: payouts hit wallets Monday 09:00 UTC.`

The same anonymous client was denied on every other path: the REST collection `GET /wp-json/wp/v2/topic` returned an empty array (the restricted topics are excluded), the front-end permalink returned HTTP 404, and the hidden forum's own REST endpoint `GET /wp-json/wp/v2/forum/4` returned HTTP 401 `rest_forbidden`. The denials on those three paths establish that the data is members-only and that only the single-item REST route fails to honor it.

Topic and reply IDs are sequential integers, so the restricted corpus is harvested by iterating IDs. Iterating `topic/1` through `topic/10` as an unauthenticated client returned content only for the two restricted topics and 404 for the rest, demonstrating an unauthenticated, scalable read of members-only forum content with no knowledge of IDs required beyond enumeration.

The affected version is the 2.7.0 development line (trunk), where the forum post types are newly exposed to REST. The released 2.6.x line does not set `show_in_rest` and is not affected, so reporting it now prevents the regression from reaching the installed base when 2.7.0 ships.

## Steps To Reproduce:

1. Install WordPress with bbPress 2.7.0 (trunk) active and pretty permalinks enabled.
1. Create a hidden forum (or a private forum) and post a topic and a reply in it. The topic and reply are stored with `post_status = publish`; only the forum carries the hidden or private status.
1. As an unauthenticated client (no cookie, no auth header), request `GET /wp-json/wp/v2/topic/<topic_id>` and `GET /wp-json/wp/v2/reply/<reply_id>`. The response is HTTP 200 and the JSON `content.rendered` field contains the full topic or reply content.
1. Confirm the data is otherwise restricted for the same anonymous client: `GET /wp-json/wp/v2/topic` returns an array that excludes the topic, the topic's front-end permalink returns HTTP 404, and `GET /wp-json/wp/v2/forum/<forum_id>` returns HTTP 401.
1. Iterate `<topic_id>` and `<reply_id>` over the sequential ID space to harvest the private and hidden forum corpus.

## Recommendations

Re-impose forum visibility on the REST path, or do not expose the content to REST at all. Any one of the following resolves it:

- Register a `permission_callback` / `rest_{post_type}_item_permissions_check` filter for the forum, topic, and reply post types that calls `bbp_current_user_can_see()` (or the equivalent ancestor-forum visibility check) on the requested object and denies the read when the current user cannot see the containing forum. This mirrors the visibility logic already enforced on the front-end and on `WP_Query`.
- Alternatively, scope `show_in_rest` to capability (for example, expose the content in REST only for users who can moderate or edit the relevant post type), so the Gutenberg editing use case is served without exposing unauthenticated reads.
- Alternatively, register a custom `rest_controller_class` that filters both collection and single reads through the existing forum-visibility logic.

The fix should cover both the single-item and collection endpoints for all three post types, and should be verified against the controls above (front-end 404, collection exclusion, forum 401) so the REST single-item path matches the visibility enforced everywhere else.

## Supporting Material/References:

- `bbpress_rest_disclosure_poc.txt`: captured transcript of the unauthenticated single-item REST requests returning the hidden- and private-forum topic and reply content, the control checks (collection exclusion, front-end 404, forum 401), and the ID-enumeration harvest.
- `reproduce.sh` and `docker-compose.yml`: stand up WordPress + bbPress 2.7.0 trunk, create the hidden and private forums with secret topics/replies, and run the requests and the controls.
- Source references (bbPress trunk): `src/bbpress.php:548,578,608` (`show_in_rest => true` on forum/topic/reply); `src/includes/forums/functions.php:2329` (`bbp_pre_get_posts_normalize_forum_visibility`, hooked to `pre_get_posts`); `src/includes/topics/functions.php:33` (topics created with `bbp_get_public_status_id()` = publish). bbPress registers no REST permission filter for these post types. WordPress core: `WP_REST_Posts_Controller::check_read_permission()` returns true for `publish` status, and `get_item()` resolves the post via `get_post()` without a `WP_Query`.

## AI disclosure:

This report was produced with AI assistance. An automated source-analysis pass identified the candidate by reviewing the bbPress code for read paths that bypass the plugin's forum-visibility enforcement. The finding was then verified end to end against a live WordPress + bbPress 2.7.0 trunk instance, and the code citations, the runtime proof of concept, and this writeup were assembled and checked with AI tooling under human review. Every code reference and the attached transcript were confirmed against the running build.

## Impact

An unauthenticated attacker can read the full content of topics and replies posted in private and hidden bbPress forums. That content is restricted to forum members, and bbPress denies it to anonymous users on the front-end, on the REST collection endpoint, and on the forum's own REST endpoint. The disclosed unit is the complete topic and reply content, not a truncated excerpt. Because topic and reply IDs are sequential integers, the attacker harvests the entire restricted forum corpus by ID iteration, with no authentication, account, or user interaction required.

The issue is present in the 2.7.0 development line, which newly exposes these post types to REST, and not in the released 2.6.x line. Reporting it before release prevents the regression from shipping to the bbPress installed base.

## Timeline

- **Report Filed**
- **2026-07-11** @winstoncrooker: any updates?
- **2026-07-21** @winstoncrooker: Been little over a month since report was submitted wondering if you guys had any updates?

Thanks, 
Winston
- **Report Triaged**
- **2026-08-13** @winstoncrooker: Hey, @emaralive thanks for validating the vulnerability! I hope you can take some inspiration for the fix from my "Recommendation" section of the report to get this patched as soon as possible.
- **2026-09-11** @jjj: Thanks for the thorough report and for your patience while I worked through it.

I reproduced the unauthenticated disclosure and committed the fix to bbPress trunk in r7481. The forum, topic, and reply post types now use a bbPress REST controller that enforces private and hidden forum permissions, including restricted ancestors, for both single-item and collection responses. The same protection now applies to attachments whose parent is a forum, topic, or reply.

I also backported the fix to the 2.6 branch in r7482. The 2.6 post types remain excluded from REST by default, but installations that enable REST support through custom code will receive the same permission checks.

The regression suite covers public, private, and hidden forums; restricted ancestors; participants, Keymasters, direct and inherited forum moderators, and filter-granted moderators; Core post-status restrictions; collections and search; and attachments parented to each bbPress post type.

Thank you very much for helping keep bbPress secure!
- **2026-09-11** @winstoncrooker: Hey @jjj, thanks for the thorough fix and for walking through exactly what landed. Going
beyond what I reported to also cover restricted ancestors and attachments parented to a
forum/topic/reply is a better outcome than the single-item patch I suggested, and the
backport to 2.6 in r7482 means installs that enable REST through custom code are covered
too. Glad the regression suite ended up that broad.

A few things I wanted to ask now that trunk is patched:

1. CVE assignment. This is sitting at Critical 9.3 as an unauthenticated disclosure of
private and hidden forum content, and there is now a public fix with two commit
references (r7481 and r7482). Is a CVE planned? Happy to supply anything useful for the
request, including the affected version range and the CWE.

2. Release and disclosure. Is there a release this is targeted for, and would you like me
to hold off talking about it publicly until that ships? I am in no rush and will follow
whatever timeline works for you, I would just like to know when it is fine.

3. What is left to close this out. It has been triaged since August 11 and the fix is now
committed, so I assume the remaining step is the release going out and the report moving
to resolved. Is that right, and does the reward get decided at that point? Just want to
understand where it sits rather than keep checking in.

Thanks again for taking it seriously and for the detail in the writeup.

Winston
- **Report Resolved**
- **2026-09-12** @winstoncrooker: Hi @jjj, thanks for closing this out, and for the detail on r7481 and r7482.

Before it goes quiet I wanted to ask about the reward decision. The report closed without one and I cannot tell from my side whether that is final or still pending, so I would rather just ask than guess.

The reason I am asking rather than assuming is the program guidelines, which say bounties are doubled when a bug is reported before it is released to users. That is what happened here: the regression was introduced in the 2.7.0 development line and I reported it while 2.6.x was the shipping release, so no installed site was ever exposed. If that pre-release timing is instead what makes the report ineligible, I would genuinely like to know, because it changes how I handle the next one I find in trunk. Either answer is useful to me.

Two smaller things from my last comment that I think got missed when the report closed:

CVE. Is one planned? There is now a public fix with two commit references and the CVE field on the report is empty. Happy to supply the affected version range and the CWE if that saves you time.

Disclosure. Is there a release this is targeted for, and would you prefer I hold off on discussing it publicly until then? I am in no rush, I just want to follow your timeline.

Thanks again for the fix. Extending it to restricted ancestors and to attachments went well past what I reported.

Winston
- **Agreed On Going Public**
- **2026-09-13** @johnbillion: @winstoncrooker It usually takes us a few days after closing a report to make a bounty payment. It goes into a separate queue for us to deal with and we frequently encounter payment processing issues.  The bounty payment will be doubled as this was, as you stated, reported during development of 2.7. Many thanks.

I'll leave it to the bbPress team to answer y0our questions about the release and disclosure timeline. FYI we rarely request a CVE for issues that don't affect WordPress core because the workload is just too high. You're free to request one and it can be attached to this report prior to disclosure.

In case you've not seen it, the program policy was changed recently in order to refocus on high severity issues:

1. https://make.wordpress.org/security/2026/09/01/updates-to-the-wordpress-vulnerability-disclosure-program/
2. https://hackerone.com/wordpress
- **Bounty Awarded**
- **Report Became Public**
