#backend/auth/routes.py

from fastapi import APIRouter, HTTPException, Request
from backend.auth.schemas import UserCreate, UserLogin
from backend.auth import auth_utils
from backend.db.collections import get_users_collection

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(user: UserCreate, request: Request):
    users_collection = get_users_collection(request.app)
    try:
        print("Signup data received:", user)
        existing_user = await users_collection.find_one({"username": user.username})
        print("Existing user:", existing_user)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        hashed_pw = auth_utils.hash_password(user.password)
        print("Hashed password:", hashed_pw)

        new_user = {"username": user.username, "hashed_password": hashed_pw}
        result = await users_collection.insert_one(new_user)
        print("Inserted ID:", result.inserted_id)

        return {"msg": "User created successfully"}
    except Exception as e:
        print("Signup error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")



@router.post("/login")
async def login(user: UserLogin, request: Request):
    users_collection = get_users_collection(request.app)
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or not auth_utils.verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth_utils.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
