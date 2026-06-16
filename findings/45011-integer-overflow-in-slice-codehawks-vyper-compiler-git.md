---
tags:
  - lang/solidity
  - lang/vyper
  - platform/codehawks
  - has/poc
  - severity/high
  - novelty/known-pattern
  - sector/infra
protocol: "[[Vyper]]"
auditors:
  - "[[obront]]"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# integer overflow in slice()

- id: 45011
- impact: HIGH
- protocol: [[Vyper]] - Compiler
- reporter: obront (Codehawks)
- source: N/A

## Summary


The report is about a bug in the slice() function that can cause memory corruption. This bug occurs when a variable called x is used to determine the length of a Bytes[256] object. Due to an integer overflow, the length of this object will be written to a very large number, causing potential memory corruption when the object is accessed. The root cause of this bug is in line 348 of the code, where an integer overflow can bypass an assert statement and write the wrong length to the object. This bug has a medium risk impact and the recommendation is to fix the integer overflow in the code.

## Details

## Summary
There is an integer overflow in the slice() code, which will cause memory corruption.

## Vulnerability Details
POC:

	d: public(Bytes[256])
		
	@external
	def test():
		x : uint256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935 # 2**256-1
		self.d = b"\x01\x02\x03\x04\x05\x06"
		# s : Bytes[256] = slice(self.d, 1, x)
		assert len(slice(self.d, 1, x))==115792089237316195423570985008687907853269984665640564039457584007913129639935

Since x is a variable, slice(self.d, 1, x) will return a Bytes[256] object. However, due to an integer overflow, the length of this Bytes[256] object will be written to 2**256-1, and accessing this object may cause memory corruption.

ROOT CAUSE:

line 348 in vyper/builtins/functions.py

    @process_inputs
    def build_IR(self, expr, args, kwargs, context):
        src, start, length = args

        # Handle `msg.data`, `self.code`, and `<address>.code`
        if src.value in ADHOC_SLICE_NODE_MACROS:
            return _build_adhoc_slice_node(src, start, length, context)

        is_bytes32 = src.typ == BYTES32_T
        if src.location is None:
            # it's not a pointer; force it to be one since
            # copy_bytes works on pointers.
            assert is_bytes32, src
            src = ensure_in_memory(src, context)

        with src.cache_when_complex("src") as (b1, src), start.cache_when_complex("start") as (
            b2,
            start,
        ), length.cache_when_complex("length") as (b3, length):
            if is_bytes32:
                src_maxlen = 32
            else:
                src_maxlen = src.typ.maxlen

            dst_maxlen = length.value if length.is_literal else src_maxlen

            buflen = dst_maxlen

            # add 32 bytes to the buffer size bc word access might
            # be unaligned (see below)
            if src.location == STORAGE:
                buflen += 32

            # Get returntype string or bytes
            assert isinstance(src.typ, _BytestringT) or is_bytes32
            # TODO: try to get dst_typ from semantic analysis
            if isinstance(src.typ, StringT):
                dst_typ = StringT(dst_maxlen)
            else:
                dst_typ = BytesT(dst_maxlen)

            # allocate a buffer for the return value
            buf = context.new_internal_variable(BytesT(buflen))
            # assign it the correct return type.
            # (note mismatch between dst_maxlen and buflen)
            dst = IRnode.from_list(buf, typ=dst_typ, location=MEMORY)

            dst_data = bytes_data_ptr(dst)

            if is_bytes32:
                src_len = 32
                src_data = src
            else:
                src_len = get_bytearray_length(src)
                src_data = bytes_data_ptr(src)

            # general case. byte-for-byte copy
            if src.location == STORAGE:
                # because slice uses byte-addressing but storage
                # is word-aligned, this algorithm starts at some number
                # of bytes before the data section starts, and might copy
                # an extra word. the pseudocode is:
                #   dst_data = dst + 32
                #   copy_dst = dst_data - start % 32
                #   src_data = src + 32
                #   copy_src = src_data + (start - start % 32) / 32
                #            = src_data + (start // 32)
                #   copy_bytes(copy_dst, copy_src, length)
                #   //set length AFTER copy because the length word has been clobbered!
                #   mstore(src, length)

                # start at the first word-aligned address before `start`
                # e.g. start == byte 7 -> we start copying from byte 0
                #      start == byte 32 -> we start copying from byte 32
                copy_src = IRnode.from_list(
                    ["add", src_data, ["div", start, 32]], location=src.location
                )

                # e.g. start == byte 0 -> we copy to dst_data + 0
                #      start == byte 7 -> we copy to dst_data - 7
                #      start == byte 33 -> we copy to dst_data - 1
                copy_dst = IRnode.from_list(
                    ["sub", dst_data, ["mod", start, 32]], location=dst.location
                )

                # len + (32 if start % 32 > 0 else 0)
                copy_len = ["add", length, ["mul", 32, ["iszero", ["iszero", ["mod", start, 32]]]]]
                copy_maxlen = buflen

            else:
                # all other address spaces (mem, calldata, code) we have
                # byte-aligned access so we can just do the easy thing,
                # memcopy(dst_data, src_data + dst_data)

                copy_src = add_ofst(src_data, start)
                copy_dst = dst_data
                copy_len = length
                copy_maxlen = buflen

            do_copy = copy_bytes(copy_dst, copy_src, copy_len, copy_maxlen)

            ret = [
                "seq",
                # make sure we don't overrun the source buffer
                ["assert", ["le", ["add", start, length], src_len]],  # bounds check  #BUG CODE IS HERE start + length might overflow
                do_copy,
                ["mstore", dst, length],  # set length
                dst,  # return pointer to dst
            ]
            ret = IRnode.from_list(ret, typ=dst_typ, location=MEMORY)
            return b1.resolve(b2.resolve(b3.resolve(ret)))


["assert", ["le", ["add", start, length], src_len]] may have integer overflow, bypassing the assert here, and finally writing the wrong length to dst.

## Impact

Medium Risk

## Recommendations

Fix integer overflow here
