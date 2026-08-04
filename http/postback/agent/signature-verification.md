# AON → Agent webhook signing and receiver vectors

> These fixtures define the WS-22-S3 target contract. They are not evidence
> that the current notifier has implemented it.

See [`protocol/specs/postback.md`](../../../protocol/specs/postback.md) for the normative rules.

The machine-readable source for every vector below is
[`postback-agent-webhook-v0.2.json`](../../../../schema/fixtures/postback-agent-webhook-v0.2.json).
Run the repository contract gate from `protocol/github-repos` with:

```bash
bash schema/test/validate-postback.sh
```

It invokes the zero-dependency Python
[`verify-postback-v0.2.py`](../../../../schema/test/verify-postback-v0.2.py)
reference verifier as well as schema validation.

## Fixed inputs

| Field | Value |
|---|---|
| HTTP method | `POST` |
| Origin-form request-target | `/webhook/aon/conversion?source=aon&delivery=conversion` |
| Raw body | `{"event_id":"evt_01J0AONCONVERSION000001","event_type":"conversion","aon_tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","agent_id":"agt_assistant_123","event_name":"subscription","amount":120,"currency":"USD","sub_id":"homepage_widget","sub_id_2":"cohort_a","timestamp":"2026-03-21T03:10:00Z"}` |
| Current key id / secret | `aon_cb_v2` / `aon-postback-secret-demo-current` |
| Previous key id / secret | `aon_cb_v1` / `aon-postback-secret-demo-previous` |

The signing string is exactly `POST\n{request-target}\n{raw-body}\n{timestamp}`.
There is no nonce component. The request-target is byte-preserved: do not
decode, sort, normalize, or re-serialize it.

## Verification vectors

| Case | X-AON-Key | Timestamp | X-AON-Signature | Expected result |
|---|---|---:|---|---|
| Current key, valid body | `aon_cb_v2` | 1776450600 | `8b0d7aa29c9717dc0fdcb278237050d6a5c1ca816ad0b6560b8240722304a5b8` | Validate and process subject to idempotency. |
| Previous key inside grace | `aon_cb_v1` | 1776450600 | `4205100409775f6e849996127258d4e4e98446ee827fe633ed621df94c1df807` | Validate with the selected previous secret. |
| Unknown key | `aon_cb_unknown` | 1776450600 | any value | Reject; do not try another secret. |
| Tampered body | `aon_cb_v2` | 1776450600 | current-key value above | Reject; raw body no longer matches. |
| Expired timestamp | `aon_cb_v2` | 1776100000 | `98e8425ef979d04570977acd7e021c1d44ad95e5fdf5acdc86c6180f95cc01a2` | Reject before business processing. |
| Exactly 300 seconds skew | selected valid key | receiver time ±300 seconds | recomputed valid value | Accept the freshness boundary. |
| 301 seconds skew | selected valid key | receiver time ±301 seconds | recomputed valid value | Reject the freshness boundary. |

Receivers use a constant-time comparison for a known key. A production receiver
requires all three headers. Only an explicitly local/test insecure mode may
skip timestamp, key, and signature verification; it still validates schema and
idempotency.

## Idempotency vectors

| First / repeated delivery | Expected result |
|---|---|
| First valid `agent_id`, `event_id`, and raw body | Apply the business effect and record durable state. |
| Same identifiers and same raw body within at least 24 hours | Return 2xx without a second effect. |
| Same identifiers and a different raw body | Return HTTP 409 without processing the second body. |

## Reproducing the current-key vector

```bash
printf 'POST\n/webhook/aon/conversion?source=aon&delivery=conversion\n%s\n%s' \
  '{"event_id":"evt_01J0AONCONVERSION000001","event_type":"conversion","aon_tracking_id":"trk_01_click_abc","offer_id":"ao_01HX2B3C4D5E6F7G8H9J0KABCD","agent_id":"agt_assistant_123","event_name":"subscription","amount":120,"currency":"USD","sub_id":"homepage_widget","sub_id_2":"cohort_a","timestamp":"2026-03-21T03:10:00Z"}' \
  1776450600 \
  | openssl dgst -sha256 -hmac 'aon-postback-secret-demo-current' -hex
```

The expected digest is pinned by `postback-agent-webhook-v0.2.json`.
