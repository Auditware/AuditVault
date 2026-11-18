---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-01-25
submitted: 2019-01-27T21:25:51.237Z
bounty_usd: null
votes: 340
cve: []
program: "[[programs/flickr|Flickr]]"
reporter: "asad0x01_"
source: "https://hackerone.com/reports/487008"
title: "Arbitrary file read via ffmpeg HLS parser at https://www.flickr.com/photos/upload"
---
# Arbitrary file read via ffmpeg HLS parser at https://www.flickr.com/photos/upload

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 340 | **Program:** Flickr | **Disclosed:** 2020-01-25

- Report: [https://hackerone.com/reports/487008](https://hackerone.com/reports/487008)
- CWE: Code Injection
- Submitted: 2019-01-27T21:25:51.237Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary: FFmpeg is a video and audio software that is used for generating previews and for converting videos. Your current installation allows HLS playlists that contain references to external files, which leads to local file disclosure.


Steps to Reproduce:
1.Download the attached file. {F413554}

2.Go to https://www.flickr.com/photos/upload/ and upload the attached file.

3.Now go to https://www.flickr.com/cameraroll and you should be able to see contents of /etc/passwd. {F413555}
For clear view open the video from **Photostream** section.

Please let me know if you need any help :)

## Impact

An attacker can read files of etc/passwd or other contents.Also what I've seen it is possible to escalate this vulnerability to SSRF(https://www.blackhat.com/docs/us-16/materials/us-16-Ermishkin-Viral-Video-Exploiting-Ssrf-In-Video-Converters.pdf).Since I don't have any server I couldn't test :(

## Timeline

- **Report Filed**
- **2019-01-27** @h1_analyst_decimo: Thank you for reporting this potential issue, @asad0x01_.

Your report is currently being examined by the HackerOne triage team. You will receive further details, or questions, as soon as technically possible. Thanks for your patience.

Cheers,
@still
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2019-01-27** @asad0x01_: Thank you so much @still .This one escalated quickly :)
- **2019-01-27** @h1_analyst_decimo: Nevermind, confirmed
- **2019-01-27** @asad0x01_: Sure.Please wait :)
- **2019-01-27** @asad0x01_: Do I need to provide the file to dump /etc/hostname?
- **2019-01-27** @h1_analyst_decimo: @asad0x01_: no, thank you—I was able to confirm that myself. Please stand by.
- **Report Title Updated**
- **2019-01-27** @asad0x01_: Awesome :D Thank you so much for your prompt reply.
- **Bounty Awarded**
- **2019-01-28** @asad0x01_: Thank you so much for the bounty :D
- **2019-01-31** @alexseville: @asad0x01_ can you confirm whether the vulnerability still exists now?
- **2019-02-01** @asad0x01_: Hi @alexseville,
I can confirm the issue is fixed :)
Regards,
Asad
- **2019-02-16** @asad0x01_: Hi @alexseville, 
Please close the issue as resolved :)
Thanks,
Asad
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
