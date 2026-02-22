from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    description: str
    amount: float = Field(gt=0)
    trans_date: date
    category: str = "Uncategorized"
    merchant_name: Optional[str] = None


class TransactionResponse(BaseModel):
    id: str
    description: str
    amount: float
    trans_date: str
    category: str
    merchant_name: Optional[str]
