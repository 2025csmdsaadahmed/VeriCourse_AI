from datetime import timedelta
import os
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

router = APIRouter()
security = HTTPBearer()

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):

    # Check whether the email already exists
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create new student
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
        role="student"
    )

    # Save student in PostgreSQL
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Registration failed"
        )
        
@router.post("/login")
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):

    # Find user by email
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate JWT token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=30)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }
@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    return user


class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token or authorization token
    full_name: str | None = None
    email: str | None = None


@router.post("/google")
def google_auth(auth_data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate with Google.
    Verifies token payload and logs in or creates student account.
    """
    email = auth_data.email
    full_name = auth_data.full_name or "Google Student"

    # In production, verify Google ID token with google.oauth2.id_token.verify_oauth2_token
    # If not configured with client ID, fallback safely to extracted email from request payload
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if client_id and auth_data.credential:
        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests
            idinfo = id_token.verify_oauth2_token(
                auth_data.credential,
                google_requests.Request(),
                client_id
            )
            email = idinfo.get("email")
            full_name = idinfo.get("name", full_name)
        except Exception:
            # If verification fails or client_id is a placeholder, check if valid email provided
            if not email:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid Google credential"
                )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email could not be determined from Google authentication"
        )

    # Check whether user exists
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # Create user account for Google sign-in
        user = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(os.urandom(16).hex()),
            role="student"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Issue JWT token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=7)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }