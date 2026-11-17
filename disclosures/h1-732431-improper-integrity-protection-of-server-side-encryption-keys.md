---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insufficiently-protected-credentials
  - env/web
substate: "resolved"
weakness: "Insufficiently Protected Credentials"
enriched: true
date: 2020-11-13
submitted: 2019-11-08T14:19:09.158Z
bounty_usd: null
votes: 2
cve: "CVE-2020-8259"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "weizenspreu"
source: "https://hackerone.com/reports/732431"
title: "Improper integrity protection of server-side encryption keys"
---
# Improper integrity protection of server-side encryption keys

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Nextcloud | **Disclosed:** 2020-11-13

- Report: [https://hackerone.com/reports/732431](https://hackerone.com/reports/732431)
- CWE: Insufficiently Protected Credentials | CVE: CVE-2020-8259
- Submitted: 2019-11-08T14:19:09.158Z

## Timeline

- **Report Filed**
- **2019-11-08** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2019-11-11** @nickvergessen: > Administrative access to the actual Nextcloud server is not necessary to mount this attack.

First of all, having access to the file system where Nextcloud runs is actually "having administrative access", as you can simply add a user which is part of the admin group.

> The mentioned attack scenarios may also be executed by an external storage provider if the folder that is used as the data directory is stored at this external storage provider.

Our idea for this problem is to allow to change the location of the key storage.
Check https://docs.nextcloud.com/server/17/admin_manual/configuration_files/encryption_configuration.html#occ-encryption-commands
> ```
> occ encryption:show-key-storage-root
> Current key storage root:  default storage location (data/)
> ```
> Move keys to a different folder, either locally or on a different server. The folder must already exist, be owned by root and your HTTP group, and be restricted to root and your HTTP group. Further the folder needs to be located somewhere in your Nextcloud data folder, either physically, or as a mount. This example is for Ubuntu Linux. Note that the new folder is relative to your occ directory:

> ```
> cd /your/nextcloud/data
> mkdir keys
> chown -R root:www-data keys
> chmod -R 0770 keys
> occ encryption:change-key-storage-root keys
> Start to move keys:
>    4 [============================]
> Key storage root successfully changed to keys
> ```


So in case of an external storage being used, you would simply not put the encryption keys on the external storage, but leave them on your save Nextcloud server.

I will have a closer look at the user-key scenario again.
- **2019-11-15** @weizenspreu: Hi, I know had time to look at this again. Your documentation says:

> Further the folder needs to be located somewhere in your Nextcloud data folder, either physically, or as a mount.

So your idea for this problem wouldn't work in cases where the whole data directory is stored at an external party as - according to the documentation - the keys have to reside in the data directory.
- **2019-11-25** @rullzer: I like the idea of storing the fingerprints in the database and comparing them.
I'll see what I can do. But it might take a while as the 18 wrap up is consuming a lot of time.
- **Report Triaged**
- **2020-01-21** @weizenspreu: Hi, I guess that now that Nextcloud 18 has been published there will be the time to look into the issues of the server-side encryption? My plan is to to submit a talk about the Nextcloud server-side encryption to the upcoming [Gulaschprogrammiernacht](https://entropia.de/GPN20) (May 21st to May 24th). This should be enough time to fix the issues.
- **2020-05-27** @weizenspreu: Hello, this issue hasn't seen any update for 4 months. We approached the end of May without a fix. Do you still intend to work on this problem?
- **2020-05-29** @rullzer: Hi,

Yes this is still on our list but right now we don't have a good way to solve it.

Cheers,
--Roeland
- **2020-08-11** @rullzer: Hi,

So I'm back form my holiday and am continuing on https://github.com/nextcloud/server/pull/21529

Since keys can be moved for files etc. Linking the data in the database is tricky. However in this new approach the keys are encrypted with the system secret. And hence the attacker can't modify them.

Would you have the possibility to check out that PR?

Cheers,
--Roeland
- **2020-08-11** @weizenspreu: I think that the solution goes in the right direction, but I see a certain flow: If I understand it correctly, it is still possible to replace the public key of one user with the public key of another user. So the given solution improves on the currently existing problem but does not completely fix it.

Unfortunately, you currently have no possibility to have integrity-protected metadata for public key files. If you switched the process around to: `encrypt(json_encode($data))` you could have integrity-protected metadata. Then, a possibility to fix this problem completely would be to not only introduce the `$data["key"]` value but also a `$data["user"]` value containing the name of the associated user. This could be checked on usage to make sure that the key actually belongs to the correct user. Thanks to the EtM encryption taking place at the end, the key as well as the metadata would be integrity-protected.
- **2020-08-11** @rullzer: Hi,

Thanks for the quick analysis.
Right turning it around would indeed make more sense. Let me do that.

I need to think about your comment. I think you are right and we can indeed store the user key with the uid.
In any case with this in place the attack scopes limits significantly in the sense that the attacker now must have an account on the system and access to the external storage. However lets fix it properly now that we are touching the code in any case.

I need a break now since it is way to hot here. I'll get back to you tomorrow.

Cheers,
--Roeland
- **2020-08-12** @rullzer: Hi,

I updated the PR. Now it also stores the UID in the userkeys  (and null in the systemkeys). This is then all encrypted.
It needs some cleanup but I think this now goes in the right direction.

Cheers,
--Roeland
- **2020-08-12** @weizenspreu: Hi, I had a short look at the current version in the PR. IMHO this is coming together quite nicely.

I am, however, a bit confused with the additional encodings going on. Of course, you may have certain reasons to double- and tripple-encode data, but I just wanted to mention what I see. I stumbled over this kind of (in my opinion) unnecessary file increases before with the 35% size-increase of the encrypted content files.:

* Currently, the public keys stored by the SSE are PEM-encoded (which is basically Base64-Encoding between text separators with line breaks). That's the formatting you retrieve [here](https://github.com/nextcloud/server/blob/aa387242e110555e6ff6058985b40a040f9c1540/lib/private/Encryption/Keys/Storage.php#L275) and write [here](https://github.com/nextcloud/server/blob/aa387242e110555e6ff6058985b40a040f9c1540/lib/private/Encryption/Keys/Storage.php#L340). Instead of Base64-encoding the whole data again, you could just replace the line breaks with a placeholder like `'\n'`, but that's more of a taste.
* What I don't understand is why you Base64-encode the encrypted content again before storing it in a file [here](https://github.com/nextcloud/server/blob/aa387242e110555e6ff6058985b40a040f9c1540/lib/private/Encryption/Keys/Storage.php#L343) only to Base64-decode it [here](https://github.com/nextcloud/server/blob/aa387242e110555e6ff6058985b40a040f9c1540/lib/private/Encryption/Keys/Storage.php#L299) when you read the file back in. I really don't see the benefit of this additional Base64-encoding. `file_get_contents()` and `file_put_contents()` are perfectly able to handle binary data without precautionary encoding.

But, as I said, this is more of an observation rather than a security issue.
- **2020-08-12** @rullzer: Hi,

No you are of course right. It is a left over I think from the first step where I encrypted only the key field (so that the json encode would not puke).

This can go indeed.
I'll tackle that in a bit.

Cheers,
--Roeland
- **2020-08-13** @rullzer: Hi,

Ok we went over the code here again and some cleanup was done.
Now we are in the process of doing lot of tests but all seems good. I'm positive this can land in thenext release.

Cheers,
--Roeland
- **2020-08-13** @weizenspreu: Awesome to hear that. :)
- **2020-08-24** @rullzer: Hi,

Ok this got merged into 20.
It is already in the beta1.

Cheers,
--Roeland
- **2020-10-05** @weizenspreu: Hi, I've seen that you have announced Nextcloud 20 that contains the fix for this issue. Will there be a [security advisory](https://nextcloud.com/security/advisories/) for this issue?
- **Report Resolved**
- **2020-10-06** @nickvergessen: Disclosure planned for 1st November

https://nextcloud.com/security/advisory/?id=NC-SA-2020-041
https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-8159
- **2020-10-06** @nickvergessen: @yahe do you still not want bounties?
- **2020-10-06** @weizenspreu: As said, merch would be welcome. :)
- **2020-10-06** @weizenspreu: Concerning the crediting in the advisory:

Name: Kevin "Kenny" Niehage
E-Mail: kenny@syseleven.de
Website: https://www.syseleven.de/
Company: SysEleven GmbH
- **2020-10-07** @weizenspreu: [CVE-2020-8159](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-8159) is already taken. Maybe that's just a typo.
- **2020-10-07** @nickvergessen: Right, it's https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-8259
- **2020-11-05** @weizenspreu: Good morning. Do you already know when the CVE and NC-SA will be published?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Not Eligible For Bounty**
