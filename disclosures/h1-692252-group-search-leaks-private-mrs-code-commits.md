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
submitted: 2019-09-11T10:22:51.911Z
bounty_usd: null
votes: 212
cve: "CVE-2019-5487"
program: "[[programs/gitlab|GitLab]]"
reporter: "rpadovani"
source: "https://hackerone.com/reports/692252"
title: "Group search leaks private MRs, code, commits"
---
# Group search leaks private MRs, code, commits

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 212 | **Program:** GitLab | **Disclosed:** 2019-12-14

- Report: [https://hackerone.com/reports/692252](https://hackerone.com/reports/692252)
- CWE: Improper Access Control - Generic | CVE: CVE-2019-5487
- Submitted: 2019-09-11T10:22:51.911Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

Using the group search you can access MRs and code set as "not public" in a project

### Steps to reproduce

Create a public group, create a public project inside the group, but with private code.
Push some code, search in the **group search** the code while logged out, you will find it also if it should be private.

I provide some working links in the example section.

### Impact

An attacker can extract all the private code, private MRs, private commits from a project

### Examples

I am going to use customers.gitlab.com examples because it is how I actually found the problem - the search I have done are about a Hackerone report I first published. I haven't saved any data, nor screenshot of what I have found, apart from the one attached

1. Go to https://gitlab.com/gitlab-org in a private window
2. In the top right bar, insert `Resolve "Account takeover due to IDOR on customers.gitlab.com [applicable for gitlab users only]"`
3. Select "Merge requests"
4. You see in the search result a MR that should be private, since the `customer-gitlab-com` project has no public code/MR
5. Link: https://gitlab.com/search?group_id=9970&project_id=&repository_ref=&scope=merge_requests&search=Resolve+%22Account+takeover+due+to+IDOR+on+customers.gitlab.com+%5Bapplicable+for+gitlab+users+only%5D%22

You can do the same thing for the code:
1. Go to https://gitlab.com/gitlab-org in a private window
2. In the top right bar, insert `In order to create an account for the [admin panel]`
3. Select "Code"
4. You see a piece of the README of customers.gitlab.com, which has a private code
5. Link:  https://gitlab.com/search?group_id=9970&repository_ref=&scope=blobs&search=In+order+to+create+an+account+for+the+%5Badmin+panel%5D&snippets=#

In the case of MRs, you can use also the wildcard symbol and filter by project, to extract all the private MRs:

https://gitlab.com/search?utf8=%E2%9C%93&snippets=&scope=merge_requests&repository_ref=&search=*&group_id=9970&project_id=2670515

When you filter by project, the code search stops to work, so if you want to extract all the code you have to apply custom search, but it is still feasible.

You got the point, we have also commits:
- https://gitlab.com/search?utf8=%E2%9C%93&snippets=&scope=commits&repository_ref=&search=Merge+branch+%27433-idor-fix%27+into+%27staging%27&group_id=9970

Issues are not affected by this bug

### What is the current *bug* behavior?

Leak of MRs overview, code, commits, and I suspect also wiki, but for some reason group search of wiki didn't work on my personal group, and I didn't want to look over other gitlab-org data

### What is the expected *correct* behavior?

No search result

### Relevant logs and/or screenshots

A MR of customers.gitlab.com I shouldn't have access to. Notice how I am not logged in in this screenshot

### Output of checks

This bug happens on GitLab.com

## Impact

An attacker can extract all the private code, private MRs, private commits from a project

## Timeline

- **Report Filed**
- **2019-09-11** @rpadovani: I actually wasn't able to reproduce it on my group, so I suppose it's a problem in the elastic search implementation, 'cause `gitlab-org` is, afaik, the only group on gitlab.com for which it has been activated
- **2019-09-11** @gitlab-securitybot: Hi @rpadovani,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-09-11** @rpadovani: Search APIs have the same problem, but it allows to access all the description of the MR. You have to be logged as a Gitlab user, but you don't need any permission on the victim's project.

I tried using the same MR, that is about another HackerOne issue - I did so to have a realistic target, but it is something I have already information about.

Use this curl:

```
curl --header "PRIVATE-TOKEN: secret" "https://gitlab.com/api/v4/groups/9970/search?search=%21435&scope=merge_requests" | jq
```

It returns, other than information about the MR, information about milestones, pipelines, labels, authors, and so on. Basically, through the APIs everything but the issues is leaked
- **Report Triaged**
- **2019-09-13** @gitlab-securitybot: ETA for fix:

Hi @rpadovani,

The GitLab issue created from your report is currently scheduled for 2019-09-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-10-01** @rpadovani: Hi @akelly, 
do you have any news for me on this?

It seems to me you have fixed it - ES is enabled again over Gitlab.com and it doesn't leak anything anymore, so I suppose it has been fixed?

Thanks!
- **2019-10-01** @akelly: Hello @rpadovani,

Thank you for checking in and verifying that a fix was applied to gitlab.com. We very much appreciate your report and assistance in making GitLab more secure.

I believe that a mitigation was applied for gitlab.com, but a proper fix has not yet been fully released for our entire customer base. My understanding is that we are in the process of trying to roll this wider fix out as soon as later today or potentially tomorrow. I will plan on keeping you updated as soon as I have more information to share.

Thanks again!

Have a great day,
Andrew
Security Team | GitLab
- **Report Resolved**
- **Bounty Awarded**
- **2019-10-03** @rpadovani: Hi @akelly,
thank you very much for the bounty!

Unfortunately, after a deeper inspection, the issue seems to be still present, if not worse.

Now the requests return also data totally unrelated, to which I shouldn't have access at all!

Let's take this search on the Gitlab group: https://gitlab.com/search?utf8=%E2%9C%93&snippets=&scope=merge_requests&repository_ref=&search=%21435&group_id=9970

If you go at the end of the page, you see 5 MRs from other groups that should be private - I have no idea what are those projects - I have no relation to them, and I have no access to the group they belong to! (See attached screenshot).

A lot more data can be retrieved through the APIs, now revealing existence of groups/projects I shouldn't know they exist!

I haven't fully understand the logic of the issue, but basically every combination of `!` followed by numbers (I had hits with `!709`, `!999`) leaks MRs from other groups.

While on the UI doesn't show much info, the APIs retrieve a lot of data.
- **2019-10-04** @rpadovani: So, basically now it seems to filter out sensitive data belonging to the group, but it seems also to include data from others groups - data that shouldn't be included.

It also leaks private activity on public issues. 

If you search for `nextbit`, [link](https://gitlab.com/search?utf8=%E2%9C%93&snippets=&scope=notes&repository_ref=&search=nextbit&group_id=9970), you see that my main account has linked a private issue to a public issue. The activity should be private, and indeed it is not reported inside the issue itself, but it is reported in the search.
- **2019-10-04** @akelly: Hello @rpadovani,

Thank you for providing us with that information. Our team is currently investigating this.

I will plan on keeping you up to date via HackerOne. In the meantime, please don't hesitate to reach out if you happen to notice anything else here. As always, we appreciate your time and effort.

Have a nice day,
Andrew
Security Team | GitLab
- **2019-10-07** @jmatos_bgtvf: Hello @rpadovani,

Thank you very much for the extra information.
We will be publishing a new critical security release today to address it.

As the root cause proved to be different than what the first fix was targeting, could you please open a new H1 report ? (
We will have a different CVE).

Best Regards,
Security Team | GitLab
- **2019-10-07** @rpadovani: Hi @jmatos_bgtvf 
thanks for the fast response and the fast fix!

I  opened #708820 reporting the finding :-)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
