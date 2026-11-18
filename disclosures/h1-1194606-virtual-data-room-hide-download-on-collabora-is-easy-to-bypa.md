---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-08-07
submitted: 2021-05-12T18:27:06.135Z
bounty_usd: 150
votes: 14
cve: "CVE-2021-32748"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rtod"
source: "https://hackerone.com/reports/1194606"
title: "Virtual Data Room / Hide download on collabora is easy to bypass"
---
# Virtual Data Room / Hide download on collabora is easy to bypass

> **Severity:** High | **Bounty:** 150 USD | **Votes:** 14 | **Program:** Nextcloud | **Disclosed:** 2021-08-07

- Report: [https://hackerone.com/reports/1194606](https://hackerone.com/reports/1194606)
- CWE: Improper Access Control - Generic | CVE: CVE-2021-32748
- Submitted: 2021-05-12T18:27:06.135Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

So, let me start with saying I'm not sure if this is a security issue or if it is by design. The reason I'm reporting it here is since Nextcloud promotes this Virtual Data Room a lot.

https://nextcloud.com/blog/nextcloud-announces-virtual-data-room-solution-for-ultimate-protection-of-data-during-sensitive-dealmaking/
https://nextcloud.com/virtual-data-room/

And let me just quote: "configure Secure View ensure the users can still read and (when shared with editing rights) modify documents, while the documents are watermarked when on screen."

"With secure view, our online office solutions can be configured to open PDF files, images and text files, making these files available in a watermark-protected way, while downloads and other apps are disabled using File Access Control. This setup is useful when data has to be protected from leaking but still has to be made available for review, as in a virtual data room scenario."

Both of these claims are false. 

Minimal proof of concept.

1. Setup Nextcloud with Collabora
2. Setup sercure view & file access control to disallow the download of the files
3. Share a document, lets say `vdr.odt` by public link and mark as hide download
4. Copy the link

Now the point here is that anybody you send the link will only see the watermarked file. Not being able to download or copy data. And of course making a picture of these things is useless as it shows the watermark.

5. attacker opens their network tab in the developer tools
6. attacker opens the link
7. attacker filters on WOPISRC
8. Attacker finds a link like

```
wss://collabora.server/https%3A%2F%2Fserver%2Findex.php%2Fapps%2Frichdocuments%2Fwopi%2Ffiles%2F1234_abcd%3Faccess_token%3efgh%26access_token_ttl%3D0/ws?WOPISrc=https%3A%2F%2Fserver%2Findex.php%2Fapps%2Frichdocuments%2Fwopi%2Ffiles%2F1234_abcd&compat=/ws
```

As far as I understand the WOPI spec this is us sending the collabora server the WOPI endpoint they have to call. Which in this case is

`https://server/index.php/apps/richdocument/wopi/files/1234_abcd`
The `1234_abcd` seems to be the `fileid` and the `instance id`

And the access token is also there in the url. In this case `efgh`.

Now if an attacker just does the following curl command

```
curl https://server/index.php/apps/richdocument/wopi/files/1234_abcd?access_token=efgh -o stolen.odt
```

You will see that they have the unwatermarked version of the data. This is even easier than copying everything over or making photographs.

## Impact

Your Virtual Data Room is inherently broken. And the claims you make on your website are at best misleading.
However as said I'm not sure if this may be intentional as the feature is called hide download in the UI.

In any case. Maybe a good idea would be to have a secret configured on both collabora and the Nextcloud host. Which gets send. So that in case of hide download a client that doesn't know the secret token can't download the file.

I do not have access to a setup with Only Office. But I believe that to be vulnerable to a similar attack.

## Timeline

- **Report Filed**
- **2021-05-12** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2021-05-17** @rullzer: Thanks a lot for your report.
We filled an internal ticket and will get back to you after our findings.
- **Report Triaged**
- **2021-06-23** @rtod: Did you manage to verify my suggestion with Collabora?
- **2021-06-28** @lukasreschkenc: We unfortunately don't have much updates to share here. I'll ask the product team for the next steps here.
- **2021-06-29** @lukasreschkenc: The product team is in talks with Collabora about adding some potential secret here. In the meantime, they are considering adding an IP check. (https://github.com/nextcloud/richdocuments/pull/1640)
- **2021-06-29** @lukasreschkenc: FYI:

> For further enhancement Collabora suggested that we could make use of the proof key that would already be available instead of a static shared secret, so we could indeed use that to verify that only the configured Collabora instance can perform WOPI requests. https://wopi.readthedocs.io/en/latest/scenarios/proofkeys.html
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Cve Id Added**
- **Report Became Public**
