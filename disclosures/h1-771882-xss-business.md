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
date: 2020-01-17
submitted: 2020-01-10T19:21:16.117Z
bounty_usd: null
votes: 36
cve: []
program: "[[programs/drive_net_inc|DRIVE.NET, Inc.]]"
reporter: "konqi"
source: "https://hackerone.com/reports/771882"
title: "Хранимый XSS в Business-аккаунте, на странице компании"
---
# Хранимый XSS в Business-аккаунте, на странице компании

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 36 | **Program:** DRIVE.NET, Inc. | **Disclosed:** 2020-01-17

- Report: [https://hackerone.com/reports/771882](https://hackerone.com/reports/771882)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-01-10T19:21:16.117Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-01-10** @onyxmaster: Проблема, описанная вами исправлена (пока временным образом), уязвимость была в генерации кода для показа карты.
Мы идентифицировали ещё несколько мест, где такая проблема возможна и запланировали на следующую неделю аудит и исправление таких проблем.
Вы предпочтёте чтобы мы закрыли кейс как resolved, и вы могли бы подтвердить это или опровергнуть, или хотите подождать нашего отчёта о том, что ещё мы сделали в рамках этой задачи (займёт 5-10 дней)?
- **2020-01-10** @konqi: Быстро однако, молодцы :)

Могу подтвердить, что уязвимость больше не воспроизводится. Я думаю можно закрыть как resolved.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-01-16** @onyxmaster: Здравствуйте. Не могу сказать что закончили, но нашли некоторое количество. По поводу публичности не возражаю никак. Дополнение -- у H1 видимо что-то сломалось, потому что нажатие на "Disclosure pending" показывает диалог, который ничего не делает =)
- **Agreed On Going Public**
- **Report Became Public**
