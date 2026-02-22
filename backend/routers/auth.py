import logging

from fastapi import APIRouter, Depends, HTTPException
from backend.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, UserInfo
from backend.config import get_settings, Settings
from backend.dependencies import get_current_user
from supabase import create_client

logger = logging.getLogger("moneyrag.routers.auth")

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, settings: Settings = Depends(get_settings)):
    logger.debug("Login attempt for email=%s", body.email)
    try:
        logger.debug("Creating Supabase client for login")
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.debug("Calling sign_in_with_password for email=%s", body.email)
        res = client.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password,
        })
        logger.info("Login successful — user_id=%s, email=%s", res.user.id, body.email)

        # Upsert User table (mirrors app.py lines 219-226)
        try:
            logger.debug("Upserting User table for user_id=%s", res.user.id)
            client.table("User").upsert({
                "id": res.user.id,
                "email": body.email,
                "hashed_password": "managed_by_supabase_auth",
            }).execute()
            logger.debug("User table upsert succeeded")
        except Exception as sync_e:
            logger.warning("Could not sync user to User table: %s", sync_e)

        return AuthResponse(
            user=UserInfo(id=res.user.id, email=body.email),
            access_token=res.session.access_token,
        )
    except Exception as e:
        logger.error("Login failed for email=%s: %s", body.email, e, exc_info=True)
        raise HTTPException(status_code=401, detail=f"Login failed: {e}")


@router.post("/register")
async def register(body: RegisterRequest, settings: Settings = Depends(get_settings)):
    logger.debug("Registration attempt for email=%s", body.email)
    try:
        logger.debug("Creating Supabase client for registration")
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.debug("Calling sign_up for email=%s", body.email)
        res = client.auth.sign_up({
            "email": body.email,
            "password": body.password,
        })
        logger.info("Registration successful — user_id=%s, email=%s", res.user.id, body.email)

        if res.user:
            try:
                logger.debug("Upserting User table for new user_id=%s", res.user.id)
                client.table("User").upsert({
                    "id": res.user.id,
                    "email": body.email,
                    "hashed_password": "managed_by_supabase_auth",
                }).execute()
                logger.debug("User table upsert succeeded for new user")
            except Exception as upsert_e:
                logger.warning("Could not sync new user to User table: %s", upsert_e)

        return {
            "user": {"id": res.user.id, "email": body.email},
            "message": "Account created successfully",
        }
    except Exception as e:
        logger.error("Registration failed for email=%s: %s", body.email, e, exc_info=True)
        raise HTTPException(status_code=400, detail=f"Signup failed: {e}")


@router.post("/logout")
async def logout(user: dict = Depends(get_current_user)):
    logger.info("Logout for user_id=%s", user["id"])
    return {"message": "Logged out"}
