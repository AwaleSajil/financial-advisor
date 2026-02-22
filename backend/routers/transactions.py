import hashlib
import logging

from fastapi import APIRouter, Depends, HTTPException
from backend.dependencies import get_current_user, get_supabase
from backend.schemas.transactions import TransactionCreate, TransactionResponse

logger = logging.getLogger("moneyrag.routers.transactions")

router = APIRouter()


@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    body: TransactionCreate,
    user: dict = Depends(get_current_user),
):
    """Insert a manually-entered transaction. user_id always comes from JWT."""
    logger.info("Creating manual transaction for user_id=%s: %s", user["id"], body.description)

    user_id = user["id"]

    # Content hash (same algorithm as money_rag.py _ingest_csv)
    date_str = body.trans_date.isoformat()
    amount_str = str(round(body.amount, 2))
    merchant = (body.merchant_name or body.description).lower().strip().split()[0]
    merchant_clean = "".join(c for c in merchant if c.isalnum())
    hash_input = f"{date_str}{amount_str}{merchant_clean}"
    content_hash = hashlib.sha256(hash_input.encode()).hexdigest()

    record = {
        "user_id": user_id,
        "description": body.description,
        "amount": body.amount,
        "trans_date": date_str,
        "category": body.category,
        "merchant_name": body.merchant_name or body.description,
        "source": "manual",
        "content_hash": content_hash,
    }

    try:
        sb = get_supabase(access_token=user.get("access_token"))
        result = sb.table("Transaction").upsert([record], on_conflict="content_hash").execute()

        if result.data:
            row = result.data[0]
            return TransactionResponse(
                id=row["id"],
                description=row["description"],
                amount=float(row["amount"]),
                trans_date=str(row["trans_date"]),
                category=row.get("category", "Uncategorized"),
                merchant_name=row.get("merchant_name"),
            )

        # Fallback: fetch by hash if upsert didn't return data
        fetch = (
            sb.table("Transaction")
            .select("*")
            .eq("content_hash", content_hash)
            .eq("user_id", user_id)
            .execute()
        )
        if fetch.data:
            row = fetch.data[0]
            return TransactionResponse(
                id=row["id"],
                description=row["description"],
                amount=float(row["amount"]),
                trans_date=str(row["trans_date"]),
                category=row.get("category", "Uncategorized"),
                merchant_name=row.get("merchant_name"),
            )
        raise HTTPException(status_code=500, detail="Transaction insert returned no data")
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to create transaction: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to save transaction: {e}")
