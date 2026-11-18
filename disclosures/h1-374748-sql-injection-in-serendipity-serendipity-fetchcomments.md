---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2018-11-09
submitted: 2018-06-30T15:34:42.642Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/hannob|Hanno's projects]]"
reporter: "bb9866f3f743d6bf69b6836"
source: "https://hackerone.com/reports/374748"
title: "SQL injection in Serendipity (serendipity_fetchComments)"
---
# SQL injection in Serendipity (serendipity_fetchComments)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Hanno's projects | **Disclosed:** 2018-11-09

- Report: [https://hackerone.com/reports/374748](https://hackerone.com/reports/374748)
- CWE: SQL Injection
- Submitted: 2018-06-30T15:34:42.642Z

## Report summary

Bug in upstream Serendipity software, got fixed in version 2.1.3.

The impact is limited, as it requires a backend login. Still it's a great finding and many thanks to the reporter.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Summary

An authenticated administrator can alter *Entries to display on frontpage* and *Entries to display in Feeds* in a way to perform a SQL injection and extract database records or access files on the underlying system.

##Description

The function `serendipity_fetchComments` (implemented in `functions_comments.inc.php`) allows to obtain an array of comments related to a specific entry id. It accepts six parameters that will impact the query:
- `$id`: casted as integer and then used in the query;
- `$limit`: used unescaped in the query;
- `$order `: used unescaped in the query;
- `$showAll`: adds a fixed condition to the query;
- `$type`: used unescaped in the query;
- `$where`: used unescaped in the query.

Thus, any use of `serendipity_fetchComments` where either `$limit`, `$order`, `$type` or `$where` are user-controlled will result in a SQL injection. Two vulnerable calls were discovered.

The first one can be found in `rss.php`. The value of `$serendipity['RSSfetchLimit']` comes from website's configuration (*Entries to display in Feeds*) and is used as second argument of `serendipity_fetchComments`:

```php
<?php
// [...]
switch ($_GET['type']) {
    case 'comments_and_trackbacks':
    case 'trackbacks':
    case 'comments':
        $entries     = serendipity_fetchComments(isset($_GET['cid']) ? $_GET['cid'] : null, $serendipity['RSSfetchLimit'], 'co.id desc', false, $_GET['type']);
```

The same way, `serendipity_printCommentsByAuthor` (implemented in `functions_comments.inc.php`) uses `$serendipity['fetchLimit']` as second argument. The value of `$serendipity['fetchLimit']` also comes from website's configuration (*Entries to display on frontpage*):

```php
<?php
// [...]
    $sql_limit = $serendipity['fetchLimit'] * ($serendipity['GET']['page']-1) . ',' . $serendipity['fetchLimit'];
    $c = serendipity_fetchComments(null, $sql_limit, 'co.entry_id DESC, co.id ASC', false, $type, $sql_where);
```
## Steps To Reproduce

  1. Access https://blog.fuzzing-project.org/serendipity_admin.php?serendipity[adminModule]=configuration as authenticated administrator.
  1. Alter either *Entries to display on frontpage* or *Entries to display in Feeds* (under *Appearance and Options*) by adding any non-numeric character in one of these fields.
  1. Access https://blog.fuzzing-project.org/rss.php?type=comment if you edited *Entries to display in Feeds*, or the homepage is you edited *Entries to display on frontpage*. The character 
broke the correctness of the query and an error message will be displayed.

I don't have any test environment at the moment but let me know if you need a real payload to show it's possible to extract arbitrary database records.

## Impact

An authenticated administrator can extract database records, including password hashes of other users of the instance. Depending on database user privileges, it could also allow to access other bases or files on the underlying server.

## Timeline

- **Report Filed**
- **2018-07-15** @bb9866f3f743d6bf69b6836: Hi @hannob, any update regarding this one? Should I report it directly to upstream?
- **Report Triaged**
- **2018-07-18** @hanno: This is now fixed with a patch I got from s9y's dev (as should be all other open issues).
I'd appreciate if you could check that and also look for further issues, s9y will soon release a security update.
- **2018-07-18** @bb9866f3f743d6bf69b6836: > Garvin (s9y dev) thinks this is a low impact issue, as it requires a logged in admin. 

I agree, even if it could still be exploited by chaining with #373950. 

> I'd appreciate if you could check that and also look for further issues, s9y will soon release a security update.

The fix (https://github.com/s9y/Serendipity/commit/1afc4d929d96e5bf63cafd4cb8155ca2fb4e8f5f#diff-2168c9599f249d04a7bda43923c908f2R104) looks good to me. I would also add a cast to https://github.com/s9y/Serendipity/blob/1afc4d929d96e5bf63cafd4cb8155ca2fb4e8f5f/include/functions_comments.inc.php#L471, just to be sure.
- **2018-07-20** @bb9866f3f743d6bf69b6836: Suggestion implemented in https://github.com/s9y/Serendipity/commit/005a86da1cacdfb579001d4ff9f85df16b4b5316#diff-e9913ab11efe99f0e30efb4d2f6fd2b9R471.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
