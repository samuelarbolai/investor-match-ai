import time

import pytest

from app.utils.signature import compute_signature, verify_signature


def test_compute_and_verify_signature():
    secret = "secret"
    timestamp = str(int(time.time()))
    body = b'{"foo":"bar"}'
    expected = compute_signature(secret, body, timestamp)
    # Should not raise
    verify_signature(secret, expected, body, timestamp, max_skew_seconds=10_000_000)


def test_invalid_signature_raises():
    with pytest.raises(Exception):
        verify_signature("abc", "def", b"{}", None)


def test_timestamp_too_old_raises():
    secret = "secret"
    body = b"{}"
    timestamp = "946684800"  # Jan 1 2000
    signature = compute_signature(secret, body, timestamp)
    with pytest.raises(Exception):
        verify_signature(secret, signature, body, timestamp, max_skew_seconds=60)
