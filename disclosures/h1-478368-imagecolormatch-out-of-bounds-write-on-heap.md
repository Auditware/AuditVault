---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
body: true
date: 2020-10-10
submitted: 2019-01-12T00:46:15.849Z
bounty_usd: 1500
votes: 4
cve: "CVE-2019-6977"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/478368"
title: "imagecolormatch Out Of Bounds Write on Heap "
---
# imagecolormatch Out Of Bounds Write on Heap 

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 4 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-10

- Report: [https://hackerone.com/reports/478368](https://hackerone.com/reports/478368)
- CWE: Memory Corruption - Generic | CVE: CVE-2019-6977
- Submitted: 2019-01-12T00:46:15.849Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The link to the PHP bug: https://bugs.php.net/bug.php?id=77270

This is possible to exploit in PHP 7.0.33 and 5.6.39. I used this vulnerability to write a local safe mode bypass exploit.

It is possible to write up to 1200 bytes over the boundaries of a buffer allocated in the imagecolormatch function, which then calls gdImageColorMatch()

The function takes two gdImagePtr as arguments and wants to compare both of them. It then allocates a dynamic buffer with the following calculation:

`buf = (unsigned long *)safe_emalloc(sizeof(unsigned long), 5 * im2->colorsTotal, 0);`

im2->colorsTotal is under the control of an attacker. By simply allocating only one color to the second image, the calculation becomes sizeof(unsigned long) (8 byte on a 64 bit system) * 5 * 1, which results in a buffer of 40 bytes.

```
The buffer is then written to in a for loop.
	for (x=0; x<im1->sx; x++) {
		for( y=0; y<im1->sy; y++ ) {
			color = im2->pixels[y][x];
			rgb = im1->tpixels[y][x];
			bp = buf + (color * 5);
			(*(bp++))++;
			*(bp++) += gdTrueColorGetRed(rgb);
			*(bp++) += gdTrueColorGetGreen(rgb);
			*(bp++) += gdTrueColorGetBlue(rgb);
			*(bp++) += gdTrueColorGetAlpha(rgb);
		}

The buffer is written to by means of a color being the index:
color = im2->pixels[y][x];
..
bp = buf + (color * 5);
```

However, an attacker can set the value of color to be at maximum 255 (since it is a char). This would result in bp pointing at buffer + 1275 bytes. Since buffer is only 40 bytes big, this leads to an out of bounds write with data that is also under the control of the attacker.

PoC PHP script:

```
$img1 = imagecreatetruecolor(0xfff, 0xfff);
$img2 = imagecreate(0xfff, 0xfff);
imagecolorallocate($img2, 0, 0, 0);
imagesetpixel($img2, 0, 0, 255);
imagecolormatch($img1, $img2);
```

## Impact

This vulnerability allows attackers to bypass local security restrictions such as disabled functions.

## Timeline

- **Report Filed**
- **2019-01-18** @h1_analyst_leon: Hey @simonscannell - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **2019-01-27** @simonscannell: Hi, this vulnerability has been assigned CVE-2019-6977. 

https://nvd.nist.gov/vuln/detail/CVE-2019-6977
- **2019-03-03** @simonscannell: Just wanted to add here, that somebody wrote an exploit for this:

https://github.com/cfreal/exploits/tree/master/CVE-2019-6977-imagecolormatch

Is there an update on this?
- **2019-05-10** @simonscannell: The following exploit is one I have written that allows to bypass disable_functions: https://github.com/scannells/exploits/blob/master/CVE-2019-6977%20imagecolormatch.php

Please let me know what happens to this ticket.
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2019-05-19** @simonscannell: Hi @tuxedo, thank you for triaging!
- **2019-08-13** @simonscannell: It's been 3 months since triaging so I just wanted to ask if this program is still active.
- **Hacker Requested Mediation**
- **2020-01-22** @h1_analyst_leon: Hi @simonscannell - Unfortunately, I do not have any updates for you at this time, but you will be updated as soon as there is additional information to share. Thanks for your patience!
- **2020-03-07** @simonscannell: Could you give me some Insights as to how this Program works? Do you pay out bounties at certain times in a year? Who is behind it?

Thank you very much!
- **2020-03-11** @h1_analyst_leon: Hey @simonscannell - This program is volunteer-run, and bounties are awarded after the reports are reviewed by the PHP (IBB) team. More information on the IBB can be found at https://internetbugbounty.org/.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-10** @simonscannell: Thank you so much!
- **Agreed On Going Public**
- **Report Became Public**
