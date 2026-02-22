import logging
import sys
import os

# Add project root to path so we can import money_rag.py directly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from money_rag import MoneyRAG

logger = logging.getLogger("moneyrag.services.rag_manager")


class RAGManager:
    """Manages per-user MoneyRAG instances, replacing Streamlit session_state."""

    def __init__(self):
        self._instances: dict[str, MoneyRAG] = {}
        logger.debug("RAGManager initialized — empty instance cache")

    async def get_or_create(self, user: dict, config: dict) -> MoneyRAG:
        user_id = user["id"]
        if user_id not in self._instances:
            logger.info(
                "Creating new MoneyRAG instance for user_id=%s — provider=%s, model=%s, embedding=%s",
                user_id,
                config["llm_provider"],
                config.get("decode_model", "gemini-3-flash-preview"),
                config.get("embedding_model", "gemini-embedding-001"),
            )
            self._instances[user_id] = MoneyRAG(
                llm_provider=config["llm_provider"],
                model_name=config.get("decode_model", "gemini-3-flash-preview"),
                embedding_model_name=config.get("embedding_model", "gemini-embedding-001"),
                api_key=config["api_key"],
                user_id=user_id,
                access_token=user.get("access_token"),
            )
            logger.debug("MoneyRAG instance created for user_id=%s", user_id)
        else:
            logger.debug("Reusing cached MoneyRAG instance for user_id=%s", user_id)
        logger.debug("Active RAG instances: %d", len(self._instances))
        return self._instances[user_id]

    async def invalidate(self, user_id: str):
        if user_id in self._instances:
            logger.info("Invalidating RAG instance for user_id=%s", user_id)
            try:
                await self._instances[user_id].cleanup()
                logger.debug("Cleanup succeeded for user_id=%s", user_id)
            except Exception as e:
                logger.warning("Cleanup failed for user_id=%s: %s", user_id, e, exc_info=True)
            del self._instances[user_id]
            logger.debug("RAG instance removed — %d active instances remain", len(self._instances))
        else:
            logger.debug("No RAG instance to invalidate for user_id=%s", user_id)

    async def cleanup_all(self):
        logger.info("Cleaning up all RAG instances — %d active", len(self._instances))
        for uid in list(self._instances):
            await self.invalidate(uid)
        logger.info("All RAG instances cleaned up")


rag_manager = RAGManager()
