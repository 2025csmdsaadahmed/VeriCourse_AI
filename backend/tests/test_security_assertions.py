import pytest
from app.core.security import hash_password, verify_password

def test_password_hashing_and_verification():
    raw_password = "Student@123"
    hashed = hash_password(raw_password)
    
    # Hash must be generated and different from raw text
    assert hashed is not None
    assert hashed != raw_password
    assert len(hashed) > 20
    
    # Verify matches correctly with true password
    assert verify_password(raw_password, hashed) is True
    
    # Verify rejects incorrect password
    assert verify_password("WrongPassword@123", hashed) is False

def test_distinct_hashes_for_same_password():
    raw_password = "SecurePassword@456"
    hash1 = hash_password(raw_password)
    hash2 = hash_password(raw_password)
    
    # Argon2 / Bcrypt salts should produce unique hashes for same input
    assert hash1 != hash2
    assert verify_password(raw_password, hash1) is True
    assert verify_password(raw_password, hash2) is True
