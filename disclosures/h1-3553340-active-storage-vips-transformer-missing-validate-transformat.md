---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/ruby
substate: "informative"
weakness: "Path Traversal"
enriched: true
date: 2026-07-30
submitted: 2026-02-13T09:42:24.457Z
bounty_usd: null
votes: 30
cve: "CVE-2025-24293"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "friedchicken112211"
source: "https://hackerone.com/reports/3553340"
title: "Active Storage Vips Transformer Missing validate_transformation — CVE-2025-24293 Incomplete Fix"
---
# Active Storage Vips Transformer Missing validate_transformation — CVE-2025-24293 Incomplete Fix

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Ruby on Rails | **Disclosed:** 2026-07-30

- Report: [https://hackerone.com/reports/3553340](https://hackerone.com/reports/3553340)
- CWE: Path Traversal | CVE: CVE-2025-24293
- Submitted: 2026-02-13T09:42:24.457Z

## Timeline

- **Report Filed**
- **2026-02-13** @flavorjones: Thanks for your report. The technical observation is accurate — the Vips transformer does not override `validate_transformation` with the same allowlist/denylist that the ImageMagick transformer uses.

However, the Rails security team has established that the image processing method allowlist is a defense-in-depth measure, not a security boundary. Passing user-supplied transformation methods or parameters to `blob.variant()` is explicitly documented as unsafe:

https://edgeguides.rubyonrails.org/active_storage_overview.html#transforming-images

As a result, reports related to gaps or bypasses in the allowlist are treated as functional issues rather than security vulnerabilities. The standard access path for variants uses signed URLs (`ActiveStorage.verifier`), which prevent an attacker from injecting arbitrary transformation parameters.

We'd encourage filing this as a functional improvement on the public Rails issue tracker (https://github.com/rails/rails/issues) — moving the validation into the base class for consistency across all processors would be a worthwhile enhancement.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
