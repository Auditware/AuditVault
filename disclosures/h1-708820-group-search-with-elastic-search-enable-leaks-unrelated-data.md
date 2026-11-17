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
