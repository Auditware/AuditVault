---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2023-10-09
submitted: 2023-02-27T01:14:23.479Z
bounty_usd: 500
votes: 63
cve: []
program: "[[programs/irccloud|IRCCloud]]"
reporter: "lotsofloops"
source: "https://hackerone.com/reports/1887917"
title: "XSS from Mastodon embeds"
---
# XSS from Mastodon embeds

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 63 | **Program:** IRCCloud | **Disclosed:** 2023-10-09

- Report: [https://hackerone.com/reports/1887917](https://hackerone.com/reports/1887917)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2023-02-27T01:14:23.479Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

By default, the IRCCloud web client embeds Mastodon toots when a link to one is sent. Anyone can run a Mastodon server, and so the server from which toot data is fetched might be malicious. It is possible for an attacker to cause a web client user to execute arbitrary JavaScript in the context of the IRCCloud web client by tricking the web client into embedding a `javascript:` URL.

**POC**:
1. Ensure "Embed social media links" is enabled in settings under "Chat & embeds" (I think this is on by default)
2. Send a message with a link to https://sm4.ca/@a/123456789012345678 (the link itself 404s but IRCCloud only tries to use Mastodon API so it doesn't matter)
3. Wait a few seconds for the embed to load
4. Look at your session cookie

When the web client sees what looks like a toot URL, it tries to get canonical toot URL by making a query to `[domain]/api/v1/statuses/[toot ID]`. Here is what I serve at `https://sm4.ca/api/v1/statuses/123456789012345678`:

```json
{
  "account": {
    "url": "https://sm4.ca/@a"
  },
  "url": "javascript:top.document.body.innerHTML = \"hi your cookie is \" + document.cookie;//"
}
```

(`.account.url` is only present because the web client ensures it matches the original link)

The web client creates an `iframe` using `.url` as the src, which in this case is a `javascript:` URL. The specified script runs in a seperate document that has access to its parent, and can access anything the parent can. The `//` is needed at the end since the web client appends `/embed` to the embed URL.

(also apart from this particular issue, I don't think Mastodon embeds should be enabled unless "Embed 3rd party image and video links" is enabled since even when the Mastodon server isn't malicious your IP address is still leaked to an arbitrary server)

## Impact

An attacker who can send a message to an web-client-using IRCCloud user can obtain their session token and act as them. By sending a message with a malicious URL to a large channel an attacker could compromise many users at once.

## Timeline

- **Report Filed**
- **2023-02-27** @jwheare: Thanks for the detailed report and POC. We confirmed this issue and have pushed out a fix that prevents embedding into an iframe any URL that starts with any of:
* `javascipt:`
* `data:`
* `vbscript:`
* `file:`
* `smb:`

Note, these are likely not all exploitable, but it doesn't do any harm to block them, and a mechanism to do them all together was readily available.

We have also pushed out a change that separates Mastodon embeds from Twitter embeds. The former will now be off by default and warn about IP leakage, the latter will remain on by default.

Let me know if there are any further mitigations or problems you can spot with this issue.
- **Bounty Awarded**
- **2023-02-27** @lotsofloops: The fix can be bypassed by adding a space character to the beginning of the URL (try with https://sm4.ca/@a/000000000000000002):

```json
{
  ...
  "url": " javascript:top.document.body.innerHTML = \"hi your cookie is \" + document.cookie;//"
}
```

(it can also be bypassed with leading ASCII control characters, or by adding tabs/newlines anywhere in `javascript:`)

You should use something like `(new URL(...)).protocol === "https:"` (catching the error it raises on an invalid URL) to check if the URL is okay - there is a lot complexity with URL parsing that the built-in `URL` API can handle for you.
- **2023-02-27** @jwheare: Yup, that's a good call, pushing that change out now.
- **2023-03-01** @lotsofloops: I took a look at the now-current version, I don't see any issues with it. Thanks for fixing this so quickly!
- **Report Resolved**
- **Agreed On Going Public**
- **2023-09-21** @lotsofloops: Would you mind disclosing this? Thanks!
- **Report Became Public**
