---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2021-08-10
submitted: 2021-02-16T17:13:18.507Z
bounty_usd: 5000
votes: 102
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "zofrex"
source: "https://hackerone.com/reports/1104874"
title: "Insecure Bundler configuration fetching internal Gems (okra) from Rubygems.org"
---
# Insecure Bundler configuration fetching internal Gems (okra) from Rubygems.org

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 102 | **Program:** Basecamp | **Disclosed:** 2021-08-10

- Report: [https://hackerone.com/reports/1104874](https://hackerone.com/reports/1104874)
- CWE: Command Injection - Generic
- Submitted: 2021-02-16T17:13:18.507Z

## Report summary

I found an internal gem (Ruby library) in use by Basecamp that was not registered on Rubygems (the public Ruby package repository). I registered a gem of my own under the name that would call back when installed, in an attempted "dependency confusion" attack.

Although this attack was not successful against any production machines or automated builds, as Basecamp had successfully mitigated against the attack in those places, my library was installed on a developer machine when a member of Basecamp attempted to install the gem by hand using "gem install" rather than running a "bundle install".

This vulnerability was resolved by using configuration management software to set the default package repository on developer machines to one controlled by Basecamp, where they can control which packages come from which repositories and can prevent internal packages being pulled from Rubygems.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **2021-02-17** @jeremy: We use Geminabox as a proxy. Pull request to never prefer a remote gem when a local gem with the same name is available, regardless of version: https://github.com/geminabox/geminabox/pull/339
- **2021-02-17** @zofrex: Well done on mitigating this in your production and Docker builds, looks like that worked well! Thank you very much for reading through my report, and of course thank you for the bounty. You might be interested to know that it is my first!

I have added sstephenson to the gem owner list, I will remove myself once his addition is confirmed. I believe if you yank the versions I published then Okra won't have to start its open-source life as version 90003, which would be a good story but might be confusing to users! Although you won't ever be able to publish a version 0.900.0, 1.900, or 90002.0. Hopefully that isn't a problem, but if it is, you may be able to nuke the Gem entirely and start over. Sorry if that's a hassle, I didn't realise you were going to be open-sourcing it!

I like the Geminabox PR, that's a good idea. I would gently suggest using separate repos for internal gems and Rubygems mirroring, though, as having them both merged in one repo is one more place for the separation logic to go wrong, and obscures from the user-end of things what dependency resolution is happening. Of course, separating the repos also doesn't help unless you are on Bundler version 2.2.10 or greater. If you are interested, I am writing a blog post on a more robust way to avoid dependency confusion attacks, and I could send you a link to the post when it is done?

Thank you again, engaging with your bug bounty program was a very pleasant experience and I really appreciate the fast response. I hope the experience has been good for you as well.
- **2021-02-17** @jeremy: > I would gently suggest using separate repos for internal gems and Rubygems mirroring, though, as having them both merged in one repo is one more place for the separation logic to go wrong, and obscures from the user-end of things what dependency resolution is happening.

We use Geminabox as a proxy server in case RubyGems itself is down. We don't generally rely on it for private gems, preferring bundling from git instead.

BUT that exposes us to a tougher issue, which we hit here: an inadvertent `gem install okra` doesn't know about the git source in Bundler, so it goes to public RubyGems.

To address that, we're going to point developer machines to our Geminabox proxy instead of rubygems.org and publish private "stub" gems. That'll prevent a `gem install okra` from even attempting a public install.

Little bit different scenario that the normal dependency confusion issues with hybrid private/public repositories.

> If you are interested, I am writing a blog post on a more robust way to avoid dependency confusion attacks, and I could send you a link to the post when it is done?

Absolutely! Please do.

Thank you for the thoughtful, thorough report. Made it quick to remediate.
- **2021-02-26** @jeremy: Hey @zofrex, would you transfer our other private gems to me (https://rubygems.org/profiles/jeremydaer) as well?

activejob-stats
activestorage-redundancy
critter
haybales
html_scrubber
queenbee-plugin
rspamd-ruby
redis_connectable

Thank you!
- **2021-03-10** @zofrex: Hi Jeremy,

So sorry for taking so long to get back to you on this, I've spent the last 2 weeks job hunting and completely dropped the ball on getting back to you.

I have now transferred all of those listed gems to you as well.

Looking at my notes, I also have Basecamp down as the owners of "rails-structured-logging", which isn't on your list. Do you want that one as well?

Sorry again for the slow response,

James
- **2021-04-28** @jeremy: Hey @zofrex,

Much appreciated.

Re. rails-structured-logging: yes, please do transfer.

(I hope your job hunt has gone well!)
- **2021-05-07** @zofrex: Hi Jeremy,

I've transferred rails-structured-logging to you as well now.

With the solution you have, do you consider this issue resolved now?

I did write that post on a robust way to avoid dependency confusion attacks, although I don't know if it will give you anything new, it sounds like you're doing something similar with Geminabox already - https://www.zofrex.com/blog/2021/04/20/virtual-namespacing-robust-approach-dependency-confusion/ . I wrote this post mostly with Artifactory in mind, so it might be interesting if you ever shared how you're doing this with Geminabox.

(it has gone well, thank you! - although this does leave me with substantially less time to improve the Ruby ecosystem! I hope everything is good with you, too)
- **2021-08-06** @zofrex: Hi,

Is there any update on this? It's still marked as 'Open', but I'm hoping that's out of date and you've managed to resolve it?

Also, any thoughts on my previous message?

Hope all is well,

James
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-07-28** @zofrex: I want to highlight a couple of things that I think on balance don't amount to a new report.

Firstly, the Gems I wrote are still online. If the vulnerability they exploit was fully mitigated this would not represent a risk, and it's definitely not a new finding because it's the same old Gems. Still, you probably want to yank them? There's code there that reports stuff to a server that currently I still rent, but maybe one day I won't. I know I'd feel more comfortable knowing those Gems were yanked and the reports stopped flowing. I didn't want to action this myself as I have given the gems to you now, they're yours really, so it didn't feel like it was my place to do so.

On which note: I still have ownership on the Gems, too. This is also not a report because that's not new, but from your point of view, ideally I wouldn't? These still potentially run on your machines sometimes, so I'd really encourage you to remove my access. I didn't do this myself, I thought it was better to leave to you to avoid any scenarios where no-one has access — if you can remove me, you have access, so it won't leave the gems in limbo.

Lastly, and this is the part that is _maybe_ a new report: I'm still getting callbacks periodically on these. I think most of them are false positives, but one does stand out: the package "okra" was installed at 26-Apr-2022 19:01:43 on a machine with hostname "dhh.local", and an IP address that geolocates to Denmark. You presumably know if DHH was in Denmark on that day, if he was the odds this is a false positive seem pretty low.

Is that a new report? Well, it is just the exact same thing again. But if you have put in those measures we talked about to prevent those kinds of attacks, and this was another successful one, then it's potentially a new one: there's a gap in those new defences. But if you just didn't do that yet, then I think this is pretty obviously a dupe.

Anyway, at the very least I'd love to see the packages taken down, and for you to take full ownership of them, that would be a lot more comfortable.

Hope all is well with you!

James
- **2022-08-01** @jeremy: Hey James, thanks for following up. We'll take care of these gems. Much appreciated!
