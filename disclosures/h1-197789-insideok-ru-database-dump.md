---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2018-04-25
submitted: 2017-01-12T10:34:47.707Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/ok|ok.ru]]"
reporter: "bigbear_"
source: "https://hackerone.com/reports/197789"
title: "[insideok.ru] Database Dump"
---
# [insideok.ru] Database Dump

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** ok.ru | **Disclosed:** 2018-04-25

- Report: [https://hackerone.com/reports/197789](https://hackerone.com/reports/197789)
- CWE: Improper Authentication - Generic
- Submitted: 2017-01-12T10:34:47.707Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

http://insideok.ru/db.sql

Внутри - учётки админов на 2016 год.

-- Хост: localhost
-- Время создания: Сен 03 2016 г., 12:00
-- Версия сервера: 5.5.47-cll-lve
-- Версия PHP: 5.4.45


# Структура таблицы `users`

`CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL,
  █████
  ███████
  ███████
██████████
███
██████████
███
█████████
███████
████████
█████
█████
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=5461;`


# Дамп данных таблицы users

`INSERT INTO `users` (██████████) VALUES
████
███
████████
███
████
███████
████████
███████
█████
███
███
████████
███████
███████
████████
██████
████████
████
███`

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **2017-01-19** @bigbear_: Вам спасибо.
Часть других тоже уже починили. Я проверил)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
