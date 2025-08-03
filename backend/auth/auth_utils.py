#backend/auth/auth_utils.py
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt

# Explicitly load .env from backend/db/.env
env_path = os.path.join(os.path.dirname(__file__), '../db/.env')
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    if not SECRET_KEY:
        raise ValueError("JWT_SECRET not set in environment")
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
