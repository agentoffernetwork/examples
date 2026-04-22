# Part A (AON -> Agent) Postback HMAC-SHA256 Signing Test Vectors

> Reference vectors for Agent developer implementations of AON -> Agent
> postback signature verification. Every vector below was produced by the
> Node.js and shell scripts shown in the appendix; Agent developers can
> reproduce them byte-for-byte to self-test their signature verifier.
>
> See [`protocol/specs/postback.md`](../../../protocol/specs/postback.md)
> for the normative signing rules.

## Common Inputs

| Field | Value |
|------:|:------|
| Signing algorithm | HMAC-SHA256, lowercase hex encoding |
| Secret | `aon-postback-secret-demo-rotate` |
| HTTP method | `POST` |
| HTTP path | `/webhook/aon/postback` |
| Canonical body (exact bytes) | `{"event_id":"evt_pb_75RGRXRYBHPAE5Z1YZBR604KJP","event_type":"conversion","tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","agent_id":"agt_assistant_123","conversion_type":"sale","amount":120,"currency":"USD","bid_amount":24,"sub_id_1":"homepage_widget","sub_id_2":"cohort_a","timestamp":"2026-03-21T03:10:00Z"}` |

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
bytes AON transmitted on the wire -- Agent developers MUST NOT re-serialize
or re-sort keys before hashing.

> Shares signature mechanics with [offer-provider-api.md S4](../../../protocol/specs/offer-provider-api.md#4-authentication).

## Test Vectors

### Case 1 -- Valid request (expected: process the postback)

| Header | Value |
|-------:|:------|
| `X-AON-Key` | `aon-agent-key-demo` |
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `X-AON-Signature` | `26d7befac5f006eec654903de2769c82c651c518ee0eab13ac2adcb78ee7e50b` |

Agent developer MUST verify the signature, confirm the timestamp is within
the +/-5-minute window, and process the conversion event.

### Case 2 -- Tampered signature (expected: reject and discard)

Same inputs as Case 1, but with a deliberately wrong signature:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `X-AON-Signature` | `deadbeef0badc0ffee0123456789abcdef0123456789abcdef0123456789abcd` |

Agent developer MUST compute the expected signature, compare in constant
time, and discard the payload when signatures do not match. Returning a
non-2xx status (e.g. `401`) is RECOMMENDED but any non-2xx triggers AON
retry.

### Case 3 -- Expired timestamp (expected: reject and discard)

The signature below is correctly computed for the inputs shown, but the
timestamp (`1776100000`, roughly 4 days before Case 1) falls outside the
mandatory +/-5-minute window:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776100000` |
| `X-AON-Nonce` | `b2c3d4e5-f6a7-8901-bcde-f12345678901` |
| `X-AON-Signature` | `448f95869e1eff5d564ae68442d3ffb64e2927d86373e155c23d695e3e992127` |

Agent developer MUST reject before even attempting signature verification
once the timestamp falls outside the allowed skew.

## Appendix -- Reproducing the Vectors

```bash
node -e '
const c = require("crypto");
const secret = "aon-postback-secret-demo-rotate";
const body = `{"event_id":"evt_pb_75RGRXRYBHPAE5Z1YZBR604KJP","event_type":"conversion","tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","agent_id":"agt_assistant_123","conversion_type":"sale","amount":120,"currency":"USD","bid_amount":24,"sub_id_1":"homepage_widget","sub_id_2":"cohort_a","timestamp":"2026-03-21T03:10:00Z"}`;
function sign(ts, nonce) {
  const s = `POST\n/webhook/aon/postback\n${body}\n${ts}\n${nonce}`;
  return c.createHmac("sha256", secret).update(s, "utf8").digest("hex");
}
console.log("Case 1:", sign("1776450600", "a1b2c3d4-e5f6-7890-abcd-ef1234567890"));
console.log("Case 3:", sign("1776100000", "b2c3d4e5-f6a7-8901-bcde-f12345678901"));
'
```

The same computation in pure shell, when `openssl` is available:

```bash
printf 'POST\n/webhook/aon/postback\n%s\n%s\n%s' \
  '{"event_id":"evt_pb_75RGRXRYBHPAE5Z1YZBR604KJP","event_type":"conversion","tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","agent_id":"agt_assistant_123","conversion_type":"sale","amount":120,"currency":"USD","bid_amount":24,"sub_id_1":"homepage_widget","sub_id_2":"cohort_a","timestamp":"2026-03-21T03:10:00Z"}' \
  1776450600 \
  a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  | openssl dgst -sha256 -hmac "aon-postback-secret-demo-rotate" -hex
```

Both commands yield `26d7befa...e7e50b` for Case 1.
