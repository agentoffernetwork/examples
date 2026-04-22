# Part B (Partner -> AON) Postback HMAC-SHA256 Signing Test Vectors

> Reference vectors for Partner implementations of Partner -> AON postback
> request signing. Every vector below was produced by the Node.js and shell
> scripts shown in the appendix; Partners can reproduce them byte-for-byte
> to self-test their signing implementation.
>
> See [`protocol/specs/postback.md`](../../../protocol/specs/postback.md)
> for the normative signing rules.

## Common Inputs

| Field | Value |
|------:|:------|
| Signing algorithm | HMAC-SHA256, lowercase hex encoding |
| Secret | `partner-postback-secret-demo` |
| HTTP method | `POST` |
| HTTP path | `/v1/postback` |
| Canonical body (exact bytes) | `{"event_id":"evt_pb_NWS66E195DM66YEK30HJKSVVYN","event_type":"conversion","tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","conversion_id":"partner_conv_98765","timestamp":"2026-03-21T03:10:00Z","conversion_type":"sale","amount":120,"bid":24,"currency":"USD","sub_id_1":"homepage_widget","coupon_code":"SPRING2026"}` |

## Signing String Construction

The signing string is formed by joining five components with a single LF
(`\n`, U+000A) character, in this exact order:

```
METHOD        + "\n"
PATH          + "\n"
CANONICAL_BODY + "\n"
TIMESTAMP     + "\n"
NONCE
```

No trailing newline. No whitespace insertion. The body MUST be the exact
bytes the Partner transmits on the wire -- Partner MUST NOT re-serialize or
re-sort keys after computing the signature.

> Shares signature mechanics with [offer-provider-api.md S4](../../../protocol/specs/offer-provider-api.md#4-authentication).

## Test Vectors

### Case 1 -- Valid request (expected: `200 SUCCESS`)

| Header | Value |
|-------:|:------|
| `X-AON-Key` | `partner-appkey-demo` |
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `c3d4e5f6-a7b8-9012-cdef-123456789012` |
| `X-AON-Signature` | `5d6f95e2bf4a2a78f92497c6ec14bf45b50749ebe8d7bbe30e858c28765aded5` |

AON MUST accept this request when the timestamp is within +/-5 minutes of
server time and the nonce has not been seen in the last 5 minutes.

### Case 2 -- Tampered signature (expected: `401 UNAUTHORIZED`)

Same inputs as Case 1, but with a deliberately wrong signature:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `c3d4e5f6-a7b8-9012-cdef-123456789012` |
| `X-AON-Signature` | `deadbeef0badc0ffee0123456789abcdef0123456789abcdef0123456789abcd` |

AON MUST compute the expected signature, compare in constant time, and
reject with:

```json
{ "code": "UNAUTHORIZED", "message": "invalid signature", "data": {}, "extra": {} }
```

### Case 3 -- Expired timestamp (expected: `401 UNAUTHORIZED`)

The signature below is correctly computed for the inputs shown, but the
timestamp (`1776100000`, roughly 4 days before Case 1) falls outside the
mandatory +/-5-minute window:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776100000` |
| `X-AON-Nonce` | `d4e5f6a7-b8c9-0123-defa-234567890123` |
| `X-AON-Signature` | `2cc25a4b736a8c4c9bf6d0e2e022f7785d45c19101495ab5aedc83253ff9ef11` |

AON MUST reject before even attempting signature verification once the
timestamp falls outside the allowed skew. Recommended error body:

```json
{ "code": "UNAUTHORIZED", "message": "timestamp outside allowed skew", "data": {}, "extra": {} }
```

### Case 4 -- Replayed nonce (expected: `401 UNAUTHORIZED` on the 2nd request)

First send Case 1 (accepted). Then, within 5 minutes, send the request
below which re-uses the same nonce with a fresh timestamp and a fresh
signature:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776450800` |
| `X-AON-Nonce` | `c3d4e5f6-a7b8-9012-cdef-123456789012` |
| `X-AON-Signature` | `36604e822875ba0ba53d60e3cf6d5b6e3e271dd4361722babd3ec469edf2cc15` |

AON MUST reject the second request because the nonce has been used within
the 5-minute replay window:

```json
{ "code": "UNAUTHORIZED", "message": "nonce already used", "data": {}, "extra": {} }
```

## Appendix -- Reproducing the Vectors

```bash
node -e '
const c = require("crypto");
const secret = "partner-postback-secret-demo";
const body = `{"event_id":"evt_pb_NWS66E195DM66YEK30HJKSVVYN","event_type":"conversion","tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","conversion_id":"partner_conv_98765","timestamp":"2026-03-21T03:10:00Z","conversion_type":"sale","amount":120,"bid":24,"currency":"USD","sub_id_1":"homepage_widget","coupon_code":"SPRING2026"}`;
function sign(ts, nonce) {
  const s = `POST\n/v1/postback\n${body}\n${ts}\n${nonce}`;
  return c.createHmac("sha256", secret).update(s, "utf8").digest("hex");
}
console.log("Case 1:", sign("1776450600", "c3d4e5f6-a7b8-9012-cdef-123456789012"));
console.log("Case 3:", sign("1776100000", "d4e5f6a7-b8c9-0123-defa-234567890123"));
console.log("Case 4:", sign("1776450800", "c3d4e5f6-a7b8-9012-cdef-123456789012"));
'
```

The same computation in pure shell, when `openssl` is available:

```bash
printf 'POST\n/v1/postback\n%s\n%s\n%s' \
  '{"event_id":"evt_pb_NWS66E195DM66YEK30HJKSVVYN","event_type":"conversion","tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","conversion_id":"partner_conv_98765","timestamp":"2026-03-21T03:10:00Z","conversion_type":"sale","amount":120,"bid":24,"currency":"USD","sub_id_1":"homepage_widget","coupon_code":"SPRING2026"}' \
  1776450600 \
  c3d4e5f6-a7b8-9012-cdef-123456789012 \
  | openssl dgst -sha256 -hmac "partner-postback-secret-demo" -hex
```

Both commands yield `5d6f95e2...5aded5` for Case 1.
