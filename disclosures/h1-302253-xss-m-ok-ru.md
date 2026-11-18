---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-06-30
submitted: 2018-01-03T22:22:26.486Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/ok|ok.ru]]"
reporter: "circuit"
source: "https://hackerone.com/reports/302253"
title: "Очень жесткая XSS в личных сообщениях m.ok.ru"
---
# Очень жесткая XSS в личных сообщениях m.ok.ru

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 40 | **Program:** ok.ru | **Disclosed:** 2018-06-30

- Report: [https://hackerone.com/reports/302253](https://hackerone.com/reports/302253)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-01-03T22:22:26.486Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Приветствую.

Нашел багу в личных сообщениях в мобильной версии
{F251208}

Что нужно, чтоб заюзать:

1. Переходим в группу https://m.ok.ru/group/54904397693159/market
2. Ищем товар единственный на страничке
{F251213}
3. Переходим на него и нажимаем на кнопку "Связаться с продавцом" (https://m.ok.ru/group/54904397693159/market)
{F251215}
4. Видим алерт.
{F251216}


Нет фильтрации служебных символов тут -
<div class="discus_dialogs_topic emphased tx-ellip">"&gt;<img src="x" onerror="alert()"></div>

## Impact

XSS.

## Timeline

- **Report Filed**
- **2018-01-03** @circuit: https://m.ok.ru/group/53601632321674/product/67644996100234

Еще примерчик:)

{F251225}
- **2018-01-05** @circuit: Я нашел еще одно место, где работает XSS

https://m.ok.ru/dk?st.cmd=forwardReceiver

<div class="discus_dialogs_topic __old emphased tx-ellip">'"&gt;<script>alert(document.cookie);</script></div>

При пересылке
{F251706}
{F251707}
- **Report Triaged**
- **External User Joined**
- **2018-01-25** @circuit: Случайно зашел проверить, увидел фикс :) Можно ставить - resolved, бага исправлена. :)

{F257360}
- **2018-01-25** @otuken: Congrats! @lincoln9932
- **2018-01-25** @circuit: Thank you :) @tanselcetin
- **2018-01-26** @alexandra_ok: Hi! The issue has been resolved, please confirm
- **2018-01-26** @circuit: Да, подтверждаю фикс.
- **2018-01-27** @otuken: Me too confirmed. Vulnerability has been fixed. Nice @lincoln9932
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
