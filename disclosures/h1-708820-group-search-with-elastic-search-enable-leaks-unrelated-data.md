---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-12-14
submitted: 2019-10-07T09:11:08.570Z
bounty_usd: null
votes: 100
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "rpadovani"
source: "https://hackerone.com/reports/708820"
title: "Group search with Elastic search enable leaks unrelated data"
---
# Group search with Elastic search enable leaks unrelated data

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 100 | **Program:** GitLab | **Disclosed:** 2019-12-14

- Report: [https://hackerone.com/reports/708820](https://hackerone.com/reports/708820)
- CWE: Improper Access Control - Generic
- Submitted: 2019-10-07T09:11:08.570Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

Performing a group search when Elastic Search is enabled provides access to unrelated merge requests, issues activity, leaking the existence of private groups, plus their activity and MRs.
This happens both on the GUI and with the APIs 

### Steps to reproduce

Let's take this search on the Gitlab group: https://gitlab.com/search?utf8=%E2%9C%93&snippets=&scope=merge_requests&repository_ref=&search=%21435&group_id=9970

If you go at the end of the page, you see 5 MRs from other groups that should be private - I have no idea what are those projects - I have no relation to them, and I have no access to the group they belong to! (See attached screenshot).

A lot more data can be retrieved through the APIs, now revealing existence of groups/projects I shouldn't know they exist!

I haven't fully understand the logic of the issue, but basically every combination of ! followed by numbers (I had hits with !709, !999) leaks MRs from other groups.

While on the UI doesn't show much info, the APIs retrieve a lot of data.

It also leaks private activity on public issues.

If you search for `nextbit`, [link](https://gitlab.com/search?utf8=%E2%9C%93&snippets=&scope=notes&repository_ref=&search=nextbit&group_id=9970), you see that my main account has linked a private issue to a public issue. The activity should be private, and indeed it is not reported inside the issue itself, but it is reported in the search.

### Impact

Leaking existence of private groups, private issues activity, private MRs, with lot of metadata

## Impact

Leak of private MRs with metadata, activity of private issues, leak existence of private groups

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-10-07** @jmatos_bgtvf: Fixed in critical security release 12.3.5
- **Bounty Awarded**
- **Report Resolved**
- **2019-10-08** @jmatos_bgtvf: For your information, Elasticsearch integration has been reactivated in GitLab.com

Best regards,
Security Team | GitLab Inc.
- **2019-10-08** @rpadovani: Hi @jmatos_bgtvf,

Thanks for the bounty!

The comments search seems to still leaks data about private issues.

Go, as an anonymous user, to https://gitlab.com/search?group_id=9970&repository_ref=&scope=notes&search=nextbit&snippets= (see screenshot).

You will see a comment on a private issue, of a private project, of a private group.

Therefore, the search is leaking existence of private projects, private groups, and existence of issues.

If you open the returned issue, the information is properly hidden.

Is the same bug or should I open a new report?
Basically, the `notes` scope search is not properly cleared from private information. I suppose it is the same with notes from MRs or other components, but I don't want to blindly look for private projects.

Please note that the name of projects could reveal the name of customers (in our case, `nextbit` is the company I work for, but the name of the project should be confidential)
 
You can reproduce it also through APIs:

```
➜ curl "https://gitlab.com/api/v4/projects/278964/search?scope=notes&search=nextbit" --header "PRIVATE-TOKEN: secret" | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   520  100   520    0     0    508      0  0:00:01  0:00:01 --:--:--   508
[
  {
    "id": 215547575,
    "type": null,
    "body": "mentioned in issue nextbit/VirtualCore/gui#109",
    "attachment": null,
    "author": {
      "id": 16048,
      "name": "Riccardo Padovani",
      "username": "rpadovani",
      "state": "active",
      "avatar_url": "https://secure.gravatar.com/avatar/9d89d4072afb4457b0c49131d8d258f5?s=80&d=identicon",
      "web_url": "https://gitlab.com/rpadovani"
    },
    "created_at": "2019-02-19T12:54:23.670Z",
    "updated_at": "2019-02-19T12:54:23.670Z",
    "system": true,
    "noteable_id": 24685040,
    "noteable_type": "Issue",
    "resolvable": false,
    "noteable_iid": 25362
  }
]
```
- **2019-10-08** @akelly: Hello again @rpadovani,

Thank you for providing us with that information. Our engineering team is aware of the issue and believes it is a new, separate issue. Would you mind submitting a new HackerOne report with the details of your new finding?

Thanks again for collaborating with us to make GitLab more secure. Your time and effort is very much appreciated!

Have a great day,
Andrew
Security Team | GitLab
- **2019-10-08** @rpadovani: Hi @akelly,
thanks for your fast reply, and the transparency in managing these issues! Kudos!

I followed up with #710006.

Thanks again :-)

P.S.: Totally unrelated, you should probably update the description of the program here on HackerOne, linking to the new mono repo, instead of the old `-ce` and `-ee`
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
