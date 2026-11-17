---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2018-10-07
submitted: 2018-05-27T00:46:59.723Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/bumble|Bumble]]"
reporter: "jarvis0x1"
source: "https://hackerone.com/reports/358007"
title: "Compromising the user ID"
---
# Compromising the user ID

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Bumble | **Disclosed:** 2018-10-07

- Report: [https://hackerone.com/reports/358007](https://hackerone.com/reports/358007)
- CWE: Information Disclosure
- Submitted: 2018-05-27T00:46:59.723Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2018-07-06** @jarvis0x1: Сегодня понял то, как можно было более серьезно использовать данную уязвимость. Я описал процесс простого перехвата полученных запросов, когда лайкал определенного пользователя. Вот что можно было сделать:
1. Зарегистрировать и верифицировать еще один аккаунт.
2. Проставить 600 лайков автоматизированно
3. В запрос на голосование за пользователя передавать нужный айдишник, найденный через основной аккаунт и получать его расшифрованный ID
4. Сделать это как отдельный сайт-сервис

Какие плюсы? Не нужно пропускать несколько сотен пользователей. Можно определять ID стримеров. Уязвимость намного серьезнее чем описывал ранее.
- **2018-09-01** @jarvis0x1: Привет! Прошло 3 месяца, раскроем репорт?
- **Agreed On Going Public**
- **Report Became Public**
