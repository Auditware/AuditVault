---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authorization
  - env/web
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
date: 2021-10-21
submitted: 2021-02-12T20:02:18.541Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "sandeep_rj49"
source: "https://hackerone.com/reports/1102365"
title: "[dubmash] Lack of authorization checks - Update Sound Titles"
---
# [dubmash] Lack of authorization checks - Update Sound Titles

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Reddit | **Disclosed:** 2021-10-21

- Report: [https://hackerone.com/reports/1102365](https://hackerone.com/reports/1102365)
- CWE: Improper Authorization
- Submitted: 2021-02-12T20:02:18.541Z

## Timeline

- **Report Filed**
- **2021-02-12** @sandeep_rj49: Request disclosing sound track UUID:
```
curl -i -s -k -X $'POST' \
    -H $'Host: gateway-production.dubsmash.com' -H $'X-Dmac: a252a66f19e030696d2b70ae2cff527b32e9add33475af6ab192595017f6b4ea' -H $'X-Remote-Config-Values: []' -H $'X-Time: 1613160805' -H $'User-Agent: Dopesmash/5.20.0 (com.mobilemotion.dubsmash; build:45431; iOS 14.0.1) Alamofire/5.4.0' -H $'X-Accept-Content-Language: en_IN' -H $'X-Device-Timezone: 19800' -H $'X-Device-Language: en' -H $'X-Device-Country: IN' -H $'X-Build-Number: 45431' -H $'Content-Length: 1065' -H $'X-App-Version: 5.20.0' -H $'X-Platform: ios' -H $'Connection: close' -H $'Authorization: Bearer xxxxxxxxx' -H $'X-Dubsmash-Device-Id: 0675382B-668E-4EB7-8313-ED96BC132DC9' -H $'Accept-Language: en-IN;q=1.0, hi-IN;q=0.9' -H $'Accept: application/json' -H $'Content-Type: application/json' -H $'X-Dmac-Version: 2' -H $'If-None-Match: W/\"7d-SQTt6RA1iQk+sK3Hcqc774a67/I\"' \
    -b $'__cfduid=d42d0391d8f2c2d8bf5107a6ceda7c2f61610738889' \
    --data-binary $'{\"variables\":{\"next\":null},\"query\":\"query RecommendedRichSounds($next: String) {\\n  recommendations(next: $next, type: SOUND) {\\n    __typename\\n    next\\n    results {\\n      __typename\\n      recommendation_identifier\\n      score\\n      updated_at\\n      object {\\n        __typename\\n        ... on Sound {\\n          ...RichSoundFragment\\n        }\\n      }\\n    }\\n  }\\n}\\nfragment RichSoundFragment on Sound {\\n  __typename\\n  uuid\\n  created_at\\n  sound\\n  name\\n  waveform_raw_data\\n  liked\\n  soundStatus: status\\n  creator {\\n    __typename\\n    ...ContentCreatorFragment\\n  }\\n  share_link\\n  num_likes\\n  num_videos\\n  top_videos {\\n    __typename\\n    ...TopVideoFragment\\n  }\\n}\\nfragment ContentCreatorFragment on User {\\n  __typename\\n  username\\n  uuid\\n  date_joined\\n  followed\\n  has_invite_badge\\n  badges\\n  profile_picture\\n}\\nfragment TopVideoFragment on Video {\\n  __typename\\n  uuid\\n  video_data {\\n    __typename\\n    mobile {\\n      __typename\\n      thumbnail\\n    }\\n  }\\n  creator {\\n    __typename\\n    uuid\\n    username\\n  }\\n}\"}' \
    $'https://gateway-production.dubsmash.com/graphql?build_number=45431&platform=ios'
```

Impact:
if an attacker change the titles of all sound tracks using an automated scripting by exploiting this vulnerability then the malicious string will appear as the title of all the sound tracks. The sound track are visible to the users when posting a video on dubsmash, so if name is changed of all the sound tracks then its difficult for the users to identify the right tracks from the dubsmash sound library. Also, if keyworks like `hack`, `accounthack`, `dubsmashhack` is used for titles for all sound tracks by exploiting this vulnerability then this will leave a negative impression on the users.
- **Report Needs More Info**
- **Report New**
- **2021-02-22** @gunther_reddit: Thanks for the quick response @sandeepk09 . Looking at that video, it looks like the objects being modified have a consistent user (`xacheeenn`). I was expecting to see a different login or auth bearer token swapout to show a user other than `xacheeenn` was able to modify the object. The uuid is expected to be there for the GQL query, but if User A can modify User B's objects, then we'd have a problem.
- **2021-02-22** @sandeep_rj49: Yes, `xacheeenn` is a different user(not the logged-in user). We can also try this on your testing accounts. Please share your testing account username.
- **Report Title Updated**
- **2021-02-22** @sandeep_rj49: Hope this video poc helps :)
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2021-02-24** @sandeep_rj49: hi @gunther_reddit sir,

I hope you are well and good :)

i think the vulnerability severity should be `High` (as per cvss score and vectors). As an attacker can change all sound titles of the dubsmash. Even the one which are appearing in `add sound` option (pfa screenshot) when uploading the videos
- **2021-02-24** @sandeep_rj49: All sound titles can be changed by writing an automated python script. 

Algorithm of python script for exploiting this vulnerability on a larger scale:
1. fetch all sound tracks uuid.
2. Input sound track uuid in the vulnerable request.
3. Replay the vulnerable request with each uuid. Sound track title will be changed.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2021-03-06** @sandeep_rj49: thanks for the bounty sir @gunther_reddit :)
- **Agreed On Going Public**
- **2021-07-21** @sandeep_rj49: @gunther_reddit  can we disclose this to the community for learning purposes?
- **Agreed On Going Public**
- **Report Became Public**
