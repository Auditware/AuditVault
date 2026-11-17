---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/deserialization-of-untrusted-data
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2020-05-26
submitted: 2018-09-24T12:58:49.441Z
bounty_usd: null
votes: 2
cve: "CVE-2020-8165"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "dylan-ts"
source: "https://hackerone.com/reports/413388"
title: "Untrusted strings that are cache fetched with raw option are automatically marshal loaded"
---
# Untrusted strings that are cache fetched with raw option are automatically marshal loaded

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Ruby on Rails | **Disclosed:** 2020-05-26

- Report: [https://hackerone.com/reports/413388](https://hackerone.com/reports/413388)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2020-8165
- Submitted: 2018-09-24T12:58:49.441Z

## Timeline

- **Report Filed**
- **2018-09-25** @dylan-ts: Without publicly disclosing the security vulnerability, I've fixed it for the memcached_store gem (https://github.com/Shopify/memcached_store/pull/51) and released its fix in v2.0.2.
- **2018-09-27** @jeremy: Thanks for the report @dylan-ts! The `:raw` option is to bypass using Entry wrappers. It has the same threat profile as `eval`, and is meant to. Are you seeing cases where it's commonly misused, or invites untrusted input?
- **2018-09-27** @jeremy: Ah, seeing the issue is that the entry is being deserialized despite having specified `raw: true`. That's an issue 👍

In the patches, note that the local cache strategy wraps raw values with Entry instances for in-memory cache lookups, but that's not written to the underlying cache store.
- **Report Triaged**
- **2018-09-28** @dylan-ts: LocalCacheWithRaw wraps the raw values in write_entry, so there is no need for LocalCacheWithRaw#read_entry when the super method already returns a Entry instance.  So basically I just removed that method in the patches because it was unnecessary.
- **2019-01-21** @dylan-ts: Any update on this?  It feels like it has just been forgotten about.
- **2020-05-13** @dylan-ts: I've rebased and reapplied the patches on the latest master, 5-2-stable and 6-0-stable.  The patch for RedisCacheStore in rails 6.0 is just a deprecation for backwards compatibility reasons, as I explained before for rails 5.2.

I tested the demo scripts and confirmed that the vulnerability is still present, although the introduction of https://github.com/ruby/ruby/commit/b3507bf147ff47e331da36ba7c8e6b700c513633 into ruby 2.7 will prevent the remote code execution as demonstrated above with ERB, but I confirmed that the exploit script does still work with ruby 2.6.
- **2020-05-15** @jack_mccracken: I've created an advisory for this vulnerability. Let me know if it sounds good to you!
- **2020-05-16** @dylan-ts: I noticed a typo on the line starting with:

> Not affected:       Applications not using MemCacheStoer or RedisCacheStore.

Replace "MemCacheStoer" with "MemCacheStore".

I'm assuming "CVE-2020-XXXX" will be replaced once a CVE number is obtained.

Otherwise, looks good to me.
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **2020-05-18** @dylan-ts: I'm just glad this is getting fixed. Thanks!
- **Manually Disclosed**
