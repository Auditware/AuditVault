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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Users who upload HEIC/HEIF files (sometimes called "Live Photos")  to reddit.com or old.reddit.com expect their GPS metadata to be stripped before being displayed publicly. Uploaded HEIC files are converted to PNG, but GPS metadata is incorrectly preserved, in violation of user privacy. The problem is likely device- and browser-agnostic, and mostly affects Safari users on Mac since other devices and browsers either automatically convert to a different format or do not permit HEIC files to be uploaded through the usual user flow.

## Impact:
All users who have submitted HEIC files have their GPS locations exposed publicly, which can be scraped with little detection and no authorization.

## Steps To Reproduce:

1. Take a Live photo on an iPhone 11 Pro with GPS location tagging enabled
2. Sync the photo to iCloud Photos
3. Upload HEIF/HEIC file to Reddit.com via Safari on macOS Big Sur (Example F1138749)
4. Submit post to any community
5. Visit the post and click the link to get to the https://i.redd.it/FILENAME.png file
6. Download the file

## Supporting Material/References:

Expected behavior is no GPS metadata, but you can see that **the metadata is present in these examples**:
* https://i.redd.it/s7vjzg05w6861.png (Safari)
* https://i.redd.it/6wnf9cf637861.png (Safari)
* https://i.redd.it/d1zqv32297861.png (Safari)
* https://i.redd.it/8ytwrr5re7861.png (IE)

{F1138750}

I was also able to reproduce this flow through Internet Explorer on Windows 10 (but not Edge), which means the issue is **likely device- and browser-agnostic.**

However, when I tested the following flows, I found that **GPS metadata was correctly removed for**:
* Reddit iOS app on iPhone
* Safari on iPad (local testing shows iOS converts it to a JPEG before uploading)

For some tests, **I wasn't able to upload HEIC photos at all**:

* Chrome and Firefox on Mac (HEIC not supported by image/* MIME filter on accept attribute)
* Chrome, Firefox, and Edge on Windows (Windows does not recognize HEIC as an image file)
* Safari on iPhone (no option to upload photos on mobile view)
* Safari on Mac after having changed the file extension from .HEIC to .PNG (not actually changing the file otherwise)

It seems likely that **only Safari for Mac and Internet Explorer** allow HEIC files to be uploaded directly to Reddit. All other methods I've tried seem to result in normal metadata scrubbing.

**I was able to find location data for at least one other user in the wild:** https://i.redd.it/1hn2uafmwu661.png ([post](https://www.reddit.com/r/BotanicalPorn/comments/kil6om/prunus_mume_buds_encased_in_ice_oc/)). Downloading this image, I can see their GPS location:

{F1138751}

**I originally discovered this when spot-checking an image** that I uploaded yesterday. The post can be found [here](https://www.reddit.com/r/flying/comments/kmm32s/i_made_a_checklist_for_my_car_can_you_tell_it_was/), and the image was [here](https://i.redd.it/5oe2cj40q6861.png). I have since deleted the image.

## Impact

All users who have submitted HEIC files have their GPS locations exposed publicly, which can be scraped with little detection and no authorization.

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
