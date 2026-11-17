---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2018-08-11
submitted: 2018-07-31T05:47:18.646Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/homebrew|Homebrew]]"
reporter: "ejholmes"
source: "https://hackerone.com/reports/388740"
title: "GitHub API Key for BrewTestBot is publicly exposed"
---
# GitHub API Key for BrewTestBot is publicly exposed

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Homebrew | **Disclosed:** 2018-08-11

- Report: [https://hackerone.com/reports/388740](https://hackerone.com/reports/388740)
- CWE: Information Disclosure
- Submitted: 2018-07-31T05:47:18.646Z

## Timeline

- **Report Filed**
- **2018-07-31** @ejholmes: Did a little more sleuthing. These credentials give me commit access to the following repos:

* Homebrew/brew
* Homebrew/formulae.brew.sh
* Homebrew/homebrew-core

Proof:

```
$ curl https://api.github.com/repos/Homebrew/homebrew-core/git/blobs -u $GITHUB_API_TOKEN:x-oauth-basic -d '{"content":"test"}' -H "Content-Type: application/json"
{
  "sha": "30d74d258442c7c65512eafab474568dd706c430",
  "url": "https://api.github.com/repos/Homebrew/homebrew-core/git/blobs/30d74d258442c7c65512eafab474568dd706c430"
}
```
- **Report Triaged**
- **Report Resolved**
- **2018-07-31** @ejholmes: @mikemcquaid thanks for the quick response! I think it's important that this gets disclosed, and I'm planning on writing a blog post about this. Potentially, all of the internet has had access to commit to Homebrew since this access token has had these scopes (any idea how long that might be?).

The possibilities for what could have been done with these credentials is pretty concerning; best case I'm the first to discover this, worst case this has been discovered by malicious actors and Homebrew packages have back doors in them now. It seems like auditing whether this has been used maliciously is going to be fairly difficult, since the commits would be coming from BrewTestBot.

I'll defer to you on when you think is the right time to go public with this.
- **2018-07-31** @mikemcquaid: Excuse my brevity because I’m on my phone. I’m on paternity leave right now so I’ll answer some more of your questions when I get the chance. Please hold off disclosing anything publicly for at least some weeks until I’m back at work. I can provide more details later if requested but it’s not accurate to say that this could be used to backdoor Homebrew packages. At worst this would allow pushing commits (which the audit log will help me identify if this happened) to a single repository and not all of Homebrew for the relatively short window these scopes were upgraded. Personally I’d rather this was not disclosed publicly at all.
- **2018-07-31** @ejholmes: Understood. I'll hold off on posting anything publicly about this until you're back from paternity leave, and we have a complete understanding of what could have been achieved with these credentials.
- **2018-08-01** @ejholmes: While I'm waiting, I wanna respond with how I think this could have been used to insert a back door, given I had commit access to `Homebrew/brew`, `Homebrew/homebrew-core`. This assumes that the `master` branch on these repos does not have branch protection + required reviews, meaning I would be able to fast-forward `refs/heads/master`.

### 1) Replacing bin/brew

The installation instructions on [brew.sh](https://brew.sh/) document the recommended method for installing homebrew as:

```console
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

This downloads and evaluates the Ruby script found at https://github.com/Homebrew/install/blob/master/install.

The ruby script does a few things, one of which is to [clone the master branch of https://github.com/Homebrew/brew into `/usr/local/Homebrew`](https://github.com/Homebrew/install/blob/052743dae1c004829c02e1a7c0b4aa82eff18846/install#L326-L362).

```ruby
system git, "config", "remote.origin.url", BREW_REPO
system git, "config", "remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*"

# ensure we don't munge line endings on checkout
system git, "config", "core.autocrlf", "false"

args = git, "fetch", "origin", "master:refs/remotes/origin/master",
       "--tags", "--force"
system(*args)

system git, "reset", "--hard", "origin/master"
```

Given that this clones the `master` branch, If I were able to fast-forward `refs/heads/master`, I could have committed a backdoored version of [bin/brew](https://github.com/Homebrew/brew/blob/master/bin/brew). The next time someone downloaded/updated homebrew, I would have control of their machine.

#### 2) Replacing formulae

Given this also granted commit access to Homebrew/homebrew-core, I could have replaced the formula for any package with a backdoored version of it. The next time someone installs the package, I would have control of their machine.

---

I think the severity of this ultimately rests on whether or not I would have been able to fast-forward the master branches on either repo. It looks like Homebrew/brew might have branch protection + required reviews, but it seems like Homebrew/homebrew-core does not, meaning I would have been able to replace formula.
- **2018-08-01** @mikemcquaid: Homebrew/brew has had protected branches and required reviews so this was never possible there. Homebrew/homebrew-core and Homebrew/homebrew-test-bot now have protected branches which prevents BrewTestBot (but not some repository administrators who have higher permissions) from pushing to master. This was not in place when the token was leaked. I've contacted GitHub Support to identify if that token was used to push to any Homebrew repositories in that time (but initial investigations indicate it was not) and verified with an identically scoped token that I cannot push.

It's worth noting although you'd be able to modify a formula it would have been likely noticed by one of the other homebrew-core maintainers who follow the commit log very closely (e.g. ilovezfs). You would also not have been able to modify existing or create a new binary package on Bintray as these require separate credentials.

I'm not involved with the security space so my preference would be for this not to be publicly disclosed as I feel it's likely to reflect badly on the project and me personally but ultimately that's up to you. I would ask that I can read your blog post before you post it publicly, though, and you still hold off posting it for a while (as we're discussing whether any additional security measures would be feasible and if they are it would be good to announce it there).

Thanks again!
- **2018-08-01** @ejholmes: > I'm not involved with the security space so my preference would be for this not to be publicly disclosed as I feel it's likely to reflect badly on the project and me personally but ultimately that's up to you. I would ask that I can read your blog post before you post it publicly, though, and you still hold off posting it for a while (as we're discussing whether any additional security measures would be feasible and if they are it would be good to announce it there).

Totally understand your feelings here, and I don’t want this to draw negative attention on Homebrew maintainers themselves, or point blame at anyone. As a long time user of Homebrew, I appreciate the amount of effort you and the rest of the team have put in to making Homebrew what it is today.

However, I think it’s important to note that if this was leaked without being disclosed by the Homebrew team, it would look a lot worse than just saying “Here’s what happened, it wasn’t used maliciously. We screwed up because we’re human, we’ll do better”. For something like this, I would recommend a public disclosure from Homebrew, ideally including proof that this wasn’t used maliciously.

I think this can be used to draw more support to the needs of Homebrew; given how popular it is, and the potential impact of a vulnerability like this, a lot more resources could be devoted to improving security for Homebrew. If this draws the attention of something like the Project Zero team at Google, that might mean an overall better and more secure tool for users. I think this also highlights a fundamental flaw in the industry where we put a lot of implicit trust in package managers to be perfect, which ends up leading to a massively large attack vector for backdoors; NPM, RubyGems, PyPi and the like have all had and will have very similar vulnerabilities to this.

I’ll be drafting the blog post over the next few weeks, and I’ll give you a chance to review it before I publish (and after you’re back from paternity leave).
- **2018-08-01** @mikemcquaid: Thanks for that. I'll work on a public disclosure that we can release at the same time as your blog post (if that works for you) and perhaps we could each review the other's? I like the idea of getting more help directed to Homebrew. I've started a conversation internally on how we can deal with issues like this better in future. Thanks again!
- **2018-08-02** @ejholmes: Awesome. More than happy to review your draft when you have it.

Also, if I can make a few recommendations, here's a few things that would be worth doing (if they haven't already been done), and included in the public disclosure.

1. Enable the "Require 2FA" setting on the Homebrew org: https://github.com/organizations/Homebrew/settings/security. This wouldn't have prevented the issue at hand, but could help prevent another similar attack (e.g. see the recent [Gentoo GitHub breach](https://thehackernews.com/2018/07/github-hacking-gentoo-linux.html)). It would probably be a good idea to also vocalize to any members of the Homebrew team to not use SMS based 2FA (see the [Reddit breach](https://www.reddit.com/r/announcements/comments/93qnm5/we_had_a_security_incident_heres_what_you_need_to/) today). The Reddit disclosure is also a really great example of a good disclosure (What happened, What's the impact, What we're doing).
2. Enable third party app restrictions for the Homebrew org: https://github.com/organizations/Homebrew/settings/oauth_application_policy. This will help ensure that, if any Homebrew members OAuth with some mom-and-pop app, those API keys won't be usable on the Homebrew/* repos. Like the above, this wouldn't have prevented this issue, but it can prevent a similar one in the future.
3. Enable branch protection + required reviews on any core Homebrew repos that don't have it (e.g. `Homebrew/homebrew-core`, `Homebrew/homebrew-cask`, `Homebrew/brew.sh`), and audit the number of people that have "admin" rights on the repos so this can't be bypassed.
4. Have all the Homebrew org members review their personal access tokens and prune anything that's not used: https://github.com/settings/tokens

There's probably a broader discussion that could be had on how the brew client could be made to put less trust in the `Homebrew/homebrew-core` repo and GitHub, like using GPG signing, but those are probably discussions that would need to happen elsewhere.
- **2018-08-02** @mikemcquaid: Thanks! 

1. We've had "require 2FA" enabled for as long as it's been a feature but I'll recommend avoiding SMS to the current maintainers.
2. We've had this enabled as long as it's been a feature (or close to that)
3. Branch protection has been enabled on all repos. We can't have required reviews unfortunately because the team isn't big enough. I've enabled mandated CI checks on all repos but other maintainers have turned them off on the Homebrew Cask repos and wish to have the ability to push directly to master on the Homebrew Core repo.
4. Good idea, I'll let them know too.

On GPG signing: I proposed that to the Homebrew leadership team and was unfortunately outvoted. I think there should still be a public discussion, though, so please feel free to open an issue on Homebrew/homebrew-core proposing that (without disclosing anything from here yet but I think it can be recommended as a good security practice regardless). If you'd rather not, I can do so but I figure you'll be able to do a better write-up than me!

Thanks again!
- **2018-08-05** @mikemcquaid: I've written my first draft of the blog post, let me know what you think: https://github.com/Homebrew/brew.sh/compare/master...MikeMcQuaid:security-disclosure?expand=1&short_path=4f1f53b#diff-4f1f53bd979bc0cf0ad1c6d75a43eadd

Please feel free to suggest any changes; this is my first security vulnerability disclosure. I'm more than happy to mention you by name and link to you directly.

Additionally good news from GitHub: they confirmed the relevant token's user did not push to and of those repositories in the given vulnerable window (from when the token had elevated privileges)
- **2018-08-05** @mikemcquaid: Also to be explicit: whenever you're happy with this post I'm good to post it. If you'd rather I wait for you post (as you waited for ours) then I'm happy to do so.
- **2018-08-06** @mikemcquaid: Hi, just checking in here; don't want to rush you but want to probably get this post out sooner rather than later. Thanks again!
- **2018-08-06** @ejholmes: Hey @mikemcquaid. Sorry for the late response. I'll take a look at reviewing it now. I also have a rough draft of the blog post I'm planning, if you don't mind reviewing as well: https://medium.com/p/2ae314df03ab/edit
- **2018-08-06** @ejholmes: I think this looks good. I made some minor changes that I think makes it read a little better; some headings, and more explicit actions that were taken as mitigation steps. https://gist.github.com/ejholmes/7a0efa29911431293b8a409b3a30e08d

Feel free to pull those changes in, or publish as is.
- **2018-08-07** @mikemcquaid: @ejholmes I can't read that Medium link; does it need an account? Any change of pasting it into a Gist (even with formatting removed)?
- **2018-08-07** @mikemcquaid: Got through now! Left a few comments that are open to discussion. Will post ours and can add a link to yours from ours when it's published.
- **2018-08-07** @mikemcquaid: The post is live now: https://brew.sh/2018/08/05/security-incident-disclosure/. Will happily edit in your name and post as desired when they are public. Thanks again for all your work.
- **2018-08-07** @ejholmes: Awesome. I also published my blog post at https://medium.com/@vesirin/how-i-gained-commit-access-to-homebrew-in-30-minutes-2ae314df03ab. Thanks for your hard work (especially while on paternity leave)!
- **2018-08-07** @mikemcquaid: Thanks again! Linking to it here: https://github.com/Homebrew/brew.sh/pull/238
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
