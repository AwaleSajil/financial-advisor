import asyncio
import logging

from backend.dependencies import get_supabase

logger = logging.getLogger("moneyrag.services.config")


def _get_config_sync(access_token: str, user_id: str) -> dict | None:
    logger.debug("Querying AccountConfig for user_id=%s", user_id)
    client = get_supabase(access_token)
    res = client.table("AccountConfig").select("*").eq("user_id", user_id).execute()
    if res.data:
        logger.debug(
            "AccountConfig found for user_id=%s — provider=%s, model=%s",
            user_id, res.data[0].get("llm_provider"), res.data[0].get("decode_model"),
        )
        return res.data[0]
    logger.debug("No AccountConfig found for user_id=%s", user_id)
    return None


def _upsert_config_sync(access_token: str, user_id: str, data: dict) -> dict:
    logger.debug(
        "Upserting AccountConfig for user_id=%s — provider=%s, model=%s, embedding=%s",
        user_id, data["llm_provider"], data["decode_model"], data["embedding_model"],
    )
    client = get_supabase(access_token)
    record = {
        "user_id": user_id,
        "llm_provider": data["llm_provider"],
        "api_key": data["api_key"],
        "decode_model": data["decode_model"],
        "embedding_model": data["embedding_model"],
    }
    existing = client.table("AccountConfig").select("id").eq("user_id", user_id).execute()
    if existing.data:
        logger.debug("Updating existing AccountConfig id=%s for user_id=%s", existing.data[0]["id"], user_id)
        client.table("AccountConfig").update(record).eq("id", existing.data[0]["id"]).execute()
    else:
        logger.debug("Inserting new AccountConfig for user_id=%s", user_id)
        client.table("AccountConfig").insert(record).execute()
    logger.debug("AccountConfig upsert complete for user_id=%s", user_id)
    return record


async def get_config(user: dict) -> dict | None:
    logger.debug("get_config called for user_id=%s", user["id"])
    result = await asyncio.to_thread(_get_config_sync, user["access_token"], user["id"])
    logger.debug("get_config returning %s for user_id=%s", "config" if result else "None", user["id"])
    return result


async def upsert_config(user: dict, data: dict) -> dict:
    logger.debug("upsert_config called for user_id=%s", user["id"])
    result = await asyncio.to_thread(_upsert_config_sync, user["access_token"], user["id"], data)
    logger.debug("upsert_config complete for user_id=%s", user["id"])
    return result
