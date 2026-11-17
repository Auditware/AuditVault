---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2026-08-28
submitted: 2026-08-11T11:54:55.513Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "jakubk"
source: "https://hackerone.com/reports/3931771"
title: "Author → stored XSS in wp-admin: unescaped sub-size filename from attachment metadata breaks out of the `src` attribute in `get_media_item()`"
---
# Author → stored XSS in wp-admin: unescaped sub-size filename from attachment metadata breaks out of the `src` attribute in `get_media_item()`

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 32 | **Program:** WordPress | **Disclosed:** 2026-08-28

- Report: [https://hackerone.com/reports/3931771](https://hackerone.com/reports/3931771)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2026-08-11T11:54:55.513Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2026-08-12** @jakubk: **Addendum / self-correction — a second XSS sink in the same file, and a "not affected" claim above I need to correct.**

Extending the finalize `sizes[*].file` write primitive from this report, I found that one of my "screens NOT affected" results is wrong. I'd rather flag it here than leave it standing in a triaged report.

**Correction.** Above I reported `post.php?post=<id>&action=edit -> escaped/absent`. That was an artifact of *which size I poisoned* (only the 150x150 `thumbnail`), not of escaping. The attachment-edit screen builds its preview with:

```
wp-admin/includes/media.php
:3149  $thumb_url = wp_get_attachment_image_src( $attachment_id, array( 900, 450 ), true );
:3179  <img class="thumbnail" src="<?php echo set_url_scheme( $thumb_url[0] ); ?>" ... />
:3229  identical twin in the non-image branch
```

`wp_get_attachment_image_src( ..., array(900,450) )` -> `image_downsize()` selects the **`large`** intermediate on the default size set, never `thumbnail` — so my payload was simply not present on that screen. It was never HTML-escaped: `set_url_scheme()` only normalises the URL scheme (this is the "at least pass through `set_url_scheme()`" note in my SINK section — it provides no escaping).

**Exploitable.** Poison the size that `image_downsize(900,450)` actually selects (`large`) and the raw value flows through the same concatenation into `$thumb_url[0]` and breaks out of the double-quoted `src` at `:3179`, on `post.php?post=<id>&action=edit` — the standard "Edit" screen for any Media Library item, not the legacy popup. Verified end-to-end on released WordPress 7.0.3 + Gutenberg 23.6.0, same Author -> Administrator model and negative controls as above:

```
finalize -> sizes[large][file] = a.jpg"><svg onload="document.title='XSSEXEC-'+document.domain"></svg><x y="
ADMIN opens post.php?post=<id>&action=edit  -> edit_form_image_editor(), media.php:3179
  <img class="thumbnail" src=".../a.jpg"><svg onload="..."></svg><x y="" ... />   attribute+element break-out, not encoded
headless Chromium + Administrator cookies, real edit URL:  document.title = "XSSEXEC-localhost"  -> executed
clean neighbouring attachment: 0 injections
```

**Fix implication.** The write-layer fix I already recommended (reject non-basename `sizes[*].file` / `original_image` at `finalize_item()`, and `wp_basename()` in `image_get_intermediate_size()`) closes this sink too. But an interim patch that only escapes `get_media_item()` at `:1716` leaves `edit_form_image_editor()` at `:3179`/`:3229` vulnerable — those two lines need `esc_url( set_url_scheme( $thumb_url[0] ) )` as well.

Your call whether to track this under #3931771 or to have me file it as a separate report for the `:3179`/`:3229` sink. Same AI-tooling disclosure as the report above; every quoted line is real output from the 7.0.3 lab.
- **Report Resolved**
- **2026-08-18** @johnbillion: We're dealing with a bounty payment processing issue. We'll get this paid as soon as we can. Thanks.
- **Bounty Awarded**
- **2026-08-19** @jakubk: Thank you, @johnbillion — a really nice thing to wake up to this morning; see you on the next report! :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-08-28** @jakubk: Thanks again @johnbillion, and thanks for disclosing this one too — CVE question is on #3931777 so as not to duplicate it here.
