---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2026-08-28
submitted: 2026-08-11T11:58:07.764Z
bounty_usd: null
votes: 48
cve: "CVE-2018-12895"
program: "[[programs/wordpress|WordPress]]"
reporter: "jakubk"
source: "https://hackerone.com/reports/3931777"
title: "Author → arbitrary file deletion anywhere on disk (site takeover) via `POST /wp/v2/media/<id>/finalize` poisoning `_wp_attachment_metadata`"
---
# Author → arbitrary file deletion anywhere on disk (site takeover) via `POST /wp/v2/media/<id>/finalize` poisoning `_wp_attachment_metadata`

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 48 | **Program:** WordPress | **Disclosed:** 2026-08-28

- Report: [https://hackerone.com/reports/3931777](https://hackerone.com/reports/3931777)
- CWE: Path Traversal | CVE: CVE-2018-12895
- Submitted: 2026-08-11T11:58:07.764Z

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2026-08-18** @johnbillion: We're dealing with a bounty payment processing issue. We'll get this paid as soon as we can. Thanks.
- **Bounty Awarded**
- **2026-08-19** @jakubk: Thank you, @johnbillion — a really nice thing to wake up to this morning; see you on the next report! :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-08-28** @jakubk: Thanks again @johnbillion, and thanks for agreeing to disclosure.

Two small metadata points now that it's public, both entirely your call:

The CVE field shows CVE-2018-12895. That's the 2018 thumb-key bug I cited as prior art in the "Prior art / duplicate check" section rather than this issue — different metadata key (file), different entry point (the REST finalize endpoint), and a different branch of wp_delete_attachment_files(). The 4.9.7 fix was key-specific and didn't touch the $backup_sizes branch, and finalize_item() didn't exist in 2018, which is why this needed its own fixes. Would a separate CVE be appropriate here (and for #3931771, which currently shows none)?

Also, the Asset is set to Gutenberg, but Proof E reproduces the full chain on plugin-free core trunk and the fix includes r62616/r63200. WordPress Core might be the more accurate tag.

Neither affects anything practical — just flagging while people are arriving from the disclosure.
