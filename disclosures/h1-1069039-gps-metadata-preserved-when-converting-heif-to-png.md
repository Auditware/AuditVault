---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/web
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
date: 2021-10-21
submitted: 2020-12-30T23:35:39.575Z
bounty_usd: null
votes: 67
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "ianonavy"
source: "https://hackerone.com/reports/1069039"
title: "GPS metadata preserved when converting HEIF to PNG"
---
# GPS metadata preserved when converting HEIF to PNG

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 67 | **Program:** Reddit | **Disclosed:** 2021-10-21

- Report: [https://hackerone.com/reports/1069039](https://hackerone.com/reports/1069039)
- CWE: Privacy Violation
- Submitted: 2020-12-30T23:35:39.575Z

## Timeline

- **Report Filed**
- **2020-12-30** @ianonavy: I took a guess at the severity since it does involve a "bulk compromise of user data", but only a subset. It didn't fit cleanly with any of the examples provided, the CVSS V3 calculation suggested Critical.
- **Report Triaged**
- **2020-12-31** @gunther_reddit: No worries. We'll want to look at the image and volume here to help influence the severity which we'll do once we've got a grips on this. Initial look is that our version of PIL in our old monolith is too old to recognize the exifdata in HEIC turned PNG files and so it just skips those chunks that it doesn't understand and writes them to the file. This'll be a fun one for us to fix
- **2020-12-31** @ianonavy: I tried `Image.open` on the test file F1138811 (which I forgot to attach to the initial report) with `Pillow==6.2.2` all the way down to 2.9.0, and I can't even get it to recognize it as an image file. I'm reading the [archive of r2 on GitHub](https://github.com/reddit-archive/reddit/blob/753b17407e9a9dca09558526805922de24133d53/r2/r2/lib/media.py#L278), and it looks like it shouldn't recognize HEIC files at all and [early exit](https://github.com/reddit-archive/reddit/blob/753b17407e9a9dca09558526805922de24133d53/r2/r2/controllers/api.py#L2648). What version of PIL are you using? Is there newer (non-public) code that specifically handles HEIC? I would expect GPS metadata to be stripped by optipng (`optimize_png`).
- **2020-12-31** @gunther_reddit: Yeah reddit-public uses an allowlist of filetypes (which is why uploading a HEIC directly doesn't work). But a HEIC converted to a PNG retains some exif data chunks that our version of PIL (3.3.0 with some backported patches) doesn't recognize. We were erroneously assuming if the Image object throws an AttribteError with `._getexif()` that it has no exif data, so our exif stripping logic never happened. 

```python
def _get_exif_tags(image):
    try:
        exif_tags = image._getexif() or {}
    except AttributeError:
        # Image format with no EXIF tags
        return None
    except (IndexError, SyntaxError, TypeError, ValueError):
        # Bad EXIF data
        return False

    return exif_tags
```

We're rustling up some devs to get consensus on how we want to address this bug both going forward and retroactively.
- **2021-01-05** @gunther_reddit: FYI a fix to stop the bug was deployed on Dec30 which prevents this issue from continuing. Post mortem continues for existing PNG files that are already stored, so leaving this open until the backfill has run to strip remaining exif data
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-01-05** @ianonavy: Retested, and confirmed on my end for fix moving forward. https://i.redd.it/zsw5pzckil961.png Thanks for the bounty! I understand this program is private--once resolved, what rules should I keep in mind if I do a write-up (if I can do one at all)? This is my first bug bounty.
- **2021-01-06** @ianonavy: More specifically regarding "Don't publicly disclose a vulnerability. Reddit’s bug bounty program is private -- public disclosure isn’t available." Am I permitted to disclose that I found a vulnerability and the nature of the bug? Obviously without disclosing that I found it via reddit. I can also clean out all the tests posts that I created.
- **2021-01-06** @gunther_reddit: So per policy we don't allow disclosure. If you remove references to Reddit and private bug bount / payout amount, it might be permitted. We'd like to reserve editorial rights on what you publish, so if you want to drop a note into security@reddit.com with the blog content, we can let you know if we're cool with it or not.
- **2021-01-06** @ianonavy: Great, thanks! It might be a while, and I may decide not to publish at all. Regardless, it's good to know the next should I decide to do so. Cheers :)
- **2021-01-06** @gunther_reddit: Yeah no worries, just let us know. Otherwise we'll have to Liam Neeson Taken you...
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
